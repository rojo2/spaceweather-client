import queryString from "query-string";

export class Router {

  constructor() {
    this.handlePopState = this.handlePopState.bind(this);

    this.middleware = [];
    this.routes = [];

    this.notFoundDelegate = null;
  }

  createURL(href, query = null) {
    const url = new URL(href);
    if (query) {
      url.search = "?" + queryString.stringify(Object.assign({}, queryString.parse(location.search), query));
    }
    return url.toString();
  }

  get path() {
    return location.pathname;
  }

  get query() {
    return queryString.parse(location.search);
  }

  handlePopState(e) {
    this.dispatch(e.state.url);
  }

  all(fn) {
    this.middleware.push(fn);
    return this;
  }

  route(re, fn) {
    this.routes.push({
      pattern: (re instanceof RegExp ? re : new RegExp("^" + re)),
      delegate: fn
    });
    return this;
  }

  notFound(fn) {
    this.notFoundDelegate = fn;
    return this;
  }

  start(fn = null) {
    if (typeof fn === "function") {
      fn(this);
    }
    window.addEventListener("popstate", this.handlePopState);
    this.dispatch(location.href);
    return this;
  }

  stop() {
    window.removeEventListener("popstate", this.handlePopState);
    return this;
  }

  dispatch(url) {
    for (let index = 0; index < this.middleware.length; index++) {
      const middleware = this.middleware[index];
      middleware(this,url);
    }

    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index];
      if (route.pattern.test(new URL(url).pathname)) {
        route.delegate(this);
        return this;
      }
    }

    if (this.notFoundDelegate) {
      this.notFoundDelegate(this);
    }

    return this;
  }

  redirect(query = {}) {
    return this.replace(this.createURL(location.href, query));
  }

  redirectTo(path, query = {}) {
    const newURL = new URL(location.href);
    newURL.pathname = path;
    return this.replace(this.createURL(newURL.toString(), query));
  }

  replace(url) {
    window.history.replaceState({
      url
    }, "", url);
    return this.dispatch(url);
  }

  navigate(url) {
    window.history.pushState({
      url
    }, "", url);
    return this.dispatch(url);
  }

}

