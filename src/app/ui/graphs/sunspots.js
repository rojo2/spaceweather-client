import d3 from "d3";
import * as utils from "../utils";

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

  const container = utils.query(".Graph__content", el);
  utils.clear(container);

  const r = utils.rect(container),
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

  if (!images[0] || !images[0].image) {

    console.error("Image not available");
    svg.append("image")
      .attr("width", r.width)
      .attr("height", r.height)
      .attr("xlink:href", "images/image-not-available.jpg");

  } else {

    svg.append("image")
      .attr("width", r.width)
      .attr("height", r.height)
      .attr("xlink:href", images[0].image);

  }

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
