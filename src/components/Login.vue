<template>
  <div>
    <h1>欢迎来到登录界面</h1>
    <el-button @click="handleLogin">登陆</el-button>
    <el-button @click="goHome">回首页</el-button>
  </div>
</template>
<script>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import request from "@/utils/request.js";
import { ElMessage, ElLoading } from "element-plus";
export default {
    components: {},
    setup(props, context) {
        const router = useRouter();
        const goHome = () => {
            router.push("/welcome");
        };
        const handleLogin = () => {
            const loading = ElLoading.service({
                lock: true,
                text: "加载中..."
            });
            request
                .post("/login", {
                    firstName: "zack",
                    lastName: "zheng"
                })
                .then(res => {
                    loading.close();
                    ElMessage({
                        showClose: true,
                        message: "登陆成功",
                        type: "success"
                    });
                })
                .catch(err => {});
        };
        return { goHome, handleLogin };
    }
};
</script>
<style lang="scss" scoped>
</style>