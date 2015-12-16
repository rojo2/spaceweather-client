import * as utils from "../utils";

export function view(router) {

  if (!router.query.type) {
    return router.redirect({
      type: "geomagnetic"
    });
  }

  utils.activate(utils.query("[href=\"/forecast\"]"));
  utils.activate(utils.query(".Forecast"));
  utils.activate(utils.query(`[data-param-name="type"][data-param-value="${router.query.type}"]`));

}
