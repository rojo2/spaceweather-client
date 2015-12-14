import {getProtonFlux} from "./api/protonflux";

getProtonFlux().then((res) => {
  console.log(res.body);
});
