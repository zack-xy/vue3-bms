import axios from 'axios'
import config from '../config'
import router from '../router'
import { ElMessage } from 'element-plus'
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
  if (!headers.Authorization) {
    headers.Authorization = 'Zack'
  }
  return req
})
// 响应拦截
service.interceptors.response.use(res => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 401) {
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
