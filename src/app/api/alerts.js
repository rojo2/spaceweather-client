import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getAlerts() {
  return request(url("alerts/?format=json"), config.CREDENTIALS);
}

export function getAlertTypes() {
  return request(url("xtypes/?format=json"), config.CREDENTIALS);
}
