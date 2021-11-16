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
      // mock: false
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
      // mock: false
    })
  },

  // 用户删除
  userDelete (params) {
    return request({
      url: '/users/delete',
      data: params
      // mock: false
    })
  },

  // 角色列表
  getRoleList (params, isSilence = true) {
    return request({
      url: '/roles/allList',
      data: params,
      isSilence
    })
  },

  // 部门列表
  getDeptList (params, isSilence = true) {
    return request({
      url: '/dept/list',
      data: params,
      isSilence
    })
  },

  // 用户新增/编辑
  updateUser (params) {
    return request({
      url: '/users/operate',
      data: params
      // mock: false
    })
  }
}
