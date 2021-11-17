<template>
  <div class="menu-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item prop="menuName" label="菜单名称">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="menuState" label="菜单状态">
          <el-select v-model="queryForm.menuState" placeholder="请选择" clearable>
            <el-option v-for="key in Object.keys(MENU_STATE)" :key="key" :value="key" :label="MENU_STATE[key]">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
         <el-button type="primary">新增</el-button>
         <el-button type="danger">批量删除</el-button>
      </div>
      <el-table :data="menuList"
        row-key="_id" border
        tree-props="{children:'children'}"
        >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :min-width="item.minWidth ? item.minWidth: 100">
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button @click="handleAdd(scope.row)" size="mini">新增</el-button>
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { MENU_STATE, MENU_TYPE } from '@/utils/constant.js'
import { alertMessage, formatDate } from '@/utils/tools.js'
const columns = [
  {
    label: '菜单名称',
    prop: 'menuName',
    minWidth: 180
  },
  {
    label: '图标',
    prop: 'icon'
  },
  {
    label: '菜单类型',
    prop: 'menuType',
    formatter: (row, column, cellValue, index) => {
      return MENU_TYPE[cellValue]
    }
  },
  {
    label: '权限标识',
    prop: 'menuCode'
  },
  {
    label: '路由地址',
    prop: 'path'
  },
  {
    label: '组件路径',
    prop: 'component'
  },
  {
    label: '菜单状态',
    prop: 'menuState',
    formatter: (row, column, cellValue, index) => {
      return MENU_STATE[cellValue]
    }
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
  name: 'menu',
  data () {
    return {
      MENU_STATE: Object.freeze(MENU_STATE),
      columns: Object.freeze(columns),
      queryForm: {
        menuName: '',
        menuState: ''
      },
      menuList: []
    }
  },
  methods: {
    handleQuery () {

    },
    handleReset () {

    },
    handleAdd () {

    },
    handleEdit () {

    },
    handleDelete () {},
    async getMenuList () {
      try {
        const { data } = await this.$api.getMenuList(this.queryForm)
        this.menuList = data
      } catch (error) {
        alertMessage.error(error)
        throw new Error(error)
      }
    }
  },
  mounted () {
    this.getMenuList()
  }
}
</script>

<style lang="scss" scoped>

</style>
