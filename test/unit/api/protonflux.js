import {getProtonFlux, getProtonFluxTypes} from "api/protonflux";

describe("Proton flux", () => {

  it("should get the proton flux json", (done) => {
    getProtonFlux().then(() => {
      return done();
    });
  });

  it("should get the proton flux types json", (done) => {
    getProtonFluxTypes().then(() => {
      return done();
    });
  });

});
