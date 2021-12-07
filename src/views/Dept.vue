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
                <el-button type="primary">创建</el-button>
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
      deptList: []
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
    handleEdit (row) {
    },
    handleDelete (row) {
    }
  },
  mounted () {
    this.getDeptList()
  }
}
</script>
<style lang="scss" scoped>
</style>
