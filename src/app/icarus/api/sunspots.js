import {config} from "icarus/api/config";
import {url} from "icarus/api/url";
import {request} from "icarus/http/request";

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
