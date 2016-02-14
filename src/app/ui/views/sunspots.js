import * as utils from "../utils";
import graphs from "../graphs";
import API from "../../api";

export function view(router) {

  const container = utils.query(".Sunspots");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/sunspots\"]"));

  /*const minDateFormatted = "2015-12-16",
        maxDateFormatted = "2015-12-16",
        minDateFormattedImage = "2015-12-16",
        maxDateFormattedImage = "2015-12-16";*/

  const minDateFormatted = utils.daysFrom(-1),
        maxDateFormatted = utils.daysFrom(-1),
        minDateFormattedImage = utils.daysFrom(-2),
        maxDateFormattedImage = utils.daysFrom(0);

  utils.activate(utils.query(".Loader", container));
  Promise.all([

    API.getImageChannels({
      channeltype: 5,
      date_min: minDateFormattedImage,
      date_max: maxDateFormattedImage
    }),

    API.getSunspotRegions({
      date_min: minDateFormatted,
      date_max: maxDateFormatted
    })

  ]).then((res) => {

    let images = [];
    res[0].body.forEach((image) => {
      if (new Date(image.date).getHours() === 17) {
        images.push(image);
      }
    });

    utils.deactivate(utils.query(".Loader", container));
    graphs.sunspots(container, images, res[1].body);

  });

}
