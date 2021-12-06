<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
         <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="roleList" border>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :min-width="item.minWidth ? item.minWidth: 100">
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
            <el-button @click="handleSetPermission(scope.row)" size="mini">设置权限</el-button>
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
        title="角色新增"
        width="40%">
        <el-form :model="roleForm" label-width="80px" ref="createForm" :rules="roleAddRoles">
          <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" clearable ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
              <el-input v-model="roleForm.remark" type="textarea" :rows="5" placeholder="请输入备注" clearable ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible=false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
  </div>
</template>
<script>
import { alertMessage, formatDate } from '@/utils/tools.js'
import { ElMessageBox } from 'element-plus'
const columns = [
  {
    label: '角色名称',
    prop: 'roleName',
    minWidth: 180
  },
  {
    label: '备注',
    prop: 'remark'
  },
  {
    label: '权限列表',
    prop: 'menuType'
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter: (row, column, cellValue, index) => {
      return formatDate(new Date(cellValue))
    }
  }
]
export default {
  name: 'role',
  data () {
    return {
      columns: Object.freeze(columns),
      queryForm: {
        roleName: ''
      },
      roleList: [],
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      dialogVisible: false,
      roleForm: {
        roleName: ''
      },
      roleAddRoles: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: ['blur']
          }
        ]
      },
      action: 'add'
    }
  },
  computed: {
    isMenuRadio () {
      return this.menuForm.menuType === 1
    }
  },
  methods: {
    handleQuery () {
      this.getRoleList()
    },
    handleReset (form) {
      this.$nextTick(() => {
        this.$refs[form].resetFields()
      })
    },
    handleAdd () {
      this.action = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.createForm.resetFields()
      })
    },
    handleEdit (row) {
      this.action = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.roleForm = { ...row }
      })
    },
    async handleDelete (row) {
      ElMessageBox.confirm(
        '确认删除？',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        const { msg } = await this.$api.roleOperate({ _id: row._id, action: 'delete' })
        alertMessage.success(msg)
        this.getRoleList()
      }).catch(() => {})
    },
    handleSetPermission (row) {

    },
    async getRoleList () {
      try {
        const params = { ...this.queryForm, ...this.pager }
        const { data } = await this.$api.getRoleList(params)
        const { list, page } = data
        this.roleList = list
        this.pager.total = page.total
      } catch (error) {
        alertMessage.error(error)
        throw new Error(error)
      }
    },
    handleSizeChanged (size) {
      this.pager.pageNum = 1
      this.pager.pageSize = size
      this.getRoleList()
    },
    handlePageChanged (page) {
      this.pagerpager.pageNum = page
      this.getRoleList()
    },
    handleSubmit () {
      this.$refs.createForm.validate(async (valid) => {
        if (valid) {
          const params = { ...this.roleForm, action: this.action }
          const { msg } = await this.$api.roleOperate(params)
          alertMessage.success(msg)
          this.dialogVisible = false
          this.handleReset('createForm')
          this.getRoleList()
        } else {
          return false
        }
      })
    },
    handleClose () {
      this.$nextTick(() => {
        this.handleReset('createForm')
      })
      this.dialogVisible = false
    }
  },
  mounted () {
    this.getRoleList()
  }
}
</script>
<style lang="scss" scoped>
</style>
