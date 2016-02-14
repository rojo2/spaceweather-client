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

    let minRadioBlackout = Number.MAX_VALUE,
        maxRadioBlackout = Number.MIN_VALUE;

    const radioBlackout = res[0].body,
          radioBlackoutPerDay = {};

    radioBlackout.forEach((item, index) => {

      item.date = new Date(item.date);

      const day = utils.dateYMD(item.date);
      if (typeof radioBlackoutPerDay[day] === "undefined") {

        radioBlackoutPerDay[day] = {
          min: Number.MAX_VALUE,
          max: Number.MIN_VALUE
        };

      }

      radioBlackoutPerDay[day].min = Math.min(item.value, radioBlackoutPerDay[day].min);
      radioBlackoutPerDay[day].max = Math.max(item.value, radioBlackoutPerDay[day].max);

      utils.text(utils.query(".Forecast__statsValue--blackout", days[index]), (item.value + "%"));

    });

    let minSolarRadiation = Number.MAX_VALUE,
        maxSolarRadiation = Number.MIN_VALUE;

    const solarRadiation = res[1].body,
          solarRadiationPerDay = {};

    solarRadiation.forEach((item, index) => {

      item.date = new Date(item.date);

      const day = utils.dateYMD(item.date);
      if (typeof solarRadiationPerDay[day] === "undefined") {

        solarRadiationPerDay[day] = {
          min: Number.MAX_VALUE,
          max: Number.MIN_VALUE
        };

      }

      solarRadiationPerDay[day].min = Math.min(item.value, solarRadiationPerDay[day].min);
      solarRadiationPerDay[day].max = Math.max(item.value, solarRadiationPerDay[day].max);

      utils.text(utils.query(".Forecast__statsValue--solar", days[index]), (item.value + "%"));

    });

    let minGeomagnetic = Number.MAX_VALUE,
        maxGeomagnetic = Number.MIN_VALUE;

    const geomagnetic = res[2].body,
          geomagneticPerDay = {};

    geomagnetic.forEach((item) => {

      item.date = new Date(item.date);

      const day = utils.dateYMD(item.date);
      if (typeof geomagneticPerDay[day] === "undefined") {

        geomagneticPerDay[day] = {
          min: Number.MAX_VALUE,
          max: Number.MIN_VALUE
        };

      }

      geomagneticPerDay[day].min = Math.min(item.value, geomagneticPerDay[day].min);
      geomagneticPerDay[day].max = Math.max(item.value, geomagneticPerDay[day].max);

    });

    const keys = Object.keys(geomagneticPerDay);
    keys.forEach((day, index) => {

      const geomagnetic = geomagneticPerDay[day],
            solarRadiation = solarRadiationPerDay[day],
            radioBlackout = radioBlackoutPerDay[day];

      const dateLabel = new Date(day);

      const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DEC"];
      const monthShortName = months[dateLabel.getMonth()];

      utils.text(utils.query(".Forecast__dayLabel", days[index]), monthShortName + " " + utils.padLeft(dateLabel.getDate(),"0",2));

      utils.text(utils.query(".Forecast__statsValue--geomagnetic", days[index]), (geomagnetic.min + " / " + geomagnetic.max));

      const geomagneticRadius = (10 + Math.round((geomagnetic.max / 100) * 50));
      const solarRadius = (10 + Math.round((solarRadiation.max / 100) * 50));
      const blackoutRadius = (10 + Math.round((radioBlackout.max / 100) * 50));

      utils.setAttr(utils.query(".RadialDanger__geomagnetic", days[index]), "r", `${geomagneticRadius}px`);
      utils.setAttr(utils.query(".RadialDanger__solar", days[index]), "r", `${solarRadius}px`);
      utils.setAttr(utils.query(".RadialDanger__blackout", days[index]), "r", `${blackoutRadius}px`);

    });

  });

  if (router.query.show === "alerts") {

    API.getAlerts({
      ordering: "-issuetime"
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

      const rationale = res.body.pop();

      if (rationale.solarradiation) {
        content += utils.wrap("Solar Radiation Storms", "h3") + utils.wrap(rationale.solarradiation, "p");
      }

      if (rationale.geomagactivity) {
        content += utils.wrap("Geomagnetic Activity", "h3") + utils.wrap(rationale.geomagactivity, "p");
      }

      if (rationale.radioblackout) {
        content += utils.wrap("Radio Blackout (>=R3)", "h3") + utils.wrap(rationale.radioblackout, "p");
      }

      utils.html(forecast, content);

    });

  }


}
