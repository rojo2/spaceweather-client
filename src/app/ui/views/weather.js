import * as utils from "../utils";
import graphs from "../graphs";
import API from "../../api";

var images,
    cachedImages = {};

let lastQuery,
    timeline;

function updateImage(el, value = 0) {

  const timeline = utils.query(".Graph__timeline");
  if (timeline) {

    const parentWidth = parseFloat(timeline.parentElement.getAttribute("data-width"));
    timeline.style.transform = `translateX(${value * parentWidth}px)`;

  }

  if (images) {

    const imageIndex = Math.floor(value * (images.length - 1));

    const r = utils.rect(el.parentElement.parentElement);
    utils.setAttr(el, "width", Math.min(r.width,r.height));

    if (!images[imageIndex]) {
      console.error("There aren't images");
      utils.setAttr(el, "src", "images/image-not-available.svg");
    } else {
      utils.setAttr(el, "src", images[imageIndex].image);
    }

  }

}

export function view(router) {

  if (!router.query.filter && !router.query.flux) {
    return router.redirect({
      filter: 1,
      flux: "solar-wind"
    });
  }

  const minDateFormatted = utils.daysFrom(-7);

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

      let minDate = Number.MAX_VALUE,
          maxDate = Number.MIN_VALUE;
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
      } else {
        timeline.updateValue(0);
      }

      updateImage(imageContainer);

    });

  }

  if (!lastQuery || (lastQuery.flux !== router.query.flux)) {

    const fluxesContainer = utils.query(".Weather__fluxes", container);
    const fluxesLoader = utils.query(".Loader", fluxesContainer);
    utils.activate(fluxesLoader);

    switch(router.query.flux) {

      /**
       *
       * SOLAR WIND SUBSECTION
       *
       */
      default:
      case "solar-wind":
        Promise.all([

          API.getSolarWind({
            date_min: minDateFormatted
          })

        ]).then((res) => {

          utils.deactivate(fluxesLoader);
          graphs.solarWindGraph(container, res[0].body);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, [{"name": "temperature"}, {"name": "density"}].map((legend) => {
            const name = (legend.name === "density" ? "solarWind1" : "solarWind2");
            const colorClass = `Graph__legendColor--${name}`;
            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": colorClass }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;

      /**
       *
       * PARTICLE FLUX SUBSECTION
       *
       */
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
          graphs.protonFluxGraph(container, [res[0].body, res[1].body]);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, res[2].body.map((legend) => {
            const name = (legend.id === 1 ? "particle10" : "particle100");
            const colorClass = `Graph__legendColor--${name}`;
            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": colorClass }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;

      /**
       *
       * ELECTRON FLUX SUBSECTION
       *
       */
      case "electron":
        Promise.all([

          API.getElectronFlux({
            etype: 2,
            date_min: minDateFormatted
          }),

          API.getElectronFlux({
            etype: 1,
            date_min: minDateFormatted
          }),

          API.getElectronFluxTypes()

        ]).then((res) => {

          utils.deactivate(fluxesLoader);
          graphs.electronFluxGraph(container, [res[0].body, res[1].body]);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, res[2].body.map((legend) => {
            const name = (legend.id === 1 ? "particle10" : "particle100");
            const colorClass = `Graph__legendColor--${name}`;
            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": colorClass }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;

      /**
       *
       * X-RAY FLUX SUBSECTION
       *
       */
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
          graphs.xrayFluxGraph(container, [res[0].body, res[1].body]);

          const graphLegends = utils.query(".Graph__legends");
          utils.clear(graphLegends);
          utils.addAll(graphLegends, res[2].body.map((legend) => {
            const name = (legend.id === 1 ? "particle10" : "particle100");
            const colorClass = `Graph__legendColor--${name}`;

            return utils.tag("a", {
              "href": "#",
              "class": "Graph__legend"
            }, [
              utils.tag("div", { "class": colorClass }),
              utils.tag("div", { "class": "Graph__legendLabel" }, legend.name)
            ]);
          }));

        });
        break;
    }

  }

  lastQuery = JSON.parse(JSON.stringify(router.query));

}
