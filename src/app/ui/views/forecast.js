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

    const days = utils.queryAll(".Forecast__day");

    const radioBlackout = res[0].body;
    radioBlackout.forEach((item) => {
      utils.text(utils.query(".Forecast__statsValue--solar", days[index]), (item.value + "%"));
    });

    const solarRadiation = res[1].body;
    solarRadiation.forEach((item, index) => {
      utils.text(utils.query(".Forecast__statsValue--solar", days[index]), (item.value + "%"));
    });

    let minGeomagnetic = Number.MAX_VALUE,
        maxGeomagnetic = Number.MIN_VALUE;

    const geomagnetic = res[2].body,
          geomagneticPerDay = {};

    geomagnetic.forEach((item) => {

      item.date = new Date(item.date);

      const day = utils.dateYMD(item.date);
      if (!day in geomagneticPerDay) {
        geomagneticPerDay[day] = {
          minGeomagnetic: Number.MAX_VALUE,
          maxGeomagnetic: Number.MIN_VALUE
        };
      } else {
        geomagneticPerDay[day].minGeomagnetic = Math.min(item.value, geomagneticPerDay[day].minGeomagnetic);
        geomagneticPerDay[day].maxGeomagnetic = Math.max(item.value, geomagneticPerDay[day].maxGeomagnetic);
      }

    });

    const keys = Object.keys(geomagneticPerDay);
    keys.forEach((day, index) => {
      utils.text(utils.query(".Forecast__statsValue--geomagnetic", days[index]), (day.minGeomagnetic + " / " + day.maxGeomagnetic));
    });

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
