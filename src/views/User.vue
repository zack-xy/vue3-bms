<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="user.userId" placeholder="请输入用户ID" clearable></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户名称">
          <el-input v-model="user.userName" placeholder="请输入用户名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="state" label="状态">
         <el-select v-model="user.state" placeholder="请选择" clearable>
           <el-option :value="0" label="所有"></el-option>
           <el-option :value="1" label="在职"></el-option>
           <el-option :value="2" label="离职"></el-option>
           <el-option :value="3" label="试用期"></el-option>
         </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset(this.$refs)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
         <el-button type="primary">新增</el-button>
         <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :min-width="item.minWidth? item.minWidth: 100">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleClick(scope.row)" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        :pager-count="6"
        :page-sizes="[10, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pager.pageNum"
        :page-size="pager.pageSize"
        :total="pager.total"
        @size-change="handleSizeChanged"
        @current-change="handlePageChanged"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import $api from '@/api'
import { USER_ROLE, USER_STATE } from '@/utils/constant.js'
import { alertMessage, globalLoading } from '@/utils/tools.js'
export default {
  name: 'user',
  setup () {
    onMounted(() => {
      getUserList()
    })
    const user = reactive({ userId: '', userName: '', state: 0 })
    const userList = ref([])
    const pager = reactive({
      total: 0,
      pageNum: 1,
      pageSize: 10
    })
    const checkedUsers = ref([])
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
        prop: 'role',
        formatter: (row, column, cellValue, index) => {
          return USER_ROLE[cellValue]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter: (row, column, cellValue, index) => {
          return USER_STATE[cellValue]
        }
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
    const getUserList = async () => {
      const params = { ...user, ...pager }
      try {
        const { data } = await $api.getUserList(params)
        const { list, page } = data
        pager.total = page.total
        userList.value = list
      } catch (error) {
        alertMessage.error(error)
      }
    }
    const handleQuery = () => {
      getUserList()
    }
    const handleReset = ($refs) => {
      $refs && $refs.form && $refs.form.resetFields()
    }
    const handleSizeChanged = (size) => {
      pager.pageNum = 1
      pager.pageSize = size
      getUserList()
    }
    const handlePageChanged = (page) => {
      pager.pageNum = page
      getUserList()
    }
    const handleDelete = async (row) => {
      globalLoading.show()
      const { code, msg } = await $api.userDelete({ userIds: [row.userId] })
      alertMessage[code === 200 ? 'success' : 'error'](msg)
      await getUserList()
      globalLoading.close()
    }
    const handleBatchDelete = async () => {
      if (checkedUsers.value.length === 0) {
        alertMessage.warning('请选择要删除的用户')
        return false
      }
      globalLoading.show()
      const { code, msg } = await $api.userDelete({
        userIds: checkedUsers.value.map(item => item.userId)
      })
      alertMessage[code === 200 ? 'success' : 'error'](msg)
      await getUserList()
      globalLoading.close()
    }
    const handleSelectionChange = (selection) => {
      checkedUsers.value = selection
    }
    return {
      user,
      userList,
      columns,
      pager,
      checkedUsers,
      getUserList,
      handleQuery,
      handleReset,
      handleSizeChanged,
      handlePageChanged,
      handleDelete,
      handleBatchDelete,
      handleSelectionChange
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
