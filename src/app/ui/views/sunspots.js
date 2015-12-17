import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  const container = utils.query(".Sunspots");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/sunspots\"]"));

  const minDateFormatted = utils.daysFrom(1);

  utils.activate(utils.query(".Loader", container));
  Promise.all([
    API.getImageChannels({
      channeltype: 5,
      date_min: minDateFormatted
    }),
    API.getSunspotRegions({
      date_min: minDateFormatted
    })
  ]).then((res) => {
    utils.deactivate(utils.query(".Loader", container));
    utils.sunspots(container, res[0].body, res[1].body);
  });

}
