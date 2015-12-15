import API from "./api";
import {initBackground} from "./ui/background";
import {initSounds} from "./ui/sounds";
import {HistoryRouter} from "./router/Router";

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
  router.route("weather", () => {
    isActive(document.querySelector(".Weather"));
  }).route("forecast", () => {
    isActive(document.querySelector(".Forecast"));
  }).route("sunspots", () => {
    isActive(document.querySelector(".Sunspots"));
  }).route("solar-cycle", () => {
    isActive(document.querySelector(".SolarCycle"));
  }).start();

  window.router = router;

  //router.navigate("weather");

  // init background.
  initBackground();
  initSounds();

});

