import {config} from "icarus/api/config";
import {url} from "icarus/api/url";
import {request} from "icarus/http/request";

export function getElectronFlux(data = {}) {
  return request(url("electronflux", Object.assign(data,{
    format: "json"
  })), config.CREDENTIALS);
}

export function getElectronFluxTypes(data = {}) {
  return request(url("etypes", Object.assign(data,{
    format: "json"
  })), config.CREDENTIALS);
}
