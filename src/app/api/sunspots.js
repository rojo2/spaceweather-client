import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getSunspots() {
  return request(url("sunspot/?format=json"), config.CREDENTIALS);
}

export function getSunspotTypes() {
  return request(url("sunspottypes/?format=json"), config.CREDENTIALS);
}

export function getSunspotRegions() {
  return request(url("sunspotregion/?format=json"), config.CREDENTIALS);
}
