import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getXrayFlux() {
  return request(url("xrayflux/?format=json"), config.CREDENTIALS);
}
