import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  if (!router.query.show) {
    return router.redirect({
      show: "forecast"
    });
  }

  const minDateFormatted = utils.daysFrom(0);

  const container = utils.query(".Forecast"),
        alertsLoader = utils.query(".Forecast__alerts .Loader", container),
        alerts = utils.query(".Alerts", container),
        forecast = utils.query(".Forecast__rationale", container);

  utils.clear(alerts);

  utils.activate(container);

  utils.activate(utils.query(`[data-param-name="show"][data-param-value="${router.query.show}"]`));
  utils.activate(utils.query("[href=\"/forecast\"]"));

  utils.activate(alertsLoader);

  Promise.all([
    API.getRadioBlackout({
      ordering: "+date",
      date_min: minDateFormatted
    }),
    API.getSolarRadiation({
      ordering: "+date",
      date_min: minDateFormatted
    }),
    API.getGeomagneticActivity({
      ordering: "+date",
      date_min: minDateFormatted
    })
  ]).then((res) => {

    const days = utils.queryAll(".Forecast__day");

    const radioBlackout = res[0].body;
    radioBlackout.forEach((item, index) => {
      utils.text(utils.query(".Forecast__statsValue--blackout", days[index]), (item.value + "%"));
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
      if (!(day in geomagneticPerDay)) {

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

      const geomagnetic = geomagneticPerDay[day];

      const dateLabel = new Date(day);

      const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DEC"];
      const monthShortName = months[dateLabel.getMonth()];

      utils.text(utils.query(".Forecast__dayLabel", days[index]), monthShortName + " " + utils.padLeft(dateLabel.getDate(),"0",2));

      utils.text(utils.query(".Forecast__statsValue--geomagnetic", days[index]), (geomagnetic.minGeomagnetic + " / " + geomagnetic.maxGeomagnetic));

    });

  });

  if (router.query.show === "alerts") {

    API.getAlerts({
      ordering: "-date"
    }).then((res) => {

      utils.deactivate(alertsLoader);

      utils.clear(forecast);
      utils.clear(alerts);
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

  } else {

    API.getForecast().then((res) => {

      utils.deactivate(alertsLoader);

      utils.clear(forecast);

      let content = "";

      const rationale = res.body[0];

      if (rationale.solarradiation) {
        content += utils.wrap("Solar Radiation", "h3") + utils.wrap(rationale.solarradiation, "p");
      }

      if (rationale.geomagactivity) {
        content += utils.wrap("Geomagnetic Activity", "h3") + utils.wrap(rationale.geomagactivity, "p");
      }

      if (rationale.radioblackout) {
        content += utils.wrap("Radio Blackout", "h3") + utils.wrap(rationale.radioblackout, "p");
      }

      utils.html(forecast, content);

    });

  }


}
