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
            <el-option v-for="key in Object.keys(USER_STATE)" :key="key" :value="key" :label="USER_STATE[key]">
            </el-option>
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
         <el-button type="primary" @click="handleCreate(this)">新增</el-button>
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
            <el-button @click="handleEdit(this, scope.row)" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        :page-sizes="[10, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pager.pageNum"
        :page-size="pager.pageSize"
        :total="pager.total"
        @size-change="handleSizeChanged"
        @current-change="handlePageChanged"
      ></el-pagination>
    </div>
    <el-dialog
      v-model="dialogVisible"
      center
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="用户新增"
      width="40%">
      <el-form :model="userAddForm" label-width="80px" ref="createForm" :rules="userAddRoles">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userAddForm.userName" placeholder="请输入用户名" clearable :disabled="operationType === 'edit'" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="userAddForm.userEmail" placeholder="请输入邮箱" clearable :disabled="operationType === 'edit'">
            <template #append>@zack.com.cn</template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userAddForm.mobile" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="job">
          <el-input v-model="userAddForm.job" placeholder="请输入岗位" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select class="full-width" v-model="userAddForm.state" filterable >
            <el-option v-for="key in Object.keys(USER_STATE)" :key="key" :value="Number(key)" :label="USER_STATE[key]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select class="full-width" v-model="userAddForm.roleList" placeholder="请选择用户角色" clearable filterable multiple @visible-change="getAllRoleList">
            <el-option v-for="item in roleList" :key="item._id" :value="item._id" :label="item.roleName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
            <el-cascader
              style="width:100%"
              v-model="userAddForm.deptId"
              placeholder="请选择所属部门"
              :options="deptList"
              :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
              @visible-change="getDeptList"
              clearable/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitCreate(this)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRaw } from 'vue'
import $api from '@/api'
import { USER_ROLE, USER_STATE } from '@/utils/constant.js'
import { alertMessage, formatDate } from '@/utils/tools.js'
import moment from 'moment'
import { ElMessageBox } from 'element-plus'
export default {
  name: 'user',
  setup () {
    onMounted(() => {
      getUserList()
    })
    const user = reactive({ userId: '', userName: '', state: 0 })
    const userAddForm = reactive({ userName: '', userEmail: '', mobile: '', job: '', state: 3, roleList: [], deptId: '' })
    const userAddRoles = reactive({
      userName: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }
      ],
      userEmail: [
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }
      ],
      mobile: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          pattern: /^1[3456789]\d{9}$/,
          message: '不正确的手机号格式',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请选择部门',
          trigger: ['blur', 'change']
        }
      ],
      roleList: [
        {
          type: 'array',
          required: true,
          message: '请选择角色',
          trigger: ['blur', 'change']
        }
      ]
    })
    const userList = ref([])
    const pager = reactive({
      total: 0,
      pageNum: 1,
      pageSize: 10
    })
    const checkedUsers = ref([])
    const dialogVisible = ref(false)
    const roleList = ref([])
    const deptList = ref([])
    const operationType = ref('add')
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
        minWidth: 150,
        formatter: (row, column, cellValue, index) => {
          return moment(cellValue).format('YYYY-MM-DD HH:MM:SS')
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        minWidth: 150,
        formatter: (row, column, cellValue, index) => {
          return formatDate(new Date(cellValue))
        }
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
    const handleQuery = async () => {
      await getUserList()
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
      ElMessageBox.confirm(
        '确认删除？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        const { msg } = await $api.userDelete({ userIds: [row.userId] })
        alertMessage.success(msg)
        await getUserList()
      }).catch(() => {})
    }
    const handleBatchDelete = async () => {
      if (checkedUsers.value.length === 0) {
        alertMessage.warning('请选择要删除的用户')
        return false
      }
      const { msg } = await $api.userDelete({
        userIds: checkedUsers.value.map(item => item.userId)
      })
      alertMessage.success(msg)
      await getUserList()
    }
    const handleSelectionChange = (selection) => {
      checkedUsers.value = selection
    }
    const handleCreate = (_this) => {
      dialogVisible.value = true
      operationType.value = 'add'
      _this.$nextTick(() => {
        _this.$refs.createForm.resetFields()
        setTimeout(() => {
          _this.$refs.createForm.clearValidate()
        }, 0)
      })
    }
    const handleEdit = (_this, row) => {
      operationType.value = 'edit'
      dialogVisible.value = true
      _this.$nextTick(async () => {
        _this.userAddRoles.roleList = []
        _this.$refs.createForm.resetFields()
        Object.assign(userAddForm, row)
        userAddForm.userEmail = userAddForm.userEmail.split('@')[0]
        if (deptList.value.length === 0) {
          await getDeptList(true, false)
        }
        if (roleList.value.length === 0) {
          await getAllRoleList(true, false)
        }
      })
    }
    const getDeptList = async (status, isSilence = true) => {
      if (!status) return false
      if (deptList.value.length !== 0) return false
      const { code, data, msg } = await $api.getDeptList({}, isSilence)
      if (code === 200) {
        deptList.value = data
      } else {
        alertMessage.error(msg)
      }
    }
    const getAllRoleList = async (status, isSilence = true) => {
      if (!status) return false
      if (roleList.value.length !== 0) return false
      const { code, data, msg } = await $api.getAllRoleList({}, isSilence)
      if (code === 200) {
        roleList.value = data
      } else {
        alertMessage.error(msg)
      }
    }
    const handleSubmitCreate = (_this) => {
      _this.$refs.createForm.validate(async (valid) => {
        if (valid) {
          const params = { action: operationType.value, ...toRaw(userAddForm) }
          params.email += '@zack.com.cn'
          const { code, msg } = await $api.updateUser(params)
          if (code === 200) {
            alertMessage.success(msg)
            await getUserList()
            dialogVisible.value = false
          } else {
            alertMessage.error(msg)
          }
        } else {
          return false
        }
      })
    }
    return {
      USER_STATE,
      user,
      userAddForm,
      userAddRoles,
      userList,
      columns,
      pager,
      checkedUsers,
      dialogVisible,
      roleList,
      deptList,
      operationType,
      getUserList,
      handleQuery,
      handleReset,
      handleSizeChanged,
      handlePageChanged,
      handleDelete,
      handleBatchDelete,
      handleSelectionChange,
      handleCreate,
      handleEdit,
      getDeptList,
      getAllRoleList,
      handleSubmitCreate
    }
  }
}
</script>

<style lang="scss" scoped>
.full-width {
  width: 100%;
}
</style>
