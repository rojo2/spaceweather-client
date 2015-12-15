import {getXrayFlux, getXrayFluxTypes} from "api/xrayflux";

describe("Xray flux", () => {

  it("should get the xray flux json", (done) => {
    getXrayFlux().then(() => {
      return done();
    });
  });

  it("should get the xray flux types json", (done) => {
    getXrayFluxTypes().then(() => {
      return done();
    });
  });

});
