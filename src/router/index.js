import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import storage from './../utils/storage' // 调用vuex里的数据
import API from './../api' // 调用接口
import { generateRoute } from './../utils/tools' // 调用工具函数
const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        meta: {
          title: '欢迎页'
        },
        component: () => import('../views/Welcome.vue')
      }
    ]
  },
  {
    name: 'Page404',
    path: '/404',
    meta: {
      title: '页面不存在'
    },
    component: () => import('../views/404.vue')
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登陆'
    },
    component: () => import('../views/Login.vue')
  }
]
// 创建router对象
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 加载动态路由
async function loadAsyncRoutes () {
  const userInfo = storage.getItem('userInfo') || {}
  if (userInfo.token) { // 有token权限才能调用接口
    try {
      const { data: { menuList } } = await API.getPermissionList()
      const routes = generateRoute(menuList)
      routes.map(route => {
        const url = `./../views/${route.component}.vue`
        route.component = () => import(url /* @vite-ignore */)
        router.addRoute('home', route)
      })
    } catch (error) {

    }
  }
}
loadAsyncRoutes()
router.beforeEach(async (to, from, next) => {
  if (to.name) {
    if (router.hasRoute(to.name)) {
      document.title = to.meta.title
      next()
    } else {
      next('404')
    }
  } else {
    await loadAsyncRoutes()
    const curRoute = router.getRoutes().filter(item => item.path === to.path)
    if (curRoute && curRoute.length > 0) {
      document.title = curRoute[0].meta.title
      next({ ...to, replace: true })
    } else {
      next('/404')
    }
  }
})
export default router
