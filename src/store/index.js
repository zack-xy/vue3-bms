/**
 * Vuex状态管理
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import storage from '@/utils/storage'
const state = {
  userInfo: storage.getItem('userInfo') || {},
  menuList: storage.getItem('userMenu') || [],
  actionList: storage.getItem('userAction') || [],
  noticeCount: storage.getItem('noticeCount') || 0
}
export default createStore({
  state,
  mutations
})
