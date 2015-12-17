import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  const container = utils.query(".Sunspots");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/sunspots\"]"));


  utils.activate(utils.query(".Loader", container));
  API.getSunspotRegions().then((res) => {
    utils.deactivate(utils.query(".Loader", container));
    utils.sunspots(container, res.body);
  });

}
