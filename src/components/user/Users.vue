<template>
  <div class="list_container">
    <!--面包屑区域-->
    <Breadcrumb :title="'用户管理'" :sub-title="'用户列表'"></Breadcrumb>

    <!--卡片区域-->
    <el-card>
      <!--搜索与添加-->
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="usersList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#" align="center">
        </el-table-column>
        <el-table-column align="center" prop="username" label="姓名">
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮箱">
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="电话">
        </el-table-column>
        <el-table-column align="center" prop="role_name" label="角色">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="stateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <!--编辑-->
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditorDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!--删除-->
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="removeUserById(scope.row.id)"
                type="danger"
                icon="el-icon-delete"
              ></el-button>
            </el-tooltip>
            <!--分配角色-->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <Pagination
        :pagenum="queryInfo.pagenum"
        :pagesize="queryInfo.pagesize"
        :pagesizes="[1, 2, 5, 10]"
        :total="total"
        @sizeChange="sizeChange"
        @numChange="numChange"
      ></Pagination>
    </el-card>

    <!--添加用户 dialog 弹框-->
    <AddUserDialog :show.sync="addDialogVisible"></AddUserDialog>
    <!--修改用户对话框-->
    <EditDialog
      :show.sync="editDialogVisible"
      :edit-form="editForm"
    ></EditDialog>
    <!--分配角色对话框-->
    <SetRole
      :show.sync="setRoleDialogVisible"
      :userInfo="userInfo"
      :rolesList="rolesList"
    ></SetRole>
  </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import Pagination from '../Pagination'
import AddUserDialog from './AddUserDialog'
import EditDialog from './EditDialog'
import SetRole from './SetRole'
export default {
  name: 'Users',
  components: {
    Breadcrumb,
    Pagination,
    AddUserDialog,
    EditDialog,
    SetRole
  },
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示数据条数
        pagesize: 10
      },
      usersList: [],
      total: 0,
      // 添加用户对话框显示隐藏
      addDialogVisible: false,

      // 修改用户
      editDialogVisible: false,
      editForm: {},
      // 分配角色控制显示隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: []
    }
  },
  methods: {
    // 获取用户列表数据
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表数据失败!')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },

    // 分页
    sizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUsersList()
    },
    numChange(val) {
      this.queryInfo.pagenum = val
      this.getUsersList()
    },

    // 用户状态改变
    async stateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败!')
      }
      this.$message.success('更新用户状态成功!')
    },

    async showEditorDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },

    // 删除用户
    async removeUserById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') return this.$message.info('取消删除!')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败!')
      this.$message.success('删除用户成功!')
      this.getUsersList()
    },

    // 分配角色
    async setRole(info) {
      this.userInfo = info

      //在展示对话框之前获取所有角色数据
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败!')
      this.rolesList = res.data
      // 展示对话框
      this.setRoleDialogVisible = true
    }
  },

  created() {
    this.getUsersList()
  }
}
</script>

<style scoped lang="scss">
.el-card {
  margin-top: 20px;
}
.el-table {
  margin-top: 20px;
}
.el-pagination {
  margin-top: 20px;
}
</style>
