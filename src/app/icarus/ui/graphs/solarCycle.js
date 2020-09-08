import d3 from 'd3'
import * as utils from '../utils'

export function solarCycleGraph(el, type1, type2, type3) {
  const container = utils.query('.Graph__content', el)
  utils.clear(container)

  const parseDate = d3.time.format('%Y-%m-%d').parse

  let minDate = Number.MAX_VALUE,
    maxDate = Number.MIN_VALUE,
    minValue = Number.MAX_VALUE,
    maxValue = Number.MIN_VALUE

  type1.forEach(function (d) {
    d.date = parseDate(d.date)

    minDate = Math.min(d.date.getTime(), minDate)

    minValue = Math.min(d.value, minValue)
    maxValue = Math.max(d.value, maxValue)
  })

  type2.forEach(function (d) {
    d.date = parseDate(d.date)

    maxDate = Math.max(d.date.getTime(), maxDate)

    minValue = Math.min(d.value, minValue)
    maxValue = Math.max(d.value, maxValue)
  })

  type3.forEach(function (d) {
    d.date = parseDate(d.date)

    minValue = Math.min(d.value, minValue)
    maxValue = Math.max(d.value, maxValue)
  })

  const r = utils.rect(container)

  const margin = {
      top: 0,
      right: 0,
      bottom: 36,
      left: 64,
    },
    width = r.width - margin.left - margin.right,
    height = r.height - margin.top - margin.bottom,
    sWidth = r.width + margin.left,
    sHeight = r.height + margin.top

  const x = d3.time.scale().range([0, width])

  const y = d3.scale.linear().range([height, 0])

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

  const line1 = d3.svg
    .line()
    .interpolate('basis')
    .x(function (d) {
      return x(d.date)
    })
    .y(function (d) {
      return y(d.value)
    })

  const line2 = d3.svg
    .line()
    .interpolate('basis')
    .x(function (d) {
      return x(d.date)
    })
    .y(function (d) {
      return y(d.value)
    })

  const line3 = d3.svg
    .line()
    .interpolate('basis')
    .x(function (d) {
      return x(d.date)
    })
    .y(function (d) {
      return y(d.value)
    })

  const svg = d3
    .select(container)
    .append('svg')
    .attr('class', 'Graph__image')
    .attr('width', '100%')
    .attr('height', '100%')
    //.attr("viewBox","0 0 " + Math.max(sWidth,sHeight) + " " + Math.min(sWidth,sHeight))
    .attr('viewBox', '0 0 ' + r.width + ' ' + r.height)
    //.attr("preserveAspectRatio", "none")
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  x.domain([minDate, maxDate])
  y.domain([minValue, maxValue])

  svg
    .append('path')
    .datum(type1)
    .attr('class', 'Graph__line Graph__smoothed')
    .attr('d', line1)

  svg
    .append('path')
    .datum(type2)
    .attr('class', 'Graph__line Graph__predicted')
    .attr('d', line2)

  svg
    .append('path')
    .datum(type3)
    .attr('class', 'Graph__line Graph__observed')
    .attr('d', line3)

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
    .text('MeV')

  return el
}
