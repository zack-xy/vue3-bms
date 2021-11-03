/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  // 开发环境
  dev: {
    baseApi: 'http://localhost:3060/vue3Bms/',
    mockApi: 'http://localhost:3060/vue3Bms/'
  },
  // sit测试环境
  sit: {
    baseApi: 'https://zack-sit/api',
    mockApi: 'http://localhost:3060'
  },
  // uat测试环境
  uat: {
    baseApi: 'https://zack-uat/api',
    mockApi: 'http://localhost:3060'
  },
  // 生产环境
  prod: {
    baseApi: 'https://zack-prod/api',
    mockApi: ''
  }
}
export default {
  env,
  mock: env === 'dev',
  namespace: 'vue3Bms',
  ...EnvConfig[env]
}