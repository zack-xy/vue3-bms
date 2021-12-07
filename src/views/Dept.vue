<template>
    <div class="dept-manage">
        <div class="query-form">
            <el-form :inline="true" :model="queryForm" ref="form">
                <el-form-item>
                    <el-input placeholder="请输入部门名称" v-model="queryForm.deptName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="hanldeOpenCreate">创建</el-button>
            </div>
            <el-table :data="deptList"
                row-key="_id"
                border
                stripe
                tree-props="{children:'children'}">
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
                        <el-button @click="handleDelete(scope.row)" size="mini">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
          v-model="dialogVisible"
          center
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :title="dialogTitle"
          width="40%">
          <el-form ref="dialogForm" :model="deptForm" :rules="deptFormRules" label-width="90px">
            <el-form-item label="上级部门" prop="parentId">
              <el-cascader style="width:100%" placeholder="请选择上级部门"
                v-model="deptForm.parentId"
                :options="deptList"
                :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
                :show-all-levels="true"
                clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item label="部门名称" prop="deptName">
              <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="user">
              <el-select class="full-width" placeholder="请选择部门负责人" v-model="deptForm.user" filterable>
                <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="`${item.userId}/${item.userName}/${item.userEmail}`"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人邮箱" prop="userEmail">
              <el-input placeholder="请输入负责人邮箱" v-model="deptForm.userEmail" disabled></el-input>
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
export default {
  name: 'dept',
  data () {
    return {
      queryForm: {
        deptName: ''
      },
      columns: Object.freeze([
        {
          label: '部门名称',
          prop: 'deptName'
        },
        {
          label: '负责人',
          prop: 'userName'
        },
        {
          label: '更新时间',
          prop: 'updateTime'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ]),
      deptList: [],
      action: '',
      dialogVisible: false,
      deptForm: {
        parentId: [],
        deptName: '',
        user: ''
      },
      deptFormRules: {
        parentId: [
          {
            required: true,
            message: '请选择上级部门',
            trigger: ['change', 'blur']
          }
        ]
      },
      userList: []
    }
  },
  computed: {
    dialogTitle () {
      return this.action === 'add' ? '创建部门' : '编辑部门'
    }
  },
  methods: {
    handleSearch () {
      this.getDeptList()
    },
    handleReset (form) {
      this.$nextTick(() => {
        this.$refs[form].resetFields()
      })
    },
    async getDeptList () {
      const params = { ...this.queryForm }
      const { data } = await this.$api.getDeptList(params)
      this.deptList = data
    },
    async getAllUserList () {
      const { data } = await this.$api.getAllUserList()
      this.userList = data
    },
    handleEdit (row) {
      this.action = 'edit'
      this.dialogVisible = true
    },
    handleDelete (row) {
      this.action = 'delete'
      this.dialogVisible = true
    },
    hanldeOpenCreate () {
      this.action = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields()
      })
    },
    handleSubmit () {}
  },
  mounted () {
    this.getDeptList()
    this.getAllUserList()
  }
}
</script>
<style lang="scss" scoped>
.full-width {
  width: 100%;
}
</style>
