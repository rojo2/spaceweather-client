import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  if (!router.query.type) {
    return router.redirect({
      type: "geomagnetic"
    });
  }

  const container = utils.query(".Forecast"),
        graphsLoader = utils.query(".Forecast__graphs .Loader", container),
        alertsLoader = utils.query(".Forecast__alerts .Loader", container),
        alerts = utils.query(".Alerts", container);

  utils.activate(container);
  utils.activate(utils.query("[href=\"/forecast\"]"));

  utils.clear(alerts);

  utils.activate(graphsLoader);
  utils.activate(alertsLoader);

  utils.activate(utils.query(`[data-param-name="type"][data-param-value="${router.query.type}"]`));

  API.getAlerts().then((res) => {

    utils.deactivate(alertsLoader);

    res.body.forEach((alert) => {
      utils.add(alerts, utils.template("#alert", alert, {
        alerttype(value) {
          switch (value) {
            default: return "";
            case 1: return "Alert--summary";
            case 3: return "Alert--warning";
            case 5: return "Alert--extendedWarning";
            case 7: return "Alert--cancelWarning";
          }
        }
      }));
    });

  });

}
