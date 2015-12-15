import {getSunspots, getSunspotTypes, getSunspotRegions} from "api/sunspots";

describe("Sunspots", () => {

  it("should get the sunspots json", (done) => {
    getSunspots().then(() => {
      return done();
    });
  });

  it("should get the sunspot types json", (done) => {
    getSunspotTypes().then(() => {
      return done();
    });
  });

  it("should get the sunspot regions json", (done) => {
    getSunspotRegions().then(() => {
      return done();
    });
  });

});
