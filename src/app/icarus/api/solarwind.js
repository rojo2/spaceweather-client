import {config} from "icarus/api/config";
import {url} from "icarus/api/url";
import {request} from "icarus/http/request";

export function getSolarWind(data = {}) {
  return request(url("solarwind", Object.assign(data,{
    format: "json"
  })), config.CREDENTIALS);
}
