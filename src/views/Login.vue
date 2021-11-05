/* eslint-disable vue/no-unused-components */
<template>
    <div class="login-wrapper">
        <div class="modal">
            <el-form :model="user" status-icon :rules="rules">
                <div class="title">登陆</div>
                <el-form-item>
                    <el-input type="text" placeholder="用户名" clearable :prefix-icon="User" v-model="user.userName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input type="password" placeholder="密码" clearable :prefix-icon="View" v-model="user.userPwd"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="login-btn" @click="handleLogin">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { User, View } from '@element-plus/icons'
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    User,
    // eslint-disable-next-line vue/no-unused-components
    View
  },
  data () {
    return {
      user: {
        userName: '',
        userPwd: ''
      },
      rules: {
        userName: [
          {
            required: true, message: '请输入用户名', trigger: 'blur'
          }
        ],
        userPwd: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleLogin () {

    }
  },
  setup () {
    return {
      User,
      View
    }
  }
}
</script>
<style lang="scss" scoped>
.login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9fcff;
    width: 100vw;
    height: 100vh;
    .modal {
        width: 500px;
        padding: 50px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0px 0px 10px 3px #c7c9cb4d;
        .title {
            font-size: 30px;
            text-align: center;
            margin-bottom: 40px;
        }
        .login-btn {
            width: 100%;
        }
    }
}
</style>
