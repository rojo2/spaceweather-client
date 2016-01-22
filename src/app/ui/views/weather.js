import * as utils from "../utils";
import API from "../../api";

let lastQuery,
    timeline,
    images,
    cachedImages = {};

function updateImage(el, value = 0) {

  if (images) {

    const imageIndex = Math.floor(value * (images.length - 1));

    const r = utils.rect(el.parentElement.parentElement);
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

  const minDateFormatted = utils.daysFrom(-30);

  const container = utils.query(".Weather");
  const eitFiltersContainer = utils.query(".Weather__EITFilters", container);
  const imageContainer = utils.query("img", eitFiltersContainer);

  utils.activate(container);
  utils.activate(utils.query("[href=\"/weather\"]"));
  utils.activate(utils.query(`[data-param-name="filter"][data-param-value="${router.query.filter}"]`));
  utils.activate(utils.query(`[data-param-name="flux"][data-param-value="${router.query.flux}"]`));

  if (!lastQuery || (lastQuery.filter !== router.query.filter)) {

    utils.activate(utils.query(".Loader", eitFiltersContainer));

    API.getImageChannels({
      channeltype: router.query.filter,
      date_min: minDateFormatted
    }).then((res) => {

      images = res.body;

      if (!cachedImages[router.query.filter]) {
        cachedImages[router.query.filter] = [];
      }

      let minDate = Number.MAX_VALUE, maxDate = Number.MIN_VALUE;
      images.forEach((image, index) => {

        image.date = new Date(image.date);

        if (!cachedImages[router.query.filter][index]) {
          const img = new Image();
          img.src = image.image;
          cachedImages[router.query.filter][index] = img;
        }

        minDate = Math.min(image.date.getTime(), minDate);
        maxDate = Math.max(image.date.getTime(), maxDate);

      });

      const dateStart = new Date(minDate),
            dateEnd = new Date(maxDate),
            dateCurrent = new Date();

      utils.text(utils.query(".Timeline__dateStart", eitFiltersContainer), utils.dateFormatted(dateStart));
      utils.text(utils.query(".Timeline__dateEnd", eitFiltersContainer), utils.dateFormatted(dateEnd));

      utils.deactivate(utils.query(".Loader", eitFiltersContainer));

      if (!timeline) {
        timeline = utils.timeline(utils.query(".Timeline", container), (value) => {

          if (images) {
            updateImage(imageContainer, value);
          }
          utils.text(utils.query(".Timeline__dateCurrent", eitFiltersContainer), utils.dateFormatted(utils.interpolateDate(dateStart, dateEnd, value, dateCurrent)));

        });
      }

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
        Promise.all([

          API.getSolarWind({
            date_min: minDateFormatted
          })

        ]).then((res) => {

          utils.deactivate(fluxesLoader);
          utils.solarWindGraph(container, res[0].body);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, [{"name": "temperature"}, {"name": "density"}].map((legend) => {
            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": "Graph__legendColor--particle10" }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;

      case "particle":
        Promise.all([

          API.getProtonFlux({
            ptype: 1,
            date_min: minDateFormatted
          }),

          API.getProtonFlux({
            ptype: 3,
            date_min: minDateFormatted
          }),

          API.getProtonFluxTypes()

        ]).then((res) => {

          utils.deactivate(fluxesLoader);
          utils.protonFluxGraph(container, [res[0].body, res[1].body]);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, res[2].body.map((legend) => {
            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": "Graph__legendColor--particle10" }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;

      case "electron":
        Promise.all([

          API.getElectronFlux({
            etype: 1,
            date_min: minDateFormatted
          }),

          API.getElectronFlux({
            etype: 2,
            date_min: minDateFormatted
          }),

          API.getElectronFluxTypes()

        ]).then((res) => {

          utils.deactivate(fluxesLoader);
          utils.electronFluxGraph(container, [res[0].body, res[1].body]);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, res[2].body.map((legend) => {
            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": "Graph__legendColor--particle10" }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;

      case "x-ray":
        Promise.all([

          API.getXrayFlux({
            xtype: 1,
            date_min: minDateFormatted
          }),

          API.getXrayFlux({
            xtype: 2,
            date_min: minDateFormatted
          }),

          API.getXrayFluxTypes()

        ]).then((res) => {

          utils.deactivate(fluxesLoader);
          utils.xrayFluxGraph(container, [res[0].body, res[1].body]);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, res[2].body.map((legend) => {
            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": "Graph__legendColor--particle10" }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;
    }

  }

  lastQuery = JSON.parse(JSON.stringify(router.query));

}
