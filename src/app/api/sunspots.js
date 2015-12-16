import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getSunspots(data = {}) {
  return request(url("sunspot", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getSunspotTypes(data = {}) {
  return request(url("sunspottypes", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getSunspotRegions(data = {}) {
  return request(url("sunspotregion", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
