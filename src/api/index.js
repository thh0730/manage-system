import axios from 'axios'

axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.timeout = 3000

export default axios
