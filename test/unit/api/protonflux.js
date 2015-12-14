import {getProtonFlux} from "api/protonflux";

describe("Protonflux", () => {
  it("Should get the protonflux json", (done) => {
    getProtonFlux().then(() => {
      return done();
    });
  });
});
