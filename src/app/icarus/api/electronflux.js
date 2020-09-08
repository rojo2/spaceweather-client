import { config } from '@/api/config'
import { url } from '@/api/url'
import { request } from '@/http/request'

export function getElectronFlux(data = {}) {
  return request(
    url(
      'electronflux',
      Object.assign(data, {
        format: 'json',
      })
    ),
    config.CREDENTIALS
  )
}

export function getElectronFluxTypes(data = {}) {
  return request(
    url(
      'etypes',
      Object.assign(data, {
        format: 'json',
      })
    ),
    config.CREDENTIALS
  )
}
