import { config } from '@/api/config'
import { url } from '@/api/url'
import { request } from '@/http/request'

export function getXrayFlux(data = {}) {
  return request(
    url(
      'xrayflux',
      Object.assign(data, {
        format: 'json',
      })
    ),
    config.CREDENTIALS
  )
}

export function getXrayFluxTypes(data = {}) {
  return request(
    url(
      'xtypes',
      Object.assign(data, {
        format: 'json',
      })
    ),
    config.CREDENTIALS
  )
}
