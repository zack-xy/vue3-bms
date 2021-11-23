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
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
         <el-button type="primary" @click="handleAdd(1)">新增</el-button>
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
            <el-button @click="handleAdd(2, scope.row)" type="primary" size="mini">新增</el-button>
            <el-button @click="handleEdit(scope.row)" size="mini">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

      <el-dialog
        v-model="dialogVisible"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        title="菜单新增"
        width="40%">
        <el-form :model="menuForm" label-width="80px" ref="createForm" :rules="menuAddRoles">
          <el-form-item label="父级菜单" prop="parentId">
            <el-cascader
              style="width:100%"
              v-model="menuForm.parentId"
              placeholder="请选择"
              :options="menuList"
              :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
              clearable/>
              <span>不选，则直接创建一级菜单</span>
          </el-form-item>
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="menuForm.menuType">
              <el-radio v-for="key in Object.keys(MENU_TYPE)" :label="Number(key)" :key="key">
                {{MENU_TYPE[key]}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" clearable ></el-input>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon" v-show="isMenuRadio">
              <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" clearable ></el-input>
          </el-form-item>
          <el-form-item label="路由地址" prop="path" v-show="isMenuRadio">
              <el-input v-model="menuForm.path" placeholder="请输入路由地址" clearable ></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="permission">
              <el-input v-model="menuForm.permission" placeholder="请输入权限标识" clearable ></el-input>
          </el-form-item>
          <el-form-item label="组件路径" prop="component" v-show="isMenuRadio">
              <el-input v-model="menuForm.component" placeholder="请输入组件路径" clearable ></el-input>
          </el-form-item>
          <el-form-item label="菜单状态" prop="menuState" v-show="isMenuRadio">
            <el-select v-model="menuForm.menuState" placeholder="请选择" clearable style="width:100%">
              <el-option v-for="key in Object.keys(MENU_STATE)" :key="key" :value="Number(key)" :label="MENU_STATE[key]">
              </el-option>
            </el-select>
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
    prop: 'permission'
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
      MENU_TYPE: Object.freeze(MENU_TYPE),
      columns: Object.freeze(columns),
      queryForm: {
        menuState: '',
        menuName: ''
      },
      menuList: [],
      dialogVisible: false,
      menuForm: {
        parentId: '',
        menuType: 1,
        menuState: 1,
        menuName: '',
        icon: '',
        path: '',
        permission: '',
        component: ''
      },
      menuAddRoles: {
        menuName: [
          {
            required: true,
            message: '请输入菜单名',
            trigger: ['blur']
          },
          {
            min: 2,
            max: 10,
            message: '长度在2-10个字符',
            trigger: 'blur'
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
      this.getMenuList()
    },
    handleReset (form) {
      this.$nextTick(() => {
        this.$refs[form].resetFields()
      })
    },
    handleAdd (type, row) {
      this.action = 'add'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.createForm.resetFields()
        if (type === 2) {
          this.menuForm.parentId = [...row.parentId, row._id].filter(item => item)
        }
      })
    },
    handleEdit (row) {
      this.action = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.menuForm = { ...row }
      })
    },
    async handleDelete (row) {
      const { msg } = await this.$api.menuSubmit({ _id: row._id, action: 'delete' })
      alertMessage.success(msg)
      this.getMenuList()
    },
    async getMenuList () {
      try {
        const { data } = await this.$api.getMenuList(this.queryForm)
        this.menuList = data
      } catch (error) {
        alertMessage.error(error)
        throw new Error(error)
      }
    },
    handleSubmit () {
      this.$refs.createForm.validate(async (valid) => {
        if (valid) {
          const params = { ...this.menuForm, action: this.action }
          const { msg } = await this.$api.menuSubmit(params)
          alertMessage.success(msg)
          this.dialogVisible = false
          this.handleReset('createForm')
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
    this.getMenuList()
  }
}
</script>

<style lang="scss" scoped>

</style>
