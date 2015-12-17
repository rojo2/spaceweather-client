import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getSolarRadiation(data = {}) {
  return request(url("solarradiation", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getSolarRadiationTypes(data = {}) {
  return request(url("solarradiationtypes", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
