import { config } from '@/api/config'
import { url } from '@/api/url'
import { request } from '@/http/request'

export function getSolarWind(data = {}) {
  return request(
    url(
      'solarwind',
      Object.assign(data, {
        format: 'json',
      })
    ),
    config.CREDENTIALS
  )
}
