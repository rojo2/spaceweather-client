import d3 from 'd3'
import * as utils from '../utils'

function graph(el, data, options = {}) {
  options = Object.assign(
    {
      yStart: Infinity,
      yEnd: Infinity,
      unit: 'MeV',
    },
    options
  )

  const container = utils.query('.Graph__content', el)
  utils.clear(container)

  const parseDate = d3.time.format('%Y-%m-%dT%H:%M:%SZ').parse

  data.forEach(function (d) {
    d.date = parseDate(d.date)
  })

  const r = utils.rect(container)

  const margin = {
      top: 0,
      right: 0,
      bottom: 32,
      left: 42,
    },
    width = r.width - margin.left - margin.right,
    height = r.height - margin.top - margin.bottom,
    sWidth = r.width + margin.left,
    sHeight = r.height + margin.top

  const x = d3.time.scale().range([0, width])

  const y = d3.scale.log().base(10).range([height, 0])

  const xAxis = d3.svg
    .axis()
    .scale(x)
    .orient('bottom')
    .tickSize(-height, 0)
    .tickPadding(16)

  const yAxis = d3.svg
    .axis()
    .scale(y)
    .orient('left')
    .tickSize(-width)
    .tickPadding(16)

  const line = d3.svg
    .line()
    .interpolate('basis')
    .x(function (d) {
      return x(d.date)
    })
    .y(function (d) {
      return y(d.value)
    })

  const area =
    Number.isFinite(options.yStart) && Number.isFinite(options.yEnd)
      ? d3.svg
          .area()
          .interpolate('basis')
          .x(function (d) {
            return x(d.date)
          })
          .y0(function (d) {
            return y(options.yStart)
          })
          .y1(function (d) {
            return y(d.value)
          })
      : null

  const svg = d3
    .select(container)
    .append('svg')
    .attr('class', 'Graph__image')
    .attr('width', r.width)
    .attr('height', r.height)
    //.attr("viewBox","0 0 " + Math.max(sWidth,sHeight) + " " + Math.min(sWidth,sHeight))
    .attr('viewBox', '0 0 ' + r.width + ' ' + r.height)
    //.attr("preserveAspectRatio", "none")
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain(
    d3.extent(data, function (d) {
      return d.date
    })
  )
  if (Number.isFinite(options.yStart) && Number.isFinite(options.yEnd)) {
    y.domain([options.yStart, options.yEnd])
  } else {
    y.domain(
      d3.extent(data, function (d) {
        return d.value
      })
    )
  }

  if (area) {
    svg.append('path').datum(data).attr('class', 'Graph__area').attr('d', area)
  }

  svg.append('path').datum(data).attr('class', 'Graph__line').attr('d', line)

  svg
    .append('g')
    .attr('class', 'Graph__axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg
    .append('g')
    .attr('class', 'Graph__axis')
    .call(yAxis)
    .append('text')
    .attr('class', 'Graph__text')
    .attr('transform', 'rotate(-90)')
    .style('text-anchor', 'end')
    .text(options.unit)

  return el
}
