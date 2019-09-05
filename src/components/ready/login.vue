<template>
  <div class="login">
    <img class="loginbj" src="../../assets/images/login_bj.jpg" alt />
    <div class="login_box">
      <div class="box-title">用户登录</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0"
        class="demo-ruleForm"
      >
        <el-form-item label prop="username">
          <el-input
            v-model.number="ruleForm.username"
            maxlength="11"
            :autofocus="true"
            placeholder="用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label prop="password">
          <el-input
            v-model="ruleForm.password"
            maxlength="32"
            placeholder="登录密码"
            show-password
            type="password"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
const validusername = (rule, value, callback) => {
  const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};

import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    handtoken() {
      this.$store.commit("setToken", this.msg);
    },
    //点击登陆，校验表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //登录
    login() {
      let _Url = "login";
      let _parms = {
        username: this.ruleForm.username,
        password: this.ruleForm.password
      };
      this.fullScreen();
      this.$router.push({ path: "/Home", params: {} });
      return;
      this.$http.post(_Url, _parms).then(res => {
        if (res.status == 200) {
          this.fullScreen();
          this.$store.commit("setUserInfo", res.data);
          this.$router.push({ path: "/Home", params: {} });
        } else {
          this.$message({
            message: res.response.data,
            duration: 5000,
            showClose: true,
            type: "error"
          });
        }
      });
    },
    //页面全屏展示
    fullScreen() {
      if (
        (document.fullScreenElement !== undefined &&
          document.fullScreenElement === null) ||
        (document.msFullscreenElement !== undefined &&
          document.msFullscreenElement === null) ||
        (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
        (document.webkitIsFullScreen !== undefined &&
          !document.webkitIsFullScreen)
      ) {
        if (document.documentElement.requestFullScreen) {
          document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
          document.documentElement.webkitRequestFullScreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      }
    }
  }
};
</script>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  font-family: "微软雅黑";
  .logo_icon {
    position: fixed;
    top: 30px;
    left: 40px;
  }
  .loginbj {
    position: absolute;
    z-index: -1;
  }
  .legend {
    color: #fff;
    font-size: 16px;
    text-align: left;
    position: relative;
    left: -270px;
    top: -40px;
    p {
      margin: 7px 0;
    }
    p:nth-child(1) {
      font-size: 30px;
      margin-bottom: 24px;
    }
  }
  .el-button--primary {
    width: 100%;
  }
  .login_box {
    width: 538px;
    height: 246px;
    padding: 30px;
    background: #fff;
    position: relative;
    left: 280px;
    top: -120px;
    border: 1px solid rgba(230, 230, 230, 1);
    .box-title {
      width: 100%;
      text-align: left;
      font-size: 16px;
      color: #111;
      margin-bottom: 17px;
    }
    .el-input__inner {
      color: #409eff;
    }
    .el-form-item__label {
      color: #fff;
    }
    .el-button--primary {
      color: #fff;
      background-color: #0099cc;
      border-color: #0099cc;
    }
  }
  .loginbut {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 7%;
    display: flex;
    align-items: center;
    text-align: left;
    width: 100%;
    background: #383d41;
    a {
      margin-right: 25px;
      font-size: 16px;
      color: #fff;
      text-decoration: none;
    }
    a:nth-child(1) {
      margin-left: 5%;
    }
  }
}
</style>
