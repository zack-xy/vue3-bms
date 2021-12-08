<template>
  <div class="leave-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item prop="state" label="审批状态">
         <el-select v-model="queryForm.applyState" placeholder="请选择" clearable>
            <el-option value="" label="全部"></el-option>
            <el-option v-for="key in Object.keys(APPLY_STATE)" :key="key" :value="key" :label="APPLY_STATE[key]">
            </el-option>
         </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getApplyList">查询</el-button>
          <el-button @click="handleReset(this.$refs)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
         <el-button type="primary">申请休假</el-button>
      </div>
      <el-table :data="applyList">
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
            <el-button @click="handleView(this, scope.row)" size="mini">查看</el-button>
            <el-button @click="handleQuit(scope.row)" type="danger" size="mini">作废</el-button>
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
      :title="dialogTitle"
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
import { onMounted, reactive, ref } from 'vue'
import $api from '@/api'
import { APPLY_TYPE, APPLY_STATE } from '@/utils/constant.js'
import { alertMessage, formatDate } from '@/utils/tools.js'
import moment from 'moment'
// import { ElMessageBox } from 'element-plus'
export default {
  name: 'leave',
  setup () {
    onMounted(() => {
      getApplyList()
    })
    const queryForm = reactive({ applyState: '' })
    const columns = reactive([
      {
        label: '单号',
        prop: 'orderNo'
      },
      {
        label: '休假时间',
        prop: '',
        formatter: (row, column, cellValue, index) => {
          return formatDate(new Date(row.startTime), 'yyyy-MM-dd') + '到' + formatDate(new Date(row.endTime), 'yyyy-MM-dd')
        }
      },
      {
        label: '休假时长',
        prop: 'leaveTime',
        minWidth: 150
      },
      {
        label: '休假类型',
        prop: 'applyType',
        formatter: (row, column, cellValue, index) => {
          return APPLY_TYPE[cellValue]
        }
      },
      {
        label: '休假原因',
        prop: 'reason'
      },
      {
        label: '申请时间',
        prop: 'createTime',
        minWidth: 150,
        formatter: (row, column, cellValue, index) => {
          return moment(cellValue).format('YYYY-MM-DD HH:MM:SS')
        }
      },
      {
        label: '审批人',
        prop: 'auditUser'
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName'
      },
      {
        label: '审批状态',
        prop: 'applyState',
        formatter: (row, column, cellValue, index) => {
          return APPLY_STATE[cellValue]
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
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })
    const applyList = ref([])
    const getApplyList = async () => {
      const params = { ...queryForm, ...pager }
      try {
        const { data } = await $api.getApproveList(params)
        const { list, page } = data
        pager.total = page.total
        applyList.value = list
      } catch (error) {
        alertMessage.error(error)
      }
    }
    const handleSizeChanged = (size) => {
      pager.pageNum = 1
      pager.pageSize = size
      getApplyList()
    }
    const handlePageChanged = (page) => {
      pager.pageNum = page
      getApplyList()
    }
    const handleReset = ($refs) => {
      $refs && $refs.form && $refs.form.resetFields()
    }
    const handleView = () => {

    }
    const handleQuit = () => {

    }
    return {
      APPLY_STATE,
      queryForm,
      applyList,
      pager,
      columns,
      handleSizeChanged,
      handlePageChanged,
      handleReset,
      handleView,
      handleQuit
    }
  }
}
</script>

<style lang="scss" scoped>
.full-width {
  width: 100%;
}
</style>
