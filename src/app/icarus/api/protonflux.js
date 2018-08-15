import {config} from "icarus/api/config";
import {url} from "icarus/api/url";
import {request} from "icarus/http/request";

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
