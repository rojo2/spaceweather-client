import d3 from "d3";

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

export function add(el, child) {
  el.appendChild((typeof child === "function" ? child() : child));
  return el;
}

export function remove(el, child) {
  el.removeChild((typeof child === "function" ? child() : child));
  return el;
}

export function fluxGraph(el, data) {

  const container = query(".Graph__content", el);
  clear(container);

  const parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  const rect = container.getBoundingClientRect();

  const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    width = rect.width - margin.left - margin.right,
    height = rect.height - margin.top - margin.bottom,
    sWidth = rect.width + margin.left,
    sHeight = rect.height + margin.top;

  const x = d3.time.scale()
    .range([0, width]);

  const y = d3.scale.log()
    .base(10)
    .range([height, 0]);

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height, 0)
    .tickPadding(6);

  const yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(-width)
    .tickPadding(6);

  const line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

  const area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(1); })
    .y1(function(d) { return y(d.value); });

  const svg = d3.select(container)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox","0 0 " + Math.max(sWidth,sHeight) + " " + Math.min(sWidth,sHeight))
    .attr("preserveAspectRatio", "none")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([1,120000]);

  svg.append("path")
    .datum(data)
    .attr("class", "Graph__area")
    .attr("d", area);

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
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text("MeV");


}
