import {getProtonFlux,getProtonFluxTypes} from "icarus/api/protonflux";
import {getElectronFlux,getElectronFluxTypes} from "icarus/api/electronflux";
import {getXrayFlux,getXrayFluxTypes} from "icarus/api/xrayflux";
import {getSunspots,getSunspotTypes,getSunspotRegions} from "icarus/api/sunspots";
import {getAlerts,getAlertTypes,getForecast} from "icarus/api/alerts";
import {getImageChannels,getImageChannelTypes} from "icarus/api/channels";
import {getSolarWind} from "icarus/api/solarwind";
import {getGeomagneticActivity} from "icarus/api/geomagnetic";
import {getRadioBlackout,getRadioBlackoutTypes} from "icarus/api/radioblackout";
import {getSolarRadiation,getSolarRadiationTypes} from "icarus/api/solarradiation";

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
  getForecast,

  getImageChannels,
  getImageChannelTypes,

  getSolarWind,

  getGeomagneticActivity,

  getRadioBlackout,
  getRadioBlackoutTypes,

  getSolarRadiation,
  getSolarRadiationTypes

};

export default API;
