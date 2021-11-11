<template>
    <div class="basic-layout">
        <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
            <!-- 系统LOGO -->
            <div class="logo">
                <img src="./../assets/logo.png" />
                <span v-show="!isCollapse">Manager</span>
            </div>
            <!-- 导航菜单 -->
            <el-menu :default-active="activeMenu" background-color="#001529" text-color="#fff" router :collapse="isCollapse" class="nav-menu">
                <tree-menu :userMenu="userMenu" :collapse="isCollapse"/>
            </el-menu>
        </div>
        <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
            <div class="nav-top">
                <div class="nav-left">
                    <div class="menu-fold">
                        <BmsIcon class="icon" name="fold" @click="toggle" v-show="!isCollapse"/>
                        <BmsIcon class="icon" name="expand" @click="toggle" v-show="isCollapse"/>
                    </div>
                    <div class="bread">
                        <BreadCrumb></BreadCrumb>
                    </div>
                </div>
                <div class="user-info">
                    <el-badge :value="noticeCount>0 ? noticeCount: undefined" :max="99" class="notice" type="danger">
                        <BmsIcon class="bell-icon" name="bell" />
                    </el-badge>
                    <el-dropdown @command="handleLogout">
                        <span class="user-link">
                            {{ userInfo.userName }}
                            <BmsIcon class="user-icon" name="user-filled" />
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                                <el-dropdown-item command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </div>
            <div class="wrapper">
              <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
import BmsIcon from './BmsIcon.vue'
import { globalLoading } from '@/utils/tools.js'
import TreeMenu from './TreeMenu.vue'
import BreadCrumb from './BreadCrumb.vue'
export default {
  data () {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo || {},
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    }
  },
  components: {
    TreeMenu,
    BreadCrumb,
    BmsIcon
  },
  methods: {
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    handleLogout (key) {
      if (key === 'email') return
      this.$store.commit('saveUserInfo', '')
      this.userInfo = null
      this.$router.push('/login')
    },
    async getNoticeCount () {
      try {
        globalLoading.show()
        const { data } = await this.$api.noticeCount({
          userId: this.userInfo.userId
        })
        this.noticeCount = data
        globalLoading.close()
      } catch (error) {
        globalLoading.close()
      }
    },
    async getMenuList () {
      try {
        globalLoading.show()
        const { data } = await this.$api.getMenuList()
        this.userMenu = data
        globalLoading.close()
      } catch (error) {
        globalLoading.close()
      }
    }
  },
  mounted () {
    this.getNoticeCount()
    this.getMenuList()
  },
  setup () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.basic-layout {
    position: relative;
    .nav-side {
        position: fixed;
        width: 200px;
        height: 100vh;
        background-color: #001529;
        color: $white;
        overflow-y: auto;
        transition: width 0.5s;
        // 合并
        &.fold {
            width: 64px;
            transition: width 0.35s ease-in;
        }
        // 展开
        &.unfold {
            width: 200px;
            transition: width 0.25s ease-out;
        }
        .logo {
            display: flex;
            align-items: center;
            font-size: 18px;
            height: 50px;
            img {
                margin: 0 16px;
                width: 32px;
                height: 32px;
            }
        }
        .nav-menu {
            height: calc(100vh - 50px);
            border-right: none;
        }
    }
    .content-right {
        margin-left: 200px;
        // 合并
        &.fold {
            margin-left: 64px;
        }
        // 展开
        &.unfold {
            margin-left: 200px;
        }
        .nav-top {
            height: 50px;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #ddd;
            padding: 0 20px;
            .nav-left {
                display: flex;
                align-items: center;
                .menu-fold {
                    .icon {
                        font-size: 30px;
                        margin-right: 5px;
                        vertical-align: middle;
                        margin-bottom: 4px;
                        cursor: pointer;
                    }
                }
            }
            .user-info {
                .notice {
                    line-height: 15px;
                    margin-right: 15px;
                    .bell-icon {
                        font-size: 20px;
                        cursor: pointer;
                    }
                }
                .user-link {
                    cursor: pointer;
                    color: #409eff;
                    .user-icon {
                        font-size: 20px;
                        vertical-align: middle;
                        margin-bottom: 3px;
                        cursor: pointer;
                    }
                }
            }
        }
        .wrapper {
            background: #eef0f3;
            padding: 20px;
            height: calc(100vh - 50px);
            .main-page {
                background-color: $white;
                height: 100%;
            }
        }
    }
}
</style>
