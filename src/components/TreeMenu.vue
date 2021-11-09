<template>
    <div :class="collapse ? 'el-menu--collapse':''"> <!--增加根div，防止报错并支持菜单收缩-->
        <template v-for="menu in userMenu">
            <el-sub-menu v-if="menu.children &&
                menu.children.length > 0 &&
                menu.children[0].menuType == 1" :key="menu._id" :index="menu.path">
                <template #title>
                    <BmsIcon :name="menu.icon"></BmsIcon>
                    <span>{{ menu.menuName }}</span>
                </template>
                <tree-menu :userMenu="menu.children" />
            </el-sub-menu>
            <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="menu._id">
                {{ menu.menuName }}
            </el-menu-item>
        </template>
    </div>
</template>
<script>
import BmsIcon from './BmsIcon.vue'
export default {
  name: 'TreeMenu',
  components: {
    BmsIcon
  },
  props: {
    userMenu: {
      type: Array,
      default () {
        return []
      }
    },
    collapse: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  setup () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
</style>
