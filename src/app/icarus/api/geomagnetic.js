import {config} from "icarus/api/config";
import {url} from "icarus/api/url";
import {request} from "icarus/http/request";

export function getGeomagneticActivity(data = {}) {
  return request(url("geomagactivity", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
