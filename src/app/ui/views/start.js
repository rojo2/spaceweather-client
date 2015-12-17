import * as utils from "../utils";

import {initBackground} from "../background";
import {initSounds} from "../sounds";

export function view(router) {

  // start navigation.
  utils.queryAll("a").map((current) => {
    current.addEventListener("click", (e) => {

      e.preventDefault();

      let url;
      if (utils.hasAttr(e.currentTarget, "data-param-name") && utils.hasAttr(e.currentTarget, "data-param-value")) {
        const name = utils.getAttr(e.currentTarget, "data-param-name"),
              value = utils.getAttr(e.currentTarget, "data-param-value");

        url = router.createURL(e.currentTarget.href, {
          [name]: value
        });
      } else {
        url = router.createURL(e.currentTarget.href);
      }

      router.navigate(url.toString());

    });
  });

  // set the timeline.
  utils.timeline(utils.query(".Weather .Timeline"), (value) => {
    console.log("value", value);
  });

  // init background.
  initBackground();
  initSounds();
}
