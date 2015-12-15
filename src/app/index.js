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
}

function isActive(el) {
  el.classList.add("isActive");
  siblings(el, (current) => {
    current.classList.remove("isActive");
  });
  return el;
}

window.addEventListener("DOMContentLoaded", () => {

  const router = new HistoryRouter();
  router.route("/weather", () => {
    isActive(query("section.Weather"));
  }).route("/forecast", () => {
    isActive(query("section.Forecast"));
  }).route("/sunspots", () => {
    isActive(query("section.Sunspots"));
  }).route("/solar-cycle", () => {
    isActive(query("section.SolarCycle"));
  }).start();

  window.router = router;

  queryAll(".Nav a").map((current) => {
    current.addEventListener("click", (e) => {
      e.preventDefault();
      isActive(e.currentTarget);
      router.navigate(e.currentTarget.href);
    });
  });

  //router.navigate("weather");

  // init background.
  initBackground();
  initSounds();

});

