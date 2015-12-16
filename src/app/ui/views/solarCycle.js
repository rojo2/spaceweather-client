import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  const container = utils.query(".SolarCycle");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/solar-cycle\"]"));
  utils.activate(utils.query(".SolarCycle .Loader"));

  API.getSunspots({
    sunspottype: 1
  }).then((res) => {
    utils.deactivate(utils.query(".SolarCycle .Loader", container));
    utils.sunspotsGraph(container, res.body);
  });

}
