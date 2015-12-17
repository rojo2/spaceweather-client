import * as utils from "../utils";
import API from "../../api";


function coord(value, positive = false) {
  return Math.sin(Math.PI * (positive ? 0.5 : -0.5)) * Math.sin(value);
}

function parse(data) {
  const NS = (data.substr(0,1) === "N" ? false : true);
  const WE = (data.substr(3,1) === "W" ? true : false);

  const alpha = parseInt(data.substr(1,2),10) / 90 * Math.PI * 0.5,
        beta = parseInt(data.substr(4,2),10) / 90 * Math.PI * 0.5;

  const x = coord(beta, WE),
        y = coord(alpha, NS);

  return { x, y };
}

export function view(router) {

  const container = utils.query(".Sunspots");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/sunspots\"]"));

}
