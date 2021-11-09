<template>
    <el-icon v-bind="$attrs">
        <component :is="name"></component>
    </el-icon>
</template>
<script>
// import { defineAsyncComponent } from 'vue'
import { Location, Promotion, Setting, Fold, Expand, Bell, UserFilled } from '@element-plus/icons'
export default {
  inheritAttrs: false,
  components: {
    Location,
    Promotion,
    Setting,
    Fold,
    Expand,
    Bell,
    UserFilled
    // 'my-icon': defineAsyncComponent(() =>
    //     import("./components/AsyncComponent.vue")
    // )
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
    return {}
  }
}
</script>
<style lang="scss" scoped>
</style>
