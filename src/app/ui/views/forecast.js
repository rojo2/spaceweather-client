import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  if (!router.query.type) {
    return router.redirect({
      type: "geomagnetic"
    });
  }

  const container = utils.query(".Forecast");

  utils.activate(container);
  utils.activate(utils.query("[href=\"/forecast\"]"));
  utils.activate(utils.query(".Forecast__graphs .Loader", container));
  utils.activate(utils.query(`[data-param-name="type"][data-param-value="${router.query.type}"]`));

}
