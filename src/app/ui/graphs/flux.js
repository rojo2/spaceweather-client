import d3 from "d3";
import * as utils from "../utils";

function fluxGraph(el, data, options = {}) {

  options = Object.assign({
    yStart: Infinity,
    yEnd: Infinity
  }, options);

  const container = utils.query(".Graph__content", el);
  utils.clear(container);

  const parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;

  data.forEach((list) => {
    list.forEach((d) => {
      d.date = parseDate(d.date);
    });
  });

  const r = utils.rect(container);

  const margin = {
      top: 0,
      right: 0,
      bottom: 32,
      left: 42
    },
    width = r.width - margin.left - margin.right,
    height = r.height - margin.top - margin.bottom,
    sWidth = r.width + margin.left,
    sHeight = r.height + margin.top;

  const x = d3.time.scale()
    .range([0, width]);

  const y = d3.scale.log()
    .base(10)
    .range([height, 0]);

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height, 0)
    .tickPadding(16);

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width)
    .tickPadding(16);

  const line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  const area = (Number.isFinite(options.yStart) && Number.isFinite(options.yEnd))
  ? d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(options.yStart); })
    .y1(function(d) { return y(d.value); })
  : null;

  const svg = d3.select(container)
    .append("svg")
    .attr("class", "Graph__image")
    .attr("width", "100%")
    .attr("height", "100%")
    //.attr("viewBox","0 0 " + Math.max(sWidth,sHeight) + " " + Math.min(sWidth,sHeight))
    .attr("viewBox","0 0 " + r.width + " " + r.height)
    //.attr("preserveAspectRatio", "none")
    .append("g")
    .attr("data-width", r.width - (margin.right + margin.left))
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("line")
    .attr("class", "Graph__timeline")
    .attr("y1",0)
    .attr("y2",r.height - margin.top - margin.bottom);

  x.domain(d3.extent(data[0], function(d) { return d.date; }));
  if (Number.isFinite(options.yStart) && Number.isFinite(options.yEnd)) {
    y.domain([options.yStart,options.yEnd]);
  } else {
    y.domain(d3.extent(data[0], function(d) { return d.value; }));
  }

  if (area) {
    data.forEach((datum, index) => {
      svg.append("path")
        .datum(datum)
        .attr("class", "Graph__area Graph__color" + index)
        .attr("d", area);
    });
  }

  data.forEach((datum, index) => {
    svg.append("path")
      .datum(datum)
      .attr("class", "Graph__line Graph__color" + index)
      .attr("d", line);
  });

  svg.append("g")
    .attr("class", "Graph__axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "Graph__axis")
    .call(yAxis)
    .append("text")
    .attr("class", "Graph__text")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text("MeV");

  return el;
}

export function xrayFluxGraph(el, data, options = {}) {
  return fluxGraph(el, data, Object.assign({
    yStart: 0.000000001,
    yEnd: 0.00006
  }, options));
}

export function protonFluxGraph(el, data, options = {}) {
  return fluxGraph(el, data, Object.assign({
    yStart: 0.01,
    yEnd: 120
  }, options));
}

export function electronFluxGraph(el, data, options = {}) {
  return fluxGraph(el, data, Object.assign({
    yStart: 0.1,
    yEnd: 120000
  }, options));
}
