import * as utils from "../utils";
import API from "../../api";

export function view(router) {

  utils.activate(utils.query("[href=\"/sunspots\"]"));
  utils.activate(utils.query(".Sunspots"));

}
