import axios from 'axios'

export function request(url, config) {
  return axios.get(url)
}

export default request
