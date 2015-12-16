import * as utils from "../utils";

export function view(router) {

  if (!router.query.filter && !router.query.flux) {
    return router.redirect({
      filter: 171,
      flux: "solar-wind"
    });
  }

  utils.activate(utils.query("[href=\"/weather\"]"));
  utils.activate(utils.query(".Weather"));
  utils.activate(utils.query(`[data-param-name="filter"][data-param-value="${router.query.filter}"]`));
  utils.activate(utils.query(`[data-param-name="flux"][data-param-value="${router.query.flux}"]`));

}
