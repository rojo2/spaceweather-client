import * as utils from "../utils";
import API from "../../api";

let lastQuery,
    timeline,
    images;

function updateImage(el, value = 0) {

  if (images) {

    const imageIndex = Math.floor(value * (images.length - 1));

    const r = utils.rect(el.parentElement);
    utils.setAttr(el, "width", Math.min(r.width,r.height));
    utils.setAttr(el, "src", images[imageIndex].image);

  }

}

export function view(router) {

  if (!router.query.filter && !router.query.flux) {
    return router.redirect({
      filter: 1,
      flux: "solar-wind"
    });
  }

  const container = utils.query(".Weather");
  const eitFiltersContainer = utils.query(".Weather__EITFilters", container);
  const imageContainer = utils.query("img", eitFiltersContainer);

  utils.activate(container);
  utils.activate(utils.query("[href=\"/weather\"]"));
  utils.activate(utils.query(`[data-param-name="filter"][data-param-value="${router.query.filter}"]`));
  utils.activate(utils.query(`[data-param-name="flux"][data-param-value="${router.query.flux}"]`));

  if (!timeline) {
    timeline = utils.timeline(utils.query(".Timeline", container), (value) => {
      if (images) {
        updateImage(imageContainer, value);
      }
      console.log("value", value);
    });
  }

  if (!lastQuery || (lastQuery.filter !== router.query.filter)) {

    utils.activate(utils.query(".Loader", eitFiltersContainer));

    API.getImageChannels({
      channeltype: router.query.filter
    }).then((res) => {

      images = res.body;

      let minDate = Number.MAX_VALUE, maxDate = Number.MIN_VALUE;
      images.forEach((image) => {

        image.date = new Date(image.date);

        minDate = Math.min(image.date.getTime(), minDate);
        maxDate = Math.max(image.date.getTime(), maxDate);

      });

      const dateStart = new Date(minDate),
            dateEnd = new Date(maxDate);

      utils.text(utils.query(".Timeline__dateStart", eitFiltersContainer), utils.dateFormatted(dateStart));
      utils.text(utils.query(".Timeline__dateEnd", eitFiltersContainer), utils.dateFormatted(dateEnd));

      utils.deactivate(utils.query(".Loader", eitFiltersContainer));

      updateImage(imageContainer);

    });

  }

  if (!lastQuery || (lastQuery.flux !== router.query.flux)) {

    const fluxesContainer = utils.query(".Weather__fluxes", container);
    const fluxesLoader = utils.query(".Loader", fluxesContainer);
    utils.activate(fluxesLoader);

    switch(router.query.flux) {
      default:
      case "solar-wind":
        API.getSolarWind({
          ptype: 1
        }).then((res) => {
          utils.deactivate(fluxesLoader);
          utils.solarWindGraph(container, res.body);
        });
        break;

      case "particle":
        API.getProtonFlux({
          ptype: 1
        }).then((res) => {
          utils.deactivate(fluxesLoader);
          utils.protonFluxGraph(container, res.body);
        });
        break;

      case "electron":
        API.getElectronFlux({
          etype: 2
        }).then((res) => {
          utils.deactivate(fluxesLoader);
          utils.electronFluxGraph(container, res.body);
        });
        break;

      case "x-ray":
        API.getXrayFlux({
          xtype: 2
        }).then((res) => {
          utils.deactivate(fluxesLoader);
          utils.xrayFluxGraph(container, res.body);
        });
        break;
    }

  }

  lastQuery = JSON.parse(JSON.stringify(router.query));

}
