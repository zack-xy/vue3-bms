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
                <tree-menu :userMenu="userMenu" />
            </el-menu>
        </div>
        <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
            <div class="nav-top">
                <div class="nav-left">
                    <div class="menu-fold">
                        <Fold class="icon" @click="toggle" v-show="!isCollapse"></Fold>
                        <Expand class="icon" @click="toggle" v-show="isCollapse"></Expand>
                    </div>
                    <div class="bread">
                        面包屑
                    </div>
                </div>
                <div class="user-info">
                    <el-badge :value="noticeCount>0 ? noticeCount: undefined" :max="99" class="notice" type="danger">
                        <Bell class="bell-icon"></Bell>
                    </el-badge>
                    <el-dropdown @command="handleLogout">
                        <span class="user-link">
                            {{ userInfo.userName }}
                            <UserFilled class="user-icon"></UserFilled>
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
                <div class="main-page">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Fold, Expand, Bell, UserFilled } from '@element-plus/icons'
import { globalLoading } from '@/utils/tools.js'
export default {
  data () {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      activeMenu: location.hash.slice(1)
    }
  },
  components: {
    Fold,
    Expand,
    Bell,
    UserFilled
  },
  methods: {
    toggle () {
      this.isCollapse = !this.isCollapse
    },
    handleLogout () {},
    async getNoticeCount () {
      try {
        globalLoading.show()
        const { data } = await this.$api.noticeCount()
        this.noticeCount = data
        globalLoading.close()
      } catch (error) {
        console.error(error)
      }
    },
    async getMenuList () {
      try {
        globalLoading.show()
        const list = await this.$api.getMenuList()
        this.userMenu = list
        globalLoading.close()
      } catch (error) {
        console.error(error)
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
        color: #fff;
        overflow-y: auto;
        transition: width 0.5s;
        // 合并
        &.fold {
            width: 64px;
        }
        // 展开
        &.unfold {
            width: 200px;
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
                        font-size: 10px;
                        width: 30px;
                        height: 30px;
                        margin-right: 5px;
                        vertical-align: middle;
                        margin-bottom: 4px;
                        cursor: pointer;
                    }
                }
            }
            .user-info {
                .notice {
                    line-height: 30px;
                    margin-right: 15px;
                    .bell-icon {
                        width: 20px;
                        height: 20px;
                        cursor: pointer;
                    }
                }
                .user-link {
                    cursor: pointer;
                    color: #409eff;
                    .user-icon {
                        width: 20px;
                        height: 20px;
                        margin-bottom: -3px;
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
                background-color: #fff;
                height: 100%;
            }
        }
    }
}
</style>
