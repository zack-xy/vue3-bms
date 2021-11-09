<template>
    <el-icon v-bind="$attrs">
        <component :is="name"></component>
    </el-icon>
</template>
<script>
// import { defineAsyncComponent } from 'vue'
import { Location, Promotion, Setting, Fold, Expand, Bell, UserFilled } from '@element-plus/icons'
import ExtAnalitycs from '@/assets/icons/analitycs.svg'
// （使用了vite-svg-loader插件）导入svg文件作为vue组件，命名以Ext开头，表示扩展
export default {
  inheritAttrs: false,
  components: {
    Location,
    Promotion,
    Setting,
    Fold,
    Expand,
    Bell,
    UserFilled,
    ExtAnalitycs
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  setup () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
