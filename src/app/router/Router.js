export class HistoryRouter {
  constructor() {
    this.routes = [];
    window.addEventListener("popstate", (e) => {
      console.log(e);
    });
  }

  route(re, fn) {
    this.routes.push({
      re: new RegExp(re),
      fn: fn
    });
    return this;
  }

  dispatch(url) {
    for (let index = 0; index < this.routes.length; index++) {
      const route = this.routes[index];
      if (route.re.test(url)) {
        const matches = route.re.exec(url);
        route.fn(matches);
        return true;
      }
    }
    return false;
  }

  navigate(url) {
    this.dispatch(url);
    window.history.pushState({
      url
    }, "", url);
    return this;
  }
}
