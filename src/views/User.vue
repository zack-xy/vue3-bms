<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user">
        <el-form-item>
          <el-input v-model="user.userId" placeholder="请输入用户ID" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="user.userName" placeholder="请输入用户名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
         <el-select v-model="user.state" placeholder="请选择" clearable>
           <el-option :value="0" label="所有"></el-option>
           <el-option :value="1" label="在职"></el-option>
           <el-option :value="2" label="离职"></el-option>
           <el-option :value="3" label="试用期"></el-option>
         </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
         <el-button type="primary">新增</el-button>
         <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.minWidth? item.minWidth: 100">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleClick(scope.row)" size="mini">编辑</el-button>
            <el-button @click="handleClick(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
export default {
  name: 'user',
  setup () {
    const user = reactive({})
    const userList = ref([{
      userId: '001011021',
      userEmail: '321312@qq.com',
      userName: '战三',
      role: 0,
      state: 1,
      createTime: '2021-10-01 12:23:12',
      lastLoginTime: '2021-10-01 12:23:12'
    }])
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail',
        minWidth: 150
      },
      {
        label: '用户角色',
        prop: 'role'
      },
      {
        label: '用户状态',
        prop: 'state'
      },
      {
        label: '注册时间',
        prop: 'createTime',
        minWidth: 150
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        minWidth: 150
      }
    ])
    onMounted(() => {
      console.log('init.....')
    })
    return {
      user,
      userList,
      columns
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
