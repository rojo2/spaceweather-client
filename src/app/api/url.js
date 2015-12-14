import {config} from "./config";

export function url(url) {
  if (url.substr(0,1) === "/" && config.URL.substr(-1) === "/") {
    return config.URL + url.substr(1);
  } else if (url.substr(0,1) !== "/" && config.URL.substr(-1) !== "/") {
    return config.URL + "/" + url;
  }
  return config.URL + url;
}
