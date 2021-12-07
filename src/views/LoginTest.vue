<template>
  <div class="root">
    <header>
      <nav class="container">
        <a href="http://jwzx.cqupt.edu.cn/">
          <img src="../../public/logo.jpg" alt="">
        </a>
        <p>欢迎登陆</p>
      </nav>
    </header>
    <canvas id="head_canvas_default" style="display: none"></canvas>
    <div class="loginwarp container">
      <div class="loginbox">
        <div class="boxhd">
          <br>
          <h1>请登录你的账号</h1>
          <br>
          <hr>
        </div>
        <div class="boxbd">
          <div class="logintext clearfix">
            <label for="usernameInput" class="label">
              账号
            </label>
            <input id="usernameInput" class="loginId" type="text"
                   value placeholder="请输入账户" v-model="username">
            <svg class="icon tanhao1" aria-hidden="true">
              <use xlink:href="#icon-tanhao"></use>
            </svg>
            <h2 class="wrongWayId">用户名不能为空</h2>
          </div>
          <div class="passwordtext clearfix">
            <label for="passwordInput" class="label">密码</label>
            <label for="passwordInput">
              <svg class="icon eye" aria-hidden="true">
                <use xlink:href="#icon-eye2"></use>
              </svg>
            </label>
            <input id="passwordInput" class="password" type="password" value placeholder="请输入密码" v-model="password">
            <svg class="icon tanhao2" aria-hidden="true">
              <use xlink:href="#icon-tanhao"></use>
            </svg>
            <h2 class="wrongWayPassword">密码不能为空</h2>
          </div>

          <div class="forgetbox clearfix">
            <!-- 忘记密码链接 -->
            <a class="forget" href="#">忘记密码</a>
          </div>
          <button class="in" @click="handleLoginClicked">登 录</button>
        </div>
        <br>
        <hr>
        <div class="boxfooter">
          <!-- 注册链接 -->
          <a class="register" href="#">立即注册</a>
        </div>
      </div>
    </div>
    <footer>
      <div class="informationbox container">
        <!--        <a href="#">回到主页</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;-->
        <!--        <a href="#">关于本站</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;-->
        <!--        <a href="#">English site</a>-->
        <p>Copyright © 2021-2021 图灵TURING.com 版权所有</p>
      </div>
    </footer>
  </div>
</template>


<script>
import network from "@/network";

require("../../public/iconfont")

export default {
  name: "LoginTest",
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLoginClicked() {
      if (!this.username.length || !this.password.length) return;
      network({
        method: "POST",
        url: "/login",
        params: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('登录成功!');
          this.$store.commit('login', {
            username: res.data.username,
            role: res.data.authorities[0].authority,
            waterMark: this.textToImg(res.data.username, res.data.username.length * 12 * 10, 14 * 10)
          });

          this.$router.push('/main/uploadVideo');
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    textToImg(name, width, height) {
      const fsize = 120;
      const fontWeight = "bold";
      const canvas = document.getElementById("head_canvas_default");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.fillStyle = 'transparent';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#66CCFF";
      context.font = fontWeight + " " + fsize + "px Arial";
      context.textAlign = "center";
      context.textBaseline = "top";
      context.fillText(name, width / 2, 0);
      return canvas.toDataURL("image/png");
    }
  },
  mounted() {
    let eye = document.querySelector('.eye');
    let passwordText = document.querySelector('.password');
    let loginText = document.querySelector('.loginId');
    let wrongWayId = document.querySelector('.wrongWayId');
    let wrongWayPassword = document.querySelector('.wrongWayPassword');
    let tanhao1 = document.querySelector('.tanhao1');
    let tanhao2 = document.querySelector('.tanhao2');

    eye.onclick = function () {
      if (passwordText.type === 'password') {
        passwordText.type = 'text';
        eye.title = '遮住密码'
        eye.querySelector('use').setAttribute('xlink:href', '#icon-eye1');
      } else {
        passwordText.type = 'password';
        eye.querySelector('use').setAttribute('xlink:href', '#icon-eye2');
        eye.title = '显示密码';
      }
    }


    passwordText.onfocus = function () {
      this.setAttribute('placeholder', '');
    }
    passwordText.onblur = function () {
      if (passwordText.value.length === 0) {
        wrongWayPassword.style.visibility = 'visible';
        tanhao2.style.visibility = 'visible';
      } else {
        wrongWayPassword.style.visibility = 'hidden';
        tanhao2.style.visibility = 'hidden';
      }
    }
    loginText.onfocus = function () {
      this.setAttribute('placeholder', '');
    }
    loginText.onblur = function () {
      if (loginText.value.length === 0) {
        wrongWayId.style.visibility = 'visible';
        tanhao1.style.visibility = 'visible';
      } else {
        wrongWayId.style.visibility = 'hidden';
        tanhao1.style.visibility = 'hidden';
      }
    }
  }
}
</script>

<style scoped>
.root {
  height: 100vh;
  overflow: hidden;
}

* {
  padding: 0;
  margin: 0;
}

ul {
  list-style: none;
}

.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}

a {
  color: #050505;
  text-decoration: none;

}

input {
  border: 0;
  box-sizing: border-box;
}

input::-webkit-input-placeholder {
  color: #ccc;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 20px;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

body {
  background-color: #fff;
}

header {
  height: 110px;
  background-color: #f3f5f7;
  position: relative;
}

header a {
  margin-top: 25px;
  float: left;
}

header a img {
  float: left;
}

header p {
  margin-left: 40px;
  margin-top: 25px;
  float: left;
  font-size: 30px;
  text-align: center;
  line-height: 60px;
}

.loginwarp {
  margin-top: 20px;
  height: 500px;
  background-size: cover;
  background: url(../../public/bgc.jpg) no-repeat center;
  position: relative;
}

.loginbox {
  width: 350px;
  height: 400px;
  background-color: rgba(0, 0, 0, .38);
  position: absolute;
  right: 0;
  top: 30px;
}

.boxhd {
  width: 350px;
  margin-bottom: 32px;
}

.boxhd h1 {
  line-height: 30px;
  font-size: 30px;
  margin: 10px;
  text-align: center;
  display: block;
  color: #f3f5f7;
}

.boxbd {
  height: 200px;
  width: 350px;
}

.logintext {
  width: 300px;
  margin: 0 auto;
}

.passwordtext {
  width: 300px;
  margin: 0 auto;
}

.logintext label {
  margin-top: 20px;
  text-align: center;
  line-height: 30px;
  float: left;
  margin-right: 12px;
  font-weight: 500;
  font-size: 20px;
  color: #f3f5f7;
}

.passwordtext .label {
  margin-top: 0;
  position: relative;
  text-align: center;
  line-height: 30px;
  float: left;
  margin-right: 12px;
  font-weight: 500;
  font-size: 20px;
  color: #f3f5f7;
}

.boxbd .wrongWayId,
.boxbd .wrongWayPassword {
  height: 28px;
  float: left;
  font-size: 18px;
  margin-left: 10px;
  font-weight: normal;
  color: #f3f5f7;
  visibility: hidden;
}

.boxbd .tanhao1,
.boxbd .tanhao2 {
  float: left;
  margin-left: 50px;
  height: 26px;
  color: #f3f5f7;
  font-weight: 200;
  visibility: hidden;
}

.boxbd input {
  height: 30px;
  font-size: 20px;
  width: 240px;
  border: 0;
  float: left;
  outline: none;
  background-color: rgba(0, 0, 0, .3);
  color: #ccc;
}

.boxbd .loginId {
  margin-top: 20px;
}

.passwordtext label {
  position: absolute;
  float: right;
  margin-top: 6px;
}

.passwordtext label svg {
  position: relative;
  left: 216px;
  cursor: pointer
}

.boxbd .forgetbox {
  width: 350px;
}

.boxbd .forget {
  display: block;
  margin-right: 40px;
  float: right;
  margin-bottom: 18px;
}

.boxbd .forget:hover {
  color: #fff;
  text-decoration: underline;
}

.boxbd .in {
  margin: 0 auto;
  display: block;
  width: 175px;
  height: 28px;
  border: 1px solid #000;
  text-align: center;
  line-height: 28px;
  background-color: #f3f5f7;
  border-radius: 14px;
}

.boxbd .in:hover {
  background-color: #ccc;
}

.boxfooter {
  position: relative;
}

.boxfooter .register {
  position: absolute;
  right: 20px;
  top: 14px;
}

.boxfooter .register:hover {
  color: #fff;
  text-decoration: underline;
}

footer {
  margin-top: 15px;
  height: 90px;
  background-color: #f3f5f7;
  position: relative;
}

footer .informationbox {
  width: 500px;
  height: 5px;
  position: absolute;
  top: 10px;
  left: 50%;
  margin-left: -250px;
  text-align: center;
}

footer a:hover {
  text-decoration: underline;
}
</style>