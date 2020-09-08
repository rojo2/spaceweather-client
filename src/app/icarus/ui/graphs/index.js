import { electronFluxGraph, protonFluxGraph, xrayFluxGraph } from './flux'
import { solarCycleGraph } from './solarCycle'
import { solarWindGraph } from './solarWind'
import { sunspots } from './sunspots'

export const graphs = {
  electronFluxGraph,
  protonFluxGraph,
  xrayFluxGraph,

  solarWindGraph,
  solarCycleGraph,

  sunspots,
}

export default graphs
