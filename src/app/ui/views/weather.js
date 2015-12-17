import * as utils from "../utils";
import API from "../../api";

let lastQuery;

export function view(router) {

  if (!router.query.filter && !router.query.flux) {
    return router.redirect({
      filter: 1,
      flux: "solar-wind"
    });
  }

  const container = utils.query(".Weather");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/weather\"]"));
  utils.activate(utils.query(`[data-param-name="filter"][data-param-value="${router.query.filter}"]`));
  utils.activate(utils.query(`[data-param-name="flux"][data-param-value="${router.query.flux}"]`));

  if (!lastQuery || (lastQuery.filter !== router.query.filter)) {

    const eitFiltersContainer = utils.query(".Weather__EITFilters", container);

    utils.activate(utils.query(".Loader", eitFiltersContainer));

    API.getImageChannels({
      channeltype: router.query.filter
    }).then((res) => {

      const images = res.body;

      utils.deactivate(utils.query(".Loader", eitFiltersContainer));

      const image = utils.query("img", eitFiltersContainer);

      const r = utils.rect(utils.query(".Sun__container", eitFiltersContainer));
      utils.setAttr(image, "width", Math.min(r.width,r.height));
      utils.setAttr(image, "src", images[0].image);

    });

  }

  if (!lastQuery || (lastQuery.flux !== router.query.flux)) {

    const fluxesContainer = utils.query(".Weather__fluxes", container);
    const fluxesLoader = utils.query(".Loader", fluxesContainer);
    utils.activate(fluxesLoader);

    switch(router.query.flux) {
      default:
      case "solar-wind":
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
