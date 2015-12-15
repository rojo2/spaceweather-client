import {getAlerts, getAlertTypes} from "api/alerts";

describe("Alerts", () => {

  it("should get the alerts json", (done) => {
    getAlerts().then(() => {
      return done();
    });
  });

  it("should get the alerts types json", (done) => {
    getAlertTypes().then(() => {
      return done();
    });
  });

});
