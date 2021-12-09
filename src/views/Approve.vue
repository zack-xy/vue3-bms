<template>
  <div class="approve-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item prop="state" label="审批状态">
         <el-select v-model="queryForm.applyState" placeholder="请选择" clearable>
            <el-option value="" label="全部"></el-option>
            <el-option v-for="key in Object.keys(APPLY_STATE)" :key="key" :value="Number(key)" :label="APPLY_STATE[key]">
            </el-option>
         </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset(this.$refs)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
      </div>
      <el-table :data="applyList" border style="width: 100%" max-height="500">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :min-width="item.minWidth? item.minWidth: 100">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button v-if="scope.row.curAuditUserName == userInfo.userName && [1,2].includes(scope.row.applyState)" type="danger" size="mini" @click="handleView(this, scope.row)" >审核</el-button>
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
      title="审核"
      width="50%">
      <el-form :model="applyForm" label-width="80px" ref="createApplyForm" :rules="applyRoles">
        <el-row>
            <el-col :span="12">
              <el-form-item label="申请人:">
                <div>{{applyForm.applyUser.userName}}</div>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
              <el-form-item label="休假类型:">
                <div>{{APPLY_TYPE[applyForm.applyType]}}</div>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="休假时间:">
              <div>{{applyForm.leaveDate[0]}}至{{applyForm.leaveDate[1]}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="休假时长:" prop="leaveTime">
          {{applyForm.leaveTime}}
        </el-form-item>
        <el-form-item label="休假原因:" prop="reasons">
          <div>{{applyForm.reasons}}</div>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input type="textarea" :row="5" placeholder="请填写备注" v-model="applyForm.remark" :disabled="isView">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="handleApprove(this, 'refuse')">审核驳回</el-button>
          <el-button type="success" @click="handleApprove(this, 'pass')">审核通过</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive, ref, nextTick } from 'vue'
import $api from '@/api'
import { APPLY_TYPE, APPLY_STATE } from '@/utils/constant.js'
import { alertMessage, formatDate } from '@/utils/tools.js'
import moment from 'moment'
import { useStore } from 'vuex'
export default {
  name: 'approve',
  setup () {
    onMounted(() => {
      getLeaveList()
    })
    const store = useStore()
    const userInfo = store.state.userInfo
    const queryForm = reactive({ applyState: '' })
    const applyForm = reactive({ applyUser: {}, applyType: '', leaveDate: [], leaveTime: '0天', reasons: '', remark: '' })
    const applyRoles = reactive({
      remark: [
        {
          required: true,
          message: '请填写备注',
          trigger: ['blur', 'change']
        }
      ]
    })
    const columns = reactive([
      {
        label: '单号',
        prop: 'orderNo'
      },
      {
        label: '申请人',
        prop: 'applyUser',
        formatter: (row, column, cellValue, index) => {
          return row?.applyUser?.userName
        }
      },
      {
        label: '休假时间',
        prop: '',
        minWidth: 200,
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
        prop: 'reasons'
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
        prop: 'auditUsers'
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
      }
      // {
      //   label: '最后登录时间',
      //   prop: 'lastLoginTime',
      //   minWidth: 150,
      //   formatter: (row, column, cellValue, index) => {
      //     return formatDate(new Date(cellValue))
      //   }
      // }
    ])
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0
    })
    const dialogVisible = ref(false)
    const applyList = ref([])
    const getLeaveList = async () => {
      const params = { ...queryForm, ...pager, type: 'approve' }
      try {
        const { data } = await $api.getLeaveList(params)
        const { list, page } = data
        pager.total = page.total
        applyList.value = list
        await nextTick()
      } catch (error) {
        alertMessage.error(error)
      }
    }
    const handleSizeChanged = (size) => {
      pager.pageNum = 1
      pager.pageSize = size
      getLeaveList()
    }
    const handlePageChanged = (page) => {
      pager.pageNum = page
      getLeaveList()
    }
    const handleSearch = () => {
      getLeaveList()
    }
    const handleReset = ($refs) => {
      $refs && $refs.form && $refs.form.resetFields()
    }
    const handleApprove = (_this, action) => {
      _this.$refs.createApplyForm.validate(async (valid) => {
        if (valid) {
          const params = { remark: applyForm.remark, action, _id: applyForm._id }
          const { msg } = await $api.leaveApprove(params)
          dialogVisible.value = false
          alertMessage.success(msg)
          await getLeaveList()
        } else {
          return false
        }
      })
    }
    const handleView = async (_this, row) => {
      dialogVisible.value = true
      _this.$nextTick(() => {
        _this.$refs.createApplyForm.resetFields()
        Object.assign(applyForm, row)
      })
      applyForm.leaveDate = [formatDate(new Date(row.startTime), 'yyyy-MM-dd'), formatDate(new Date(row.endTime), 'yyyy-MM-dd')]
    }
    return {
      APPLY_STATE,
      APPLY_TYPE,
      userInfo,
      queryForm,
      applyList,
      pager,
      columns,
      dialogVisible,
      applyForm,
      applyRoles,
      handleSearch,
      handleSizeChanged,
      handlePageChanged,
      handleReset,
      handleApprove,
      handleView
    }
  }
}
</script>
<style lang="scss" scoped>
.full-width {
  width: 100%;
}
.leave-steps {
  margin-bottom: 20px;
}
</style>
