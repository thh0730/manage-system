<template>
  <el-dialog
    title="修改用户"
    :visible.sync="visible"
    width="50%"
    :show="show"
    @close="editDialogClosed"
  >
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      label-width="100px"
    >
      <el-form-item label="用户名">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogClosed">取 消</el-button>
      <el-button type="primary" @click="submitEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    editForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 自定义验证规则
    let checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    let checkPhone = (rule, value, callback) => {
      const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regPhone.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      visible: this.show,
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    show() {
      this.visible = this.show
    }
  },
  methods: {
    editDialogClosed() {
      this.$emit('update:show', false)
      this.$refs.editFormRef.resetFields()
    },
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户资料失败')
        }
        this.$emit('update:show', false)
        this.$parent.getUsersList()
        this.$message.success('更新用户资料成功!')
      })
    }
  }
}
</script>

<style scoped></style>
