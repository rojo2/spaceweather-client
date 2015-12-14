import {getProtonFlux} from "./api/protonflux";
import {initBackground} from "./ui/background";

getProtonFlux().then((res) => {
  console.log(res.body);
});

window.addEventListener("DOMContentLoaded", () => {

  initBackground();

});

