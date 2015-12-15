export class HistoryRouter {
  constructor() {
    this.routes = [];
    this.handlePopState = this.handlePopState.bind(this);
  }

  handlePopState(e) {
    console.log(e);
  }

  start() {
    this.dispatch(location.pathname);
    window.addEventListener("popstate", this.handlePopState);
    return this;
  }

  stop() {
    window.removeEventListener("popstate", this.handlePopState);
    return this;
  }

  route(re, fn) {
    const pattern = (re instanceof RegExp ? re : new RegExp("^" + re));
    this.routes.push({
      pattern: pattern,
      delegate: fn
    });
    return this;
  }

  dispatch(url) {
    if (/^https?:\/\//.test(url)) {
      url = url.replace(/^https?:\/\//,"");
      url = url.substr(url.indexOf("/"));
    }

    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index];
      if (route.pattern.test(url)) {
        route.delegate();
        return true;
      }
    }
    return false;
  }

  navigate(url) {
    window.history.pushState({
      url
    }, "", url);
    return this.dispatch(url);
  }
}
