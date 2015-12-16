import API from "./api";
import {initBackground} from "./ui/background";
import {initSounds} from "./ui/sounds";
import {Router} from "./router/Router";

function query(selector) {
  return document.querySelector(selector);
}

function queryAll(selector) {
  return Array.prototype.slice.apply(document.querySelectorAll(selector));
}

function each(list, fn) {
  for (let index = 0; index < el.children.length; index++) {
    const current = el.children[index],
          result = fn(current);

    if (result) {
      return result;
    }
  }
  return null;
}

function children(el, fn) {
  return each(el.children, fn);
}

function siblings(el, fn) {
  let current = el.nextElementSibling;
  while (current) {
    fn(current);
    current = current.nextElementSibling;
  }

  current = el.previousElementSibling;
  while (current) {
    fn(current);
    current = current.previousElementSibling;
  }
  return el;
}

function deactivate(el) {
  el.classList.remove("isActive");
  return el;
}

function activate(el) {
  el.classList.add("isActive");
  siblings(el, deactivate);
  return el;
}

function getAttr(el, name) {
  return el.getAttribute(name);
}

function setAttr(el, name, value) {
  return el.setAttribute(name, value);
}

function hasAttr(el, name) {
  return el.hasAttribute(name);
}

function getActive(list) {
  return each(list, (current) => {
    if (current.classList.contains("isActive")) {
      return current;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {

  const router = new Router();
  router
  .all((url) => {

  }).route("/weather", (router) => {
    if (!router.query.filter && !router.query.flux) {
      console.log("redirecting");
      return router.replace(router.createURL(location.href, {
        filter: 171,
        flux: "solar-wind"
      }));
    }

    activate(query(".Weather"));
    activate(query(`[data-param-name="filter"][data-param-value="${router.query.filter}"]`));
    activate(query(`[data-param-name="flux"][data-param-value="${router.query.flux}"]`));

  }).route("/sunspots", (router) => {

    console.log("sunspots");
    activate(query(".Sunspots"));

  }).route("/solar-cycle", (router) => {

    console.log("solar-cycle");
    activate(query(".SolarCycle"));

  }).route("/forecast", (router) => {

    if (!router.query.type) {
      return router.replace(router.createURL(location.href, {
        type: "geomagnetic"
      }));
    }

    console.log("forecast");
    activate(query(".Forecast"));
    activate(query(`[data-param-name="type"][data-param-value="${router.query.type}"]`));

  }).notFound((router) => {

    // TODO: Redirigir a /weather.
    const newURL = new URL(location.href);
    newURL.pathname = "/weather";

    return router.replace(router.createURL(newURL.toString(), {
      filter: 171,
      flux: "solar-wind"
    }));

  }).start();

  // start navigation.
  queryAll("a").map((current) => {
    current.addEventListener("click", (e) => {

      e.preventDefault();
      activate(e.currentTarget);

      let url;
      if (hasAttr(e.currentTarget, "data-param-name") && hasAttr(e.currentTarget, "data-param-value")) {
        const name = getAttr(e.currentTarget, "data-param-name"),
              value = getAttr(e.currentTarget, "data-param-value");

        url = router.createURL(e.currentTarget.href, {
          [name]: value
        });
      } else {
        url = router.createURL(e.currentTarget.href);
      }

      router.navigate(url.toString());

    });
  });

  // init background.
  initBackground();
  initSounds();

});

