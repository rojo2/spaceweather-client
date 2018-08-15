import {config} from "icarus/api/config";
import {url} from "icarus/api/url";
import {request} from "icarus/http/request";

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
