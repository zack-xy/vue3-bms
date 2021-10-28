/**
 * 环境配置封装
 */
const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  // 开发环境
  dev: {
    baseApi: '/',
    mockApi: ''
  },
  // sit测试环境
  sit: {
    baseApi: 'https://zack-sit/api',
    mockApi: ''
  },
  // uat测试环境
  uat: {
    baseApi: 'https://zack-uat/api',
    mockApi: ''
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
  ...EnvConfig[env]
}
