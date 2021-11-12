/**
 * Api管理
 */
import request from '@/utils/request'
export default {
  // 登陆
  login (params) {
    return request({
      url: '/users/login',
      data: params
    })
  },

  // 获取消息数目
  noticeCount (params) {
    return request({
      url: '/approve/count',
      data: params
    })
  },

  // 获取菜单列表
  getMenuList (params) {
    return request({
      url: '/menu/list',
      data: params
    })
  },

  // 获取用户列表
  getUserList (params) {
    return request({
      url: '/users/list',
      data: params
    })
  }
}
