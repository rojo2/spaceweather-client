import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  const container = utils.query(".Forecast"),
        alertsLoader = utils.query(".Forecast__alerts .Loader", container),
        alerts = utils.query(".Alerts", container);

  utils.clear(alerts);

  utils.activate(container);
  utils.activate(utils.query("[href=\"/forecast\"]"));
  utils.activate(alertsLoader);

  Promise.all([
    API.getRadioBlackout(),
    API.getSolarRadiation(),
    API.getGeomagneticActivity()
  ]).then((res) => {

  });

  API.getAlerts().then((res) => {

    utils.clear(alerts);

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
