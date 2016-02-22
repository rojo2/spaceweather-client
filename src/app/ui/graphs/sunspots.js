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
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox","0 0 " + r.width + " " + r.height)
    .append("g");

  if (!images[0] || !images[0].image) {

    console.error("Image not available");
    svg.append("circle")
      .attr("class", "Image--notFound")
      .attr("cx", hw)
      .attr("cy", hh)
      .attr("r", radius);

    svg.append("line")
      .attr("class", "Image--notFound")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", r.width)
      .attr("y2", r.height);

    svg.append("line")
      .attr("class", "Image--notFound")
      .attr("x1", 0)
      .attr("y1", r.height)
      .attr("x2", r.width)
      .attr("y2", 0);

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
    console.log(sunspot);

    const position = parseSunspot(sunspot.location);

    const sunspotPanel = svg.append("g")
          .attr("class", "Graph__sunspotInfo")
          .attr("transform", "translate(" + (hw + (position.x * radius)) + " " + (hh + (position.y * radius)) + ")");

    const trigger = sunspotPanel.append("circle")
          .attr("class", "Graph__sunspot")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", 10);

    const tooltip = sunspotPanel.append("text")
          .attr("class", "Graph__sunspotText");

    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoLabel")
         .attr("x", 0)
         .attr("y", 0)
         .text("Spot class: ");
    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoValue")
         .attr("x", 132)
         .attr("y", 0)
         .text(sunspot.spotclass);

    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoLabel")
         .attr("x", 0)
         .attr("y", 20)
         .text("Magnetic class: ");
    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoValue")
         .attr("x", 132)
         .attr("y", 20)
         .text(sunspot.magneticclass);

    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoLabel")
         .attr("x", 0)
         .attr("y", 40)
         .text("Location: ");
    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoValue")
         .attr("x", 132)
         .attr("y", 40)
         .text(sunspot.location);

    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoLabel")
         .attr("x", 0)
         .attr("y", 60)
         .text("Size: ");
    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoValue")
         .attr("x", 132)
         .attr("y", 60)
         .text(sunspot.size);

    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoLabel")
         .attr("x", 0)
         .attr("y", 80)
         .text("No. of sunspots: ");
    tooltip.append("tspan")
         .attr("class", "Graph__sunspotInfoValue")
         .attr("x", 132)
         .attr("y", 80)
         .text(sunspot.numberofsunspots);
  });

}
