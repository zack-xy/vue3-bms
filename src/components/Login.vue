<template>
  <div>
      <h1>欢迎来到登录界面</h1>
      <el-button @click="goHome">回首页</el-button>
      <Welcome msg="zack"></Welcome>
  </div>
</template>
<script>
import { useRouter } from 'vue-router'
import Welcome from './Welcome.vue'
export default {
  components: {
    Welcome
  },
  setup () {
    const router = useRouter()
    const goHome = () => {
      router.push('/welcome')
    }
    return { goHome }
  }
}
</script>
<style lang="scss" scoped>
</style>
