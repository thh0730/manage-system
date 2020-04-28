<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../assets/images/yonghu.png" alt="" />
      </div>
      <!--表单-->
      <el-form
        :rules="rules"
        :model="loginForm"
        ref="loginFormRef"
        class="login_form"
      >
        <!--用户名-->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!--按钮-->
        <el-form-item class="btns">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    submit() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('登陆失败, 账号或密码错误!')
        }
        this.$message.success('登录成功!')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login_container {
  height: 100%;
  background: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eeeeee;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #fff;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .login_form {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
</style>
