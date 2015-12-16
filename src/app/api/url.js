import {config} from "./config";
import queryString from "query-string";

function concat(url) {
  if (url.substr(0,1) === "/" && config.URL.substr(-1) === "/") {
    return config.URL + url.substr(1);
  } else if (url.substr(0,1) !== "/" && config.URL.substr(-1) !== "/") {
    return config.URL + "/" + url;
  }
  return config.URL + url;
}

export function url(url, query = {}) {
  const url = new URL(concat(url));
  url.search = "?" + queryString.stringify(query);
  return url.toString();
}
