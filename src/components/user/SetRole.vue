<template>
  <el-dialog
    title="分配角色"
    :visible.sync="visible"
    width="40%"
    :show="show"
    @close="dialogClosed"
  >
    <!--  主体内容 -->
    <div class="p_container">
      <p>当前用户: {{ userInfo.username }}</p>
      <p>当前角色: {{ userInfo.role_name }}</p>
      <p>
        分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClosed">取 消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SetRole',
  data() {
    return {
      visible: this.show,
      // 已选中角色的id值
      selectedRoleId: ''
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    userInfo: {
      type: Object,
      default: () => {},
      required: true
    },
    rolesList: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  methods: {
    dialogClosed() {
      this.$emit('update:show', false)
      this.selectedRoleId = ''
      this.userInfo = {}
    },
    // 点击按钮 分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配角色失败!')
      this.$message.success('角色更新成功!')
      this.dialogClosed()
      this.$parent.getUsersList()
    }
  }
}
</script>

<style scoped lang="scss">
.p_container {
  height: 100%;
  margin-left: 30%;
  p:nth-child(1) {
    margin-bottom: 20px;
  }
  p:nth-child(2) {
    margin-bottom: 20px;
  }
}
</style>
