import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

console.log('环境变量>>', import.meta.env)

const app = createApp(App)
app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties.$storage = storage
app.use(router)
  .use(store)
  .use(ElementPlus, {
    locale: zhCn,
    size: 'small'
  })
  .mount('#app')
