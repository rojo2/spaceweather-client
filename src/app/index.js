import {Router} from "./router/Router";

import {view as weatherView} from "./ui/views/weather";
import {view as sunspotsView} from "./ui/views/sunspots";
import {view as solarCycleView} from "./ui/views/solarCycle";
import {view as forecastView} from "./ui/views/forecast";
import {view as notFoundView} from "./ui/views/notFound";
import {view as startView} from "./ui/views/start";

import * as utils from "./ui/utils";

window.addEventListener("DOMContentLoaded", () => {

  const router = new Router();
  router
    .all((url) => {

    })
    .route("/weather", weatherView)
    .route("/sunspots", sunspotsView)
    .route("/solar-cycle", solarCycleView)
    .route("/forecast", forecastView)
    .notFound(notFoundView)
    .start(startView);

  /*
  document.body.addEventListener("mouseleave", function(e) {
    const target = e.target;
    if (target) {
      const classes = target.getAttribute("class");
      if (classes && classes.indexOf("Graph__sunspot") >= 0) {
        if (target.hasAttribute("data-rel")) {
          const rel = target.getAttribute("data-rel");
          const tooltip = utils.query(rel);
          tooltip.style.display = "none";
        }
      }
    }
  }, true);

  document.body.addEventListener("mouseenter", function(e) {
    const target = e.target;
    if (target) {
      const classes = target.getAttribute("class");
      if (classes && classes.indexOf("Graph__sunspot") >= 0) {
        if (target.hasAttribute("data-rel")) {
          const rel = target.getAttribute("data-rel");
          const tooltip = utils.query(rel);
          tooltip.style.display = "block";
        }
      }
    }
  }, true);
  */

});

