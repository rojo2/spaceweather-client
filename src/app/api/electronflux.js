import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getElectronFlux() {
  return request(url("electronflux/?format=json"), config.CREDENTIALS);
}

export function getElectronFluxTypes() {
  return request(url("etypes/?format=json"), config.CREDENTIALS);
}
