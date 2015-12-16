import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getProtonFlux(data = {}) {
  return request(url("protonflux", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getProtonFluxTypes(data = {}) {
  return request(url("ptypes", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
