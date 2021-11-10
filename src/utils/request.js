import axios from 'axios'
import config from '../config'
import router from '../router'
import { ElMessage } from 'element-plus'
import storage from './storage'
const TOKEN_INVALID = 'Token认证失败，请重新登陆'
const NETWORK_ERROR = '网络请求异常，请稍后重试'
const REQUEST_TYPES = ['get', 'post', 'put', 'delete', 'patch']
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})
// 请求拦截
service.interceptors.request.use(req => {
  const headers = req.headers
  const { token } = storage.getItem('userInfo')
  if (!headers.Authorization) {
    headers.Authorization = token
  }
  return req
})
// 响应拦截
service.interceptors.response.use(res => {
  const { code, msg } = res.data
  if (code === 200) {
    return res.data
  } else if (code === 5001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 15000)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})
function request (options) {
  options.method = options.method || 'post'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  if (typeof options.mock !== 'undefined') {
    config.mock = options.mock
  }
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }
  return service(options)
}
REQUEST_TYPES.forEach(item => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})
export default request
