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

function children(el, fn) {
  for (let index = 0; index < el.children.length; index++) {
    const current = el.children[index];
    fn(current);
  }
  return el;
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

window.addEventListener("DOMContentLoaded", () => {

  const router = new HistoryRouter();
  router.route("/weather", () => {
    activate(query("section.Weather"));
  }).route("/forecast", () => {
    activate(query("section.Forecast"));
  }).route("/sunspots", () => {
    activate(query("section.Sunspots"));
  }).route("/solar-cycle", () => {
    activate(query("section.SolarCycle"));
  }).start();

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

