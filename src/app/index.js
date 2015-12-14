import {getProtonFlux} from "./api/protonflux";

getProtonFlux().then((response) => {
  console.log(response);
});
