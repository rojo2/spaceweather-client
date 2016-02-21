import d3 from "d3";
import * as utils from "../utils";

export function solarWindGraph(el, data) {

  const container = utils.query(".Graph__content", el);
  utils.clear(container);

  const parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;

  let minDate = Number.MAX_VALUE,
      maxDate = Number.MIN_VALUE,
      minDensity = Number.MAX_VALUE,
      maxDensity = Number.MIN_VALUE,
      minTemperature = Number.MAX_VALUE,
      maxTemperature = Number.MIN_VALUE,
      minSpeed = Number.MAX_VALUE,
      maxSpeed = Number.MIN_VALUE;

  data.forEach(function(d) {

    d.date = parseDate(d.date);

    minDate = Math.min(d.date.getTime(), minDate);
    maxDate = Math.max(d.date.getTime(), maxDate);

    minDensity = Math.min(d.density, minDensity);
    maxDensity = Math.max(d.density, maxDensity);

    minTemperature = Math.min(d.temperature, minTemperature);
    maxTemperature = Math.max(d.temperature, maxTemperature);

    minSpeed = Math.min(d.radialspeed, minSpeed);
    maxSpeed = Math.max(d.radialspeed, maxSpeed);

  });

  const r = utils.rect(container);

  const margin = {
      top: 0,
      right: 64,
      bottom: 36,
      left: 64
    },
    width = r.width - margin.left - margin.right,
    height = r.height - margin.top - margin.bottom,
    sWidth = r.width + margin.left,
    sHeight = r.height + margin.top;

  const x = d3.time.scale()
    .range([0, width]);

  const yd = d3.scale.linear()
    .range([height, 0]);

  const yt = d3.scale.linear()
    .range([height, 0]);

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height, 0)
    .tickPadding(16);

  const yAxisLeft = d3.svg.axis()
    .scale(yd)
    .orient("left")
    .tickSize(-width)
    .tickPadding(16);

  const yAxisRight = d3.svg.axis()
    .scale(yt)
    .orient("right")
    .tickSize(-width)
    .tickPadding(16);

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

  x.domain([minDate, maxDate]);

  yd.domain([minDensity, maxDensity]);
  yt.domain([minTemperature, maxTemperature]);

  svg.append("g")
    .attr("class", "Graph__density")
    .selectAll(".Graph__density")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "Graph__dot")
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return yd(d.density); })
    .attr("r",1)
    //.attr("height",1)

  svg.append("g")
    .attr("class", "Graph__temperature")
    .selectAll(".Graph__temperature")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "Graph__dot")
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return yt(d.temperature); })
    .attr("r",1)
//    .attr("height",2)

  svg.append("g")
    .attr("class", "Graph__axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "Graph__axis")
    .attr("transform", "translate(" + 0 + ",0)")
    .call(yAxisLeft)
    .append("text")
    .attr("class", "Graph__text")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text("Density (P/cm³)");

  svg.append("g")
    .attr("class", "Graph__axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxisRight)
    .append("text")
    .attr("class", "Graph__text")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start")
    .text("Temperature (K)");

  svg
    .append("line")
    .attr("class", "Graph__timeline")
    .attr("y1",0)
    .attr("y2",r.height - margin.top - margin.bottom);

  return el;
}
