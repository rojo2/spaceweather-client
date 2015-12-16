import queryString from "query-string";

class Route {
  constructor(re, delegate) {
    const pattern = (re instanceof RegExp ? re : new RegExp("^" + re));

    this.pattern = pattern;
    this.delegate = delegate;
    this.params = {};
  }

  get currentPath() {
    return location.pathname;
  }

  get query() {
    return queryString.parse(location.search);
  }

  param(param, delegate) {
    this.params[param] = delegate;
    return this;
  }

  match(url) {
    return this.pattern.test(url);
  }

  dispatch(url) {

    const index = url.indexOf("?");
    if (index > -1) {

      const path = url.substr(0, index);
      this.delegate();

      const query = queryString.parse(url.substr(index));

      const names = Object.keys(query);
      for (let index = 0; index < names.length; index++) {
        const name = names[index],
              value = query[name];

        if (name in this.params) {
          const delegate = this.params[name];
          delegate(value);
        }
      }

    } else {

      this.delegate();

    }

  }

}

export class HistoryRouter {
  constructor() {
    this.routes = [];
    this.handlePopState = this.handlePopState.bind(this);
  }

  get currentPath() {
    return location.pathname;
  }

  get query() {
    return queryString.parse(location.search);
  }

  handlePopState(e) {
    this.dispatch(e.state.url);
  }

  start() {
    this.dispatch(location.href);
    window.addEventListener("popstate", this.handlePopState);
    return this;
  }

  stop() {
    window.removeEventListener("popstate", this.handlePopState);
    return this;
  }

  route(re, fn) {
    const route = new Route(re, fn);
    this.routes.push(route);
    return route;
  }

  dispatch(url) {
    if (/^https?:\/\//.test(url)) {
      url = url.replace(/^https?:\/\//,"");
      url = url.substr(url.indexOf("/"));
    }

    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index];
      if (route.match(url)) {
        route.dispatch(url);
        return true;
      }
    }
    return false;
  }

  replace(url, query = null) {
    if (query) {
      url += "?" + queryString.stringify(Object.assign({}, this.query, query));
    }
    this.dispatch(url);
    window.history.replaceState({ url }, "", url);
    return this;
  }

  navigate(url, query = null) {
    if (query) {
      url += "?" + queryString.stringify(Object.assign({}, this.query, query));
    }
    this.dispatch(url);
    window.history.pushState({ url }, "", url);
    return this;
  }

}
