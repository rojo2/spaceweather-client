import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getSolarWind(data = {}) {
  return request(url("solarwind", Object.assign(data,{
    format: "json"
  })), config.CREDENTIALS);
}
