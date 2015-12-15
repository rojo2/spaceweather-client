import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getProtonFlux() {
  return request(url("protonflux/?format=json"), config.CREDENTIALS);
}

export function getProtonFluxTypes() {
  return request(url("ptypes/?format=json"), config.CREDENTIALS);
}
