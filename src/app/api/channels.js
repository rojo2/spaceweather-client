import {config} from "./config";
import {url} from "./url";
import {request} from "../http/request";

export function getImageChannels(data = {}) {
  return request(url("imagechannels", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}

export function getImageChannelTypes(data = {}) {
  return request(url("channeltypes", Object.assign(data, {
    format: "json"
  })), config.CREDENTIALS);
}
