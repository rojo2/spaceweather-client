import API from "./api";
import {initBackground} from "./ui/background";

API.getAll().then((res) => {
  console.log(res);
});

window.addEventListener("DOMContentLoaded", () => {

  initBackground();

});

