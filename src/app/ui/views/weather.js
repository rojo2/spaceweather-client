import * as utils from "../utils";
import API from "../../api";

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
  utils.activate(utils.query(".Weather__EITFilters .Loader", container));
  utils.activate(utils.query(".Weather__fluxes .Loader", container));
  utils.activate(utils.query(`[data-param-name="filter"][data-param-value="${router.query.filter}"]`));
  utils.activate(utils.query(`[data-param-name="flux"][data-param-value="${router.query.flux}"]`));

  API.getImageChannels({
    channeltype: router.query.filter
  }).then((res) => {
    console.log(res.body);
    const images = res.body;
    utils.deactivate(utils.query(".Weather__EITFilters .Loader", container));
    utils.setAttr(utils.query(".Weather__EITFilters img"), "src", images[0].image);
  });

  switch(router.query.flux) {
    default:
    case "solar-wind":
      break;

    case "particle":
      API.getProtonFlux({
        ptype: 1
      }).then((res) => {
        utils.deactivate(utils.query(".Weather__fluxes .Loader", container));
        utils.protonFluxGraph(container, res.body);
      });
      break;

    case "electron":
      API.getElectronFlux({
        etype: 2
      }).then((res) => {
        utils.deactivate(utils.query(".Weather__fluxes .Loader", container));
        utils.electronFluxGraph(container, res.body);
      });
      break;

    case "x-ray":
      API.getXrayFlux({
        xtype: 2
      }).then((res) => {
        utils.deactivate(utils.query(".Weather__fluxes .Loader", container));
        utils.xrayFluxGraph(container, res.body);
      });
      break;
  }


}
