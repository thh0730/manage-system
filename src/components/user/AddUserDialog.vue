<template>
  <el-dialog
    title="添加用户"
    :visible.sync="visible"
    :show="show"
    width="40%"
    @close="addDiologClosed"
  >
    <!--内容-->
    <span>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
    </span>
    <!--按钮-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDiologClosed">取 消</el-button>
      <el-button @click="addUser" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddUserDialog',
  props: {
    show: {
      type: Boolean,
      default: false
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
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
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
    // 添加用户对话框关闭事件
    addDiologClosed() {
      this.$emit('update:show', false)
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起请求
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('用户添加失败!')
        }
        this.$message.success('用户添加成功!')
        this.$emit('update:show', false)
        this.$parent.getUsersList()
      })
    }
  }
}
</script>

<style scoped></style>
