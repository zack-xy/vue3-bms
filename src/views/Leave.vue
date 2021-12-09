<template>
  <div class="leave-manage">
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
          <el-button type="primary" @click="getLeaveList">查询</el-button>
          <el-button @click="handleReset(this.$refs)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
         <el-button type="primary" @click="handleApplyForLeave(this)">申请休假</el-button>
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
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button @click="handleView(this, scope.row)" size="mini">查看</el-button>
            <el-button v-if="[1,2].includes(scope.row.applyState)" @click="handleQuit(scope.row)" type="danger" size="mini">作废</el-button>
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
      :title="isView ? '查看':'休假申请'"
      width="50%">
      <el-steps :active="viewRow.applyState > 2 ? 3 : viewRow.applyState" align-center v-show="isView" finish-status="success" class="leave-steps">
        <el-step title="待审批"></el-step>
        <el-step title="审批中"></el-step>
        <el-step :title="viewRow.applyState >2 ? APPLY_STATE[viewRow.applyState] : '审批通过/审批拒绝'" :status="stepFinishStatus"></el-step>
      </el-steps>
      <el-form :model="applyForm" label-width="80px" ref="createApplyForm" :rules="applyRoles">
        <el-row>
            <el-col :span="12">
              <el-form-item label="休假类型" prop="applyType" required>
                <el-select class="full-width" v-model="applyForm.applyType" placeholder="请选择" clearable :disabled="isView">
                  <el-option v-for="key in Object.keys(APPLY_TYPE)" :key="key" :value="Number(key)" :label="APPLY_TYPE[key]">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="休假时间" required prop="leaveDate">
                <el-date-picker
                  style="width:100%"
                  v-model="applyForm.leaveDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  value-format="YYYY-MM-DD"
                  @change="leaveDateChanged"
                  end-placeholder="结束日期"
                  :disabled="isView">
                </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="休假时长" prop="leaveTime">
          {{applyForm.leaveTime}}
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons">
          <el-input type="textarea" :row="5" placeholder="请填写休假原因" v-model="applyForm.reasons" :disabled="isView">
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{operationType=='create'?'取消':'关闭'}}</el-button>
          <el-button v-show="operationType=='create'" type="primary" @click="handleSubmitCreate(this)">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive, ref, computed } from 'vue'
import $api from '@/api'
import { APPLY_TYPE, APPLY_STATE } from '@/utils/constant.js'
import { alertMessage, formatDate, toTimestamp } from '@/utils/tools.js'
import moment from 'moment'
import { ElMessageBox } from 'element-plus'
export default {
  name: 'leave',
  setup () {
    onMounted(() => {
      getLeaveList()
    })
    const queryForm = reactive({ applyState: '' })
    const applyForm = reactive({ applyType: '', leaveDate: [], leaveTime: '0天', reasons: '' })
    const applyRoles = reactive({
      applyType: [
        {
          required: true,
          message: '请选择休假类型',
          trigger: ['blur', 'change']
        }
      ],
      leaveDate: [
        {
          required: true,
          message: '请选择休假时间',
          trigger: ['blur', 'change']
        }
      ],
      reasons: [
        {
          required: true,
          message: '请填写休假原因',
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
    const operationType = ref('create')
    const isView = computed(() => operationType.value === 'view')
    const viewRow = reactive({})
    const stepFinishStatus = computed(() => {
      if (viewRow.applyState === 3) {
        return 'error'
      } else if (viewRow.applyState === 4) {
        return 'success'
      } else if (viewRow.applyState === 5) {
        return 'finish'
      } else {
        return 'wait'
      }
    })
    const dialogVisible = ref(false)
    const applyList = ref([])
    const getLeaveList = async () => {
      const params = { ...queryForm, ...pager }
      try {
        const { data } = await $api.getLeaveList(params)
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
      getLeaveList()
    }
    const handlePageChanged = (page) => {
      pager.pageNum = page
      getLeaveList()
    }
    const handleReset = ($refs) => {
      $refs && $refs.form && $refs.form.resetFields()
    }
    const handleView = (_this, row) => {
      dialogVisible.value = true
      operationType.value = 'view'
      Object.assign(viewRow, row)
      _this.$nextTick(() => {
        _this.$refs.createApplyForm.resetFields()
        Object.assign(applyForm, row)
        applyForm.leaveDate = [row.startTime, row.endTime]
      })
    }
    const handleQuit = (row) => {
      operationType.value = 'delete'
      ElMessageBox.confirm(
        '确认作废？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        const { msg } = await $api.updateLeaveList({ _id: row._id, action: operationType.value })
        alertMessage.success(msg)
        await getLeaveList()
      }).catch(() => {})
    }
    const leaveDateChanged = (val) => {
      if (Array.isArray(val) && val.length > 1) {
        const days = (toTimestamp(val[1]) - toTimestamp(val[0])) / 1000 / 3600 / 24
        applyForm.leaveTime = `${days + 1}天`
      } else {
        applyForm.leaveTime = '0天'
      }
    }
    const handleSubmitCreate = (_this) => {
      _this.$refs.createApplyForm.validate(async (valid) => {
        if (valid) {
          const params = { ...applyForm, action: operationType.value }
          const { msg } = await $api.updateLeaveList(params)
          dialogVisible.value = false
          alertMessage.success(msg)
          await getLeaveList()
        } else {
          return false
        }
      })
    }
    const handleApplyForLeave = (_this) => {
      dialogVisible.value = true
      operationType.value = 'create'
      _this.$nextTick(() => {
        _this.$refs.createApplyForm.resetFields()
        setTimeout(() => {
          _this.$refs.createApplyForm.clearValidate()
        }, 0)
      })
    }
    return {
      APPLY_STATE,
      APPLY_TYPE,
      queryForm,
      applyList,
      pager,
      columns,
      isView,
      viewRow,
      stepFinishStatus,
      operationType,
      dialogVisible,
      applyForm,
      applyRoles,
      handleSizeChanged,
      handlePageChanged,
      handleReset,
      handleView,
      handleQuit,
      handleApplyForLeave,
      handleSubmitCreate,
      leaveDateChanged
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
