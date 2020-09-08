import { config } from '@/api/config'
import queryString from 'query-string'

function concat(u) {
  if (u.substr(0, 1) === '/' && config.URL.substr(-1) === '/') {
    return config.URL + u.substr(1)
  } else if (u.substr(0, 1) !== '/' && config.URL.substr(-1) !== '/') {
    return config.URL + '/' + u
  }
  return config.URL + u + '/'
}

export function url(u, query = {}) {
  const newURL = new URL(concat(u))
  newURL.search = '?' + queryString.stringify(query)
  return newURL.toString()
}
