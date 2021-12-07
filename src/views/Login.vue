<template>
  <div class="container">
    <el-form :model="loginForm" label-width="80px" class="login-box">
      <el-form-item label='用户名'>
        <el-input v-model="loginForm.username"/>
      </el-form-item>
      <el-form-item label='密码'>
        <el-input v-model="loginForm.password"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" style="margin: 0">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import network from "@/network";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    handleSubmit() {
      network({
        method: "POST",
        url: "/login",
        params: {
          username: this.loginForm.username,
          password: this.loginForm.password
        }
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('登录成功!');
          this.$store.commit('login', {
            username: res.data.username,
            role: res.data.authorities[0].authority
          });
          this.$router.push('/main/uploadVideo');
        } else {
          this.$message.error(res.msg);
        }
      })
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-box {
  border: 1px solid #DCDFE6;
  padding: 35px 35px 35px 35px;
  border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}
</style>