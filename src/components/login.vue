<template>
  <div class="container">
    <!-- 头像区域 -->
    <div class="avater-box">
      <img src="../assets/images/logo.png" alt="">
    </div>
  <!-- 表单登录区域 -->
  <el-form :model="loginForm" :rules="rules" ref="loginRef">
  <el-form-item prop="username">
    <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
  </el-form-item>
  <el-form-item prop="password">
    <el-input prefix-icon="el-icon-s-goods" v-model="loginForm.password"  @keyup.enter.native="loginJoin" type="password"></el-input>
  </el-form-item>
  <el-form-item class="Btns">
     <el-button type="primary" @click="loginJoin" >登录</el-button>
      <el-button type="info" @click="Reset">重置</el-button>
  </el-form-item>
  </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    Reset () {
      this.$refs.loginRef.resetFields()
    },
    // 登录操作
    loginJoin () {
      this.$refs.loginRef.validate(async (valid, not) => {
        // console.log(valid)
        // console.log(not)// 未通过校验的字段
        if (!valid) return console.log('校验失败')
        const res = await this.$http.post('login', this.loginForm)// axios(baseURL)自动补'/'
        if (res.meta.status !== 200) return this.$message(res.meta.msg)
        this.$message.success(res.meta.msg)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style scoped lang="less">
.container {
width: 450px;
height: 320px;
background-color: #ffffff;
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);

.avater-box{
  width: 130px;
  height: 130px;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  box-shadow: 0px 0px 10px #ffffff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color:#eee;
  }
}
.el-form{
  position: absolute;
  box-sizing: border-box;
  padding: 20px;
  bottom: 0;
  width: 100%;
  .Btns{
    display:flex;
    justify-content:flex-end;
  }
}
}
</style>
