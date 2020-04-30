<template>
  <el-dialog
    title="分配权限"
    :visible.sync="visible"
    width="30%"
    @close="dialogClosed"
    :show="show"
  >
    <!--主体区域-->
    <el-tree
      show-checkbox
      default-expand-all
      node-key="id"
      :data="rightsList"
      :props="treeProps"
      :default-checked-keys="defKeys"
      ref="treeRef"
    ></el-tree>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClosed">取 消</el-button>
      <el-button type="primary" @click="allowRights">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SetRightDialog',
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true
    },
    rightsList: {
      type: Array,
      default: () => [],
      required: true
    },
    defKeys: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      visible: this.show,
      treeProps: {
        label: 'authName',
        children: 'children'
      }
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
      // 当对话框关闭时应该将数组清空
      this.$parent.resetDefKeys()
      // 重新获取页面数据
      this.$parent.getRolesList()
    },
    // 确认分配权限
    async allowRights() {
      // this.$refs.treeRef.getCheckdKeys() 树形结构中全勾选中的选项
      // this.$refs.treeRef.getHalfCheckdKeys() 树形结构中半勾选中的选项
      // 两个方法将范围两个数组,将两个数组合并为一个数组,然后发送更改请求
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 后端需要接收一个以逗号分隔的字符串,使用join(',')转换
      const idStr = keys.join(',')

      // 发送请求
      const { data: res } = await this.$http.post(
        `roles/${this.$parent.roleId}/rights`,
        {
          rids: idStr
        }
      )
      if (res.meta.status !== 200) return this.$message.error('角色授权失败!')
      this.$message.success('角色授权成功!')
      this.dialogClosed()
    }
  }
}
</script>

<style scoped></style>
