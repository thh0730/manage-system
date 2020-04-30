<template>
  <div class="roles_container">
    <!--面包屑区域-->
    <Breadcrumb title="权限管理" sub-title="角色列表"></Breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <!--添加用户按钮-->
      <el-row>
        <el-col>
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!--表格区域-->
      <el-table :data="rolesList" style="width: 100%" border stripe lazy>
        <!--  展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(scope.row, item1.id)"
                  closable
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                      closable
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--索引列-->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button
            ><el-button type="danger" icon="el-icon-delete">删除</el-button
            ><el-button
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--分配权限对话框-->
    <SetRightDialog
      :rightsList="rightsList"
      :show.sync="setRightDialogVisible"
      :defKeys="defKeys"
    ></SetRightDialog>
  </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb'
import SetRightDialog from './SetRightDialog'
export default {
  name: 'Roles',
  components: {
    Breadcrumb,
    SetRightDialog
  },
  data() {
    return {
      // 所有角色数据
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 保存三级权限id
      defKeys: [],
      // 当前即将分配角色的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200)
        return this.$message.error('获取角色列表失败!')
      this.rolesList = res.data
    },

    // 删除权限
    async removeRightById(role, rightId) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.info('取消删除!')

      // 确认删除
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除指定权限失败!')
      }
      // this.getRolesList()
      // 重新获取数据列表影响操作, 因为接口返回的是最新数据, 可以直接赋值修改数据
      role.children = res.data
    },

    // 分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败!')
      this.rightsList = res.data

      //  点击分配权限时 递归获取所有三级权限的id
      this.getLeafKeys(role, this.defKeys)

      this.setRightDialogVisible = true
    },

    // 递归获取角色下所有三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      //  如果当前node节点没有children树形,则是三级权限
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果不是则继续调用本体
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },

    // 当对话框关闭时应清空defKeys数组
    resetDefKeys() {
      this.defKeys = []
    }
  }
}
</script>

<style scoped lang="scss">
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eeeeee;
}
.bdbottom {
  border-bottom: 1px solid #eeeeee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
