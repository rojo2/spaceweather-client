import API from "./api";
import {initBackground} from "./ui/background";
import {initSounds} from "./ui/sounds";
import {HistoryRouter} from "./router/Router";

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

function getActive(list) {
  return each(list, (current) => {
    if (current.classList.contains("isActive")) {
      return current;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {

  const router = new HistoryRouter();
  router.route("/weather", () => {
    activate(query("section.Weather"));
  }).param("filter", (value) => {
    activate(query(`.Panel__menuItem[data-name="filter"][data-value="${value}"]`));
  }).param("flux", (value) => {
    activate(query(`.Panel__menuItem[data-name="flux"][data-value="${value}"]`));
  });

  router.route("/forecast", () => {
    activate(query("section.Forecast"));
  }).param("type", (value) => {
    activate(query(`.Panel__menuItem[data-name="type"][data-value="${value}"]`));
  });

  router.route("/sunspots", () => {
    activate(query("section.Sunspots"));
  });

  router.route("/solar-cycle", () => {
    activate(query("section.SolarCycle"));
  });

  // start routing.
  router.start();

  // global navigation.
  queryAll(".Nav__item").map((current) => {
    current.addEventListener("click", (e) => {
      e.preventDefault();
      activate(e.currentTarget);
      router.navigate(e.currentTarget.href);
    });
  });

  // panel navigation.
  queryAll(".Panel__menuItem").map((current) => {
    current.addEventListener("click", (e) => {
      e.preventDefault();
      activate(e.currentTarget);

      const name = e.currentTarget.getAttribute("data-name"),
            value = e.currentTarget.getAttribute("data-value");

      router.navigate(e.currentTarget.href, {
        [name]: value
      });
    });
  });

  // init background.
  initBackground();
  initSounds();

});

