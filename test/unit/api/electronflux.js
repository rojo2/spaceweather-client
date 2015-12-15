import {getElectronFlux, getElectronFluxTypes} from "api/electronflux";

describe("Electron flux", () => {

  it("should get the electron flux json", (done) => {
    getElectronFlux().then(() => {
      return done();
    });
  });

  it("should get the electron flux types json", (done) => {
    getElectronFluxTypes().then(() => {
      return done();
    });
  });

});
