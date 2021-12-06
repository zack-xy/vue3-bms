/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  // 开发环境
  dev: {
    baseApi: '/vue3Bms', // 本地联调
    mockApi: 'http://localhost:3060/vue3Bms/'
  },
  // sit测试环境
  sit: {
    baseApi: 'https://zack-sit/api',
    mockApi: 'http://localhost:3060/vue3Bms/'
  },
  // uat测试环境
  uat: {
    baseApi: 'https://zack-uat/api',
    mockApi: 'http://localhost:3060/vue3Bms/'
  },
  // 生产环境
  prod: {
    baseApi: 'https://zack-prod/api',
    mockApi: ''
  }
}
export default {
  env,
  // mock: env === 'dev',
  mock: false, // 联调
  namespace: 'vue3Bms',
  ...EnvConfig[env]
}
