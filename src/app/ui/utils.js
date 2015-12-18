import d3 from "d3";

export function rect(el) {
  return el.getBoundingClientRect();
}

export function timeline(el, fn) {
  const progress = el,
        fill = query(".Timeline__fill", progress),
        mark = query(".Timeline__mark", progress);

  function updateFromEvent(e) {
    const r = rect(progress);

    const value = Math.max(0,Math.min(1,(e.clientX - r.left) / r.width));
    mark.style.left = (value * 100) + "%";
    fill.style.transform = `scaleX(${value})`;

    if (typeof fn === "function") {
      fn(value);
    }
  }

  function handleClick(e) {
    if (e.button === 0) {
      updateFromEvent(e);
    }
  }

  function handleMove(e) {
    updateFromEvent(e);
  }

  function handleDown(e) {
    if (e.button === 0) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    }
  }

  function handleUp(e) {
    if (e.button === 0) {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    }
  }

  mark.addEventListener("mousedown", handleDown);
  progress.addEventListener("click", handleClick);

  return el;
}

export function query(selector, el = document) {
  return el.querySelector(selector);
}

export function queryAll(selector, el = document) {
  return Array.prototype.slice.apply(el.querySelectorAll(selector));
}

export function each(list, fn) {
  for (let index = 0; index < el.children.length; index++) {
    const current = el.children[index],
          result = fn(current);

    if (result) {
      return result;
    }
  }
  return null;
}

export function children(el, fn) {
  return each(el.children, fn);
}

export function siblings(el, fn) {
  let current = el.nextElementSibling;
  while (current) {
    fn(current);
    current = current.nextElementSibling;
  }

  current = el.previousElementSibling;
  while (current) {
    fn(current);
    current = current.previousElementSibling;
  }
  return el;
}

export function deactivate(el) {
  el.classList.remove("isActive");
  return el;
}

export function activate(el) {
  if (!el) {
    debugger;
  }
  el.classList.add("isActive");
  siblings(el, deactivate);
  return el;
}

export function getAttr(el, name) {
  return el.getAttribute(name);
}

export function setAttr(el, name, value) {
  return el.setAttribute(name, value);
}

export function hasAttr(el, name) {
  return el.hasAttribute(name);
}

export function getActive(list) {
  return each(list, (current) => {
    if (current.classList.contains("isActive")) {
      return current;
    }
  });
}

export function clear(el) {
  while (el.childNodes.length > 0) {
    el.removeChild(el.lastChild);
  }
  return el;
}

export function dateYMD(date) {
  return padLeft(date.getFullYear(), "0", 4)
    + "-" + padLeft(date.getMonth(), "0", 2)
    + "-" + padLeft(date.getDate(), "0", 2);
}

export function dateFormatted(date) {
  return padLeft(date.getFullYear(), "0", 4)
    + "-" + padLeft(date.getMonth(), "0", 2)
    + "-" + padLeft(date.getDate(), "0", 2)
    + " " + padLeft(date.getHours(), "0", 2)
    + ":" + padLeft(date.getMinutes(), "0", 2);
}

export function padLeft(str, chr, length) {
  str = str.toString();
  while (str.length < length) {
    str = chr + str;
  }
  return str;
}

export function padRight(str, chr, length) {
  str = str.toString();
  while (str.length < length) {
    str += chr;
  }
  return str;
}

export function text(el, text) {
  el.textContent = text;
  return el;
}

export function add(el, child) {
  el.appendChild((typeof child === "function" ? child() : child));
  return el;
}

export function remove(el, child) {
  el.removeChild((typeof child === "function" ? child() : child));
  return el;
}

export function interpolateText(text, data = {}, filters = {}) {
  return text.replace(/\{(.*?)\}/g, (fullMatch,name) => {
    if (name in data) {
      if (name in filters) {
        const filter = filters[name];
        return filter(data[name]);
      }
      return data[name];
    }
    return name;
  });
}

export function interpolate(el, data = {}, filters = {}) {
  for (let index = 0; index < el.childNodes.length; index++) {
    const childNode = el.childNodes[index];
    if (childNode.nodeType === document.TEXT_NODE) {
      childNode.textContent = interpolateText(childNode.textContent, data, filters);
    } else if (childNode.nodeType === document.ELEMENT_NODE) {
      for (let index = 0; index < childNode.attributes.length; index++) {
        const attribute = childNode.attributes[index];
        attribute.value = interpolateText(attribute.value, data, filters);
      }
      interpolate(childNode, data, filters);
    }
  }
  return el;
}

export function template(selector, data = {}, filters = {}) {
  const element = query(selector);
  if (!element) {
    throw `Element ${selector} not found`;
  }
  const templated = document.importNode(element.content, true);
  interpolate(templated, data, filters);
  return templated;
}

function graph(el, data, options = {}) {

  options = Object.assign({
    yStart: Infinity,
    yEnd: Infinity
  }, options);

  const container = query(".Graph__content", el);
  clear(container);

  const parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  const r = rect(container);

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
    .attr("width", r.width)
    .attr("height", r.height)
    //.attr("viewBox","0 0 " + Math.max(sWidth,sHeight) + " " + Math.min(sWidth,sHeight))
    .attr("viewBox","0 0 " + r.width + " " + r.height)
    //.attr("preserveAspectRatio", "none")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d.date; }));
  if (Number.isFinite(options.yStart) && Number.isFinite(options.yEnd)) {
    y.domain([options.yStart,options.yEnd]);
  } else {
    y.domain(d3.extent(data, function(d) { return d.value; }));
  }

  if (area) {
    svg.append("path")
      .datum(data)
      .attr("class", "Graph__area")
      .attr("d", area);
  }

  svg.append("path")
    .datum(data)
    .attr("class", "Graph__line")
    .attr("d", line);

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

export function solarCycleGraph(el, type1, type2, type3) {

  const container = query(".Graph__content", el);
  clear(container);

  const parseDate = d3.time.format("%Y-%m-%d").parse;

  let minDate = Number.MAX_VALUE,
      maxDate = Number.MIN_VALUE,
      minValue = Number.MAX_VALUE,
      maxValue = Number.MIN_VALUE;

  type1.forEach(function(d) {

    d.date = parseDate(d.date);

    minDate = Math.min(d.date.getTime(), minDate);

    minValue = Math.min(d.value, minValue);
    maxValue = Math.max(d.value, maxValue);

  });

  type2.forEach(function(d) {

    d.date = parseDate(d.date);

    maxDate = Math.max(d.date.getTime(), maxDate);

    minValue = Math.min(d.value, minValue);
    maxValue = Math.max(d.value, maxValue);

  });

  type3.forEach(function(d) {

    d.date = parseDate(d.date);

    minValue = Math.min(d.value, minValue);
    maxValue = Math.max(d.value, maxValue);

  });

  const r = rect(container);

  const margin = {
      top: 0,
      right: 0,
      bottom: 36,
      left: 64
    },
    width = r.width - margin.left - margin.right,
    height = r.height - margin.top - margin.bottom,
    sWidth = r.width + margin.left,
    sHeight = r.height + margin.top;

  const x = d3.time.scale()
    .range([0, width]);

  const y = d3.scale.linear()
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

  const line1 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  const line2 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  const line3 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  const svg = d3.select(container)
    .append("svg")
    .attr("class", "Graph__image")
    .attr("width", r.width)
    .attr("height", r.height)
    //.attr("viewBox","0 0 " + Math.max(sWidth,sHeight) + " " + Math.min(sWidth,sHeight))
    .attr("viewBox","0 0 " + r.width + " " + r.height)
    //.attr("preserveAspectRatio", "none")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain([minDate, maxDate]);
  y.domain([minValue, maxValue]);

  svg.append("path")
    .datum(type1)
    .attr("class", "Graph__line Graph__smoothed")
    .attr("d", line1);

  svg.append("path")
    .datum(type2)
    .attr("class", "Graph__line Graph__predicted")
    .attr("d", line2);

  svg.append("path")
    .datum(type3)
    .attr("class", "Graph__line Graph__observed")
    .attr("d", line3);

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

export function xrayFluxGraph(el, data) {
  return graph(el, data, {
    yStart: 0.00000001,
    yEnd: 0.00006
  });
}

export function protonFluxGraph(el, data) {
  return graph(el, data, {
    yStart: 0.01,
    yEnd: 120
  });
}

export function electronFluxGraph(el, data) {
  return graph(el, data, {
    yStart: 1,
    yEnd: 120000
  });
}

export function daysFrom(days) {
  const currentDate = new Date(),
      minDate = (function() {
        const date = new Date();
        date.setTime(currentDate.getTime() + (86400 * days));
        return date;
      })(),
      minDateFormatted = dateYMD(minDate);
  return minDateFormatted;
}

export function solarWindGraph(el, data) {

  const container = query(".Graph__content", el);
  clear(container);

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

  console.log("density", minDensity, maxDensity);
  console.log("temperature", minTemperature, maxTemperature);
  console.log("speed", minSpeed, maxSpeed);

  const r = rect(container);

  const margin = {
      top: 0,
      right: 0,
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
    .tickSize(width)
    .tickPadding(16);

  const svg = d3.select(container)
    .append("svg")
    .attr("class", "Graph__image")
    .attr("width", r.width)
    .attr("height", r.height)
    //.attr("viewBox","0 0 " + Math.max(sWidth,sHeight) + " " + Math.min(sWidth,sHeight))
    .attr("viewBox","0 0 " + r.width + " " + r.height)
    //.attr("preserveAspectRatio", "none")
    .append("g")
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
    .call(yAxisLeft)
    .append("text")
    .attr("class", "Graph__text")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text("Density");

  svg.append("g")
    .attr("class", "Graph__axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxisRight)
    .append("text")
    .attr("class", "Graph__text")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "end")
    .text("Temperature");


  return el;
}

function sunspotCoord(value, positive = false) {
  return Math.sin(Math.PI * (positive ? 0.5 : -0.5)) * Math.sin(value);
}

function parseSunspot(data) {
  const NS = (data.substr(0,1) === "N" ? false : true);
  const WE = (data.substr(3,1) === "W" ? true : false);

  const alpha = parseInt(data.substr(1,2),10) / 90 * Math.PI * 0.5,
        beta = parseInt(data.substr(4,2),10) / 90 * Math.PI * 0.5;

  const x = sunspotCoord(beta, WE),
        y = sunspotCoord(alpha, NS);

  return { x, y };
}

export function sunspots(el, images, data) {

  const MARGIN = 10;

  const container = query(".Graph__content", el);
  clear(container);

  const r = rect(container),
        hw = r.width * 0.5,
        hh = r.height * 0.5,
        radius = Math.min(hw,hh) - MARGIN;

  const svg = d3.select(container)
    .append("svg")
    .attr("class", "Graph__image")
    .attr("width", r.width)
    .attr("height", r.height)
    .attr("viewBox","0 0 " + r.width + " " + r.height)
    .append("g");

  svg.append("image")
    .attr("width", r.width)
    .attr("height", r.height)
    .attr("xlink:href", images[0].image);

  svg.append("circle")
    .attr("class", "Graph__sun")
    .attr("cx", hw)
    .attr("cy", hh)
    .attr("r", radius);

  data.forEach((sunspot) => {

    const position = parseSunspot(sunspot.location);

    svg.append("circle")
      .attr("class", "Graph__sunspot")
      .attr("cx", hw + (position.x * radius))
      .attr("cy", hh + (position.y * radius))
      .attr("r", 10);

  });

}
