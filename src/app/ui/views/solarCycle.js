import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  const container = utils.query(".SolarCycle");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/solar-cycle\"]"));
  utils.activate(utils.query(".SolarCycle .Loader"));

  Promise.all([
    API.getSunspots({
      sunspottype: 1
    }),
    API.getSunspots({
      sunspottype: 2
    }),
    API.getSunspots({
      sunspottype: 3
    })
  ]).then((res) => {
    utils.deactivate(utils.query(".SolarCycle .Loader", container));
    utils.sunspotsGraph(container, res[0].body,res[1].body,res[2].body);
  });

}
