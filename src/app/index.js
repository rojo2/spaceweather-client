import API from "./api";
import {initBackground} from "./ui/background";
import {initSounds} from "./ui/sounds";
import {HistoryRouter} from "./router/Router";

function isActive(el) {

  el.classList.add("isActive");

  let current = el.nextElementSibling
  while (current !== null) {
    el.classList.remove("isActive");
    current = el.nextElementSibling;
  }

  current = el.previousElementSibling
  while (current !== null) {
    el.classList.remove("isActive");
    current = el.previousElementSibling;
  }

  return el;

}

window.addEventListener("DOMContentLoaded", () => {

  const router = new HistoryRouter();
  router.route("weather", () => {
    isActive(document.querySelector(".Weather"));
  }).route("forecast", () => {
    isActive(document.querySelector(".Forecast"));
  }).route("sunspots", () => {
    isActive(document.querySelector(".Sunspots"));
  }).route("solar-cycle", () => {
    isActive(document.querySelector(".SolarCycle"));
  });

  router.navigate("weather");

  // init background.
  initBackground();
  initSounds();

});

