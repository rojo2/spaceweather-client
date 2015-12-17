import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getGeomagneticActivity(data = {}) {
  return request(url("geomagactivity", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
