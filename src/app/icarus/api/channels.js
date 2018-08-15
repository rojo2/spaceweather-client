import {config} from "icarus/api/config";
import {url} from "icarus/api/url";
import {request} from "icarus/http/request";

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
