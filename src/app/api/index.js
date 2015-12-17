import {getProtonFlux,getProtonFluxTypes} from "./protonflux";
import {getElectronFlux,getElectronFluxTypes} from "./electronflux";
import {getXrayFlux,getXrayFluxTypes} from "./xrayflux";
import {getSunspots,getSunspotTypes,getSunspotRegions} from "./sunspots";
import {getAlerts,getAlertTypes} from "./alerts";
import {getImageChannels,getImageChannelTypes} from "./channels";
import {getSolarWind} from "./solarwind";

export const API = {

  getAll() {

    return Promise.all([
      // load types.
      getProtonFluxTypes(),
      getElectronFluxTypes(),
      getXrayFluxTypes(),
      getAlertTypes(),
      getSunspotTypes(),

      // load flux data.
      getProtonFlux(),
      getElectronFlux(),
      getXrayFlux(),

      // load sunspots.
      getSunspots(),
      getSunspotRegions()
    ]);

  },

  getProtonFlux,
  getProtonFluxTypes,

  getElectronFlux,
  getElectronFluxTypes,

  getXrayFlux,
  getXrayFluxTypes,

  getSunspots,
  getSunspotTypes,
  getSunspotRegions,

  getAlerts,
  getAlertTypes,

  getImageChannels,
  getImageChannelTypes,

  getSolarWind

};

export default API;
