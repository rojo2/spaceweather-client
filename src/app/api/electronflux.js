import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

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
