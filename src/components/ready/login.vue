<template>
  <div class="login">
    <img class="loginbj" src="../../assets/images/login_bj.jpg" alt />
    <div class="login_box">
      <div class="box-title">
        <el-button
          size="mini"
          v-for="item of topbuts"
          :key="item.id"
          :type="acttopid==item.id?'primary':''"
          @click="handletpbus(item.id)"
        >{{item.label}}</el-button>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0"
        class="demo-ruleForm"
      >
        <el-form-item label prop="username" v-if="acttopid==1">
          <el-input
            v-model.number="ruleForm.username"
            :autofocus="true"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label prop="mobile" v-if="acttopid==2">
          <el-input v-model.number="ruleForm.mobile" maxlength="11" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label prop="password" v-if="acttopid==1">
          <el-input
            v-model="ruleForm.password"
            maxlength="32"
            placeholder="请输入登录密码"
            show-password
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label prop="code">
          <el-input
            v-model="ruleForm.code"
            placeholder="验证码"
            @keyup.enter.native="submitForm('ruleForm')"
          >
            <el-button slot="append" @click="handlecode" :disabled="num>0?true:false">
              获取验证码
              <i v-show="num">({{num}}s)</i>
            </el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="loginbutton"
            type="primary"
            @click="submitForm('ruleForm')"
          >{{this.acttopid == 3?'注册':'登录'}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
var resultsCode = "";
const checkPhone = (rule, value, callback) => {
  const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
  if (!value) {
    callback(new Error("请输入电话号码"));
  } else if (!reg.test(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};

const checkCode = (rule, value, callback) => {
  const mailReg = /^1[3456789]\d{9}$/;
  if (!value) {
    return callback(new Error("请输入验证码"));
  }
  setTimeout(() => {
    if (value == resultsCode) {
      callback();
    } else {
      callback(new Error("验证码错误"));
    }
  }, 100);
};
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      topbuts: [
        {
          id: 1,
          label: "账号密码登录"
        },
        {
          id: 2,
          label: "手机号登录"
        }
      ],
      timer: null,
      num: 0,
      acttopid: 1,
      ruleForm: {
        username: "",
        password: "",
        mobile: "",
        code: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, validator: checkCode, trigger: "blur" }]
      }
    };
  },
  watch: {
    "ruleForm.mobile": {
      handler: function() {
        clearInterval(_this.timer);
        _this.num = 0;
      }
    }
  },
  methods: {
    handletpbus(val) {
      this.acttopid = val;
      for (let key in this.ruleForm) {
        this.ruleForm[key] = "";
      }
    },
    //获取验证码
    handlecode() {
      const _this = this;
      if (this.acttopid == 1) {
        this.$http.get("login/").then(res => {
          if (res.data.status === 0) {
            resultsCode = res.data.results.code;
            this.$notify({
              title: "提示",
              message: "验证码:" + res.data.results.code,
              duration: 0
            });
            let num = 60;
            this.timer = setInterval(() => {
              num > 0 ? num-- : clearInterval(_this.timer);
              _this.num = num;
            }, 1000);
            // this.ruleForm.code = res.data.results.code;
          }
        });
      } else if (this.acttopid == 2) {
        const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
        if (this.ruleForm.mobile) {
          if (reg.test(this.ruleForm.mobile)) {
            this.$http
              .post("mobiles/", {
                mobile: this.ruleForm.mobile.toString()
              })
              .then(res => {
                if (res.data.status == 0) {
                  this.getsms();
                } else {
                  this.$message.error("该手机号未注册，请联系管理员注册");
                }
              });
          }
        } else {
          this.$message.error("请输入手机号");
        }
      }
    },
    //获取验证码
    getsms() {
      this.$http
        .post("sms/", {
          mobile: this.ruleForm.mobile.toString()
        })
        .then(res => {
          resultsCode = res.data.results.code;
          let num = 60;
          this.timer = setInterval(() => {
            num > 0 ? num-- : clearInterval(_this.timer);
            _this.num = num;
          }, 1000);
          console.log("resultsCode111:", resultsCode);
          console.log("sms:", res);
        });
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
      let _Url = "",
        _parms = {};
      if (this.acttopid == 1) {
        _Url = "login/";
      } else {
        _Url = "mobile/";
      }
      for (let key in this.ruleForm) {
        if (this.ruleForm[key]) {
          _parms[key] = this.ruleForm[key].toString();
        }
      }
      this.$http.post(_Url, _parms).then(res => {
        if (res.data.status == 0) {
          this.$store.commit("setToken", res.data.results.token);
          // this.fullScreen();
          this.$store.commit("setUserInfo", res.data);
          this.$router.push({ path: "/Home", params: {} });
        } else {
          this.$message({
            message: res.data.msg,
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
  .loginbutton {
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
