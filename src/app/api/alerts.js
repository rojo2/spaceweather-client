import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getAlerts(data = {}) {
  return request(url("alerts", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getAlertTypes(data = {}) {
  return request(url("xtypes", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getForecast(data = {}) {
  return request(url("forecastrationale", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
