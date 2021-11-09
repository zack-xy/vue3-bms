<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
            <router-link to="/welcome" v-if="index == 0">
                {{item.meta.title}}
            </router-link>
            <span v-else>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script>
import { ArrowRight } from '@element-plus/icons'
export default {
  name: 'BreadCrumb',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ArrowRight
  },
  computed: {
    breadList () {
      return this.$route.matched
    }
  },
  setup () {
    return {
      ArrowRight
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
