<template>
  <div>
    <h1>欢迎来到主界面---{{msg}}</h1>
    <router-link to="/login">去登陆</router-link>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  msg: String
})
</script>
<style lang="scss" scoped>
</style>
