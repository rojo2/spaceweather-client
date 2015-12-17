import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getRadioBlackout(data = {}) {
  return request(url("radioblackout", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getRadioBlackoutTypes(data = {}) {
  return request(url("radioblackouttypes", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
