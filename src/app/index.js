import API from "./api";
import {initBackground} from "./ui/background";
import {initSounds} from "./ui/sounds";

window.addEventListener("DOMContentLoaded", () => {

  // init background.
  initBackground();
  initSounds();

});

