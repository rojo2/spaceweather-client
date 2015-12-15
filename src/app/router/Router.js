export class HistoryRouter {
  constructor() {
    this.routes = [];
    this.handlePopState = this.handlePopState.bind(this);
  }

  handlePopState(e) {
    console.log(e);
  }

  start() {
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
    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index];
      console.log(route, url);
      if (route.pattern.test(url)) {
        console.log("OK!");
        const matches = route.pattern.exec(url);
        //route.delegate();
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
