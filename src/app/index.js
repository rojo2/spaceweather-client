import {Router} from "./router/Router";

import {view as weatherView} from "./ui/views/weather";
import {view as sunspotsView} from "./ui/views/sunspots";
import {view as solarCycleView} from "./ui/views/solarCycle";
import {view as forecastView} from "./ui/views/forecast";
import {view as notFoundView} from "./ui/views/notFound";
import {view as startView} from "./ui/views/start";

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

});

