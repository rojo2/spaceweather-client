import { getProtonFlux, getProtonFluxTypes } from '@/api/protonflux'
import { getElectronFlux, getElectronFluxTypes } from '@/api/electronflux'
import { getXrayFlux, getXrayFluxTypes } from '@/api/xrayflux'
import { getSunspots, getSunspotTypes, getSunspotRegions } from '@/api/sunspots'
import { getAlerts, getAlertTypes, getForecast } from '@/api/alerts'
import { getImageChannels, getImageChannelTypes } from '@/api/channels'
import { getSolarWind } from '@/api/solarwind'
import { getGeomagneticActivity } from '@/api/geomagnetic'
import { getRadioBlackout, getRadioBlackoutTypes } from '@/api/radioblackout'
import { getSolarRadiation, getSolarRadiationTypes } from '@/api/solarradiation'

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
      getSunspotRegions(),
    ])
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
  getSolarRadiationTypes,
}

export default API
