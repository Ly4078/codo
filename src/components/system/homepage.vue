<template>
  <div class="home">
    <el-container justify="center">
      <el-header>
        <div class="title">
          <img src="../../assets/images/jingyu.jpg" alt="管理员头像">
          Devops Manage System
        </div>
        <div class="info">
          <span class="el-dropdown-link">{{this.$store.state.userInfo.trueName}}</span>
          <!-- <span class="command editps" @click="handlepass">修改密码</span> -->
          <span class="command" @click="handleCommand">退出登录</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            background-color="#2f323e"
            active-text-color="#007eff"
            text-color="#fff"
            :unique-opened="true"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu v-for="item in menulist" :key="item.id" :index="item.id">
              <template slot="title" >
                <img :src="item.imgurl" class="menuicon" alt v-if="item.imgurl">
                <span>{{item.name}}</span>
              </template>
              <el-menu-item-group v-if="item.child">
                <el-menu-item
                  v-for="items in item.child"
                  :key="items.id"
                  :index="items.id"
                  @click="handitems(items)"
                >{{items.name}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view v-bind:style="{height: this.$store.state.mainHeight}"></router-view>
            <p>©版权所有-Devops Manage System</p>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
    <el-dialog
      title="修改密码"
      :visible.sync="centerDialogVisible"
      :modal-append-to-body="false"
      width="34%"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item label="请输入新密码" prop="pass1">
          <el-input :type="ispwd1?'password':'text'" v-model="ruleForm.pass1" placeholder="请输入新密码">
            <i
              slot="suffix"
              class="el-input__icon el-icon-view el-input__clear"
              style="cursor:pointer;"
              @click="showpwd(1)"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item label="请再次输入新密码" prop="pass2">
          <el-input
            :type="ispwd2?'password':'text'"
            v-model="ruleForm.pass2"
            placeholder="请再次输入新密码"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-view el-input__clear"
              style="cursor:pointer;"
              @click="showpwd(2)"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>

import _menulist from '../../../static/mock/menulist.json';
export default {
  name: "home",
  data() {
    const validate_password = (rule, value, callback) => {
      const pattern = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/;
      let ermsg =
        "密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位";
      if (this.ruleForm.pass2) {
        if (!value) {
          callback(new Error("请确认你的密码"));
        } else if (!(value === this.ruleForm.pass1)) {
          callback(new Error("两次输入的密码不一致"));
        } else if (!pattern.test(value)) {
          callback(new Error(ermsg));
        } else {
          callback();
        }
      } else {
        if (!value) {
          callback(new Error("密码不能为空"));
        } else if (!pattern.test(value)) {
          callback(new Error(ermsg));
        } else {
          callback();
        }
      }
    };
    const validateComfirmpwd = (rule, value, callback) => {
      if (this.ruleForm.pass1) {
        if (!value) {
          callback(new Error("请确认你的密码"));
        } else if (!(value === this.ruleForm.pass1)) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      } else {
        if (!value) {
          callback(new Error("密码不能为空"));
        } else {
          callback();
        }
      }
    };
    return {
      menu:"../../assets/images/menu.png",
      menulist: [],
      ispwd1: true,
      ispwd2: true,
      visible: true,
      ruleForm: {
        pass1: "",
        pass2: ""
      },
      rules: {
        pass1: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validate_password
          }
        ],
        pass2: [
          {
            required: true,
            trigger: ["blur", "change"],
            validator: validateComfirmpwd
          }
        ]
      },
      centerDialogVisible: false
    };
  },
  watch: {
    centerDialogVisible: function() {
      if (!this.centerDialogVisible) {
        (this.ruleForm.pass1 = ""), (this.ruleForm.pass2 = "");
      }
    }
  },
  mounted(){
    this.menulist=_menulist.data;
  },
  methods: {
  
    handitems(obj) {
      this.$router.push("/" + obj.url);
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    //点击修改密码
    handlepass() {
      this.centerDialogVisible = !this.centerDialogVisible;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.savepwd();
        } else {
          return false;
        }
      });
    },
    showpwd(val) {
      if (val == 1) {
        this.ispwd1 = !this.ispwd1;
      } else if (val == 2) {
        this.ispwd2 = !this.ispwd2;
      }
    },
    //确认修改密码
    savepwd() {
      this.$http.put("password/" + this.ruleForm.pass2).then(res => {
        if (res.status == 200) {
          this.handleCommand();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.centerDialogVisible = !this.centerDialogVisible;
    },
    //退出登录
    handleCommand() {
      this.$http.get("logout").then(res => {
        if (res.status == 200) {
          this.$store.commit("setUserInfo", {});
          this.$store.commit("setshopInfo", {});
          this.$store.commit("setToken", "");
          localStorage.clear();
          this.$router.push({ name: "Login" });
        }
      });
      // this.$router.push({ name: "Login" });
    }
  }
};
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
  section {
    width: 100%;
    height: 100%;
    header {
      width: 100%;
      padding: 0.5% 2%;
      background: #33373b;
      display: flex;
      align-items: center; /*垂直居中*/
      justify-content: space-between; /*两端对齐*/
      font-size: 20px;
      color: #fff;
      .title {
        margin-left: 32px;
      }
      .title img {
        // width: 36px;
        height: 36px;
        border-radius: 50px;

        margin-right: 10px;
      }
      .command {
        margin-left: 20px;
        cursor: pointer;
        color: burlywood;
      }
      .editps {
        color: #409eff;
      }
      & > div {
        display: flex;
        align-items: center; /*垂直居中*/
        justify-content: space-between;
      }
    }
    aside {
      height: 100%;
      // border-right: 2px solid #ebebeb;
      background: #2f323e;
    }
    .menuicon{
      width: 18px;
      height: 18px;
    }
    main {
      background: #dadada;
      padding: 0;
      overflow-y: auto;
      p {
        margin-top: 5px;
      }
    }
  }
  .el-submenu{
    text-align: left;
  }
  // .el-table tbody tr:hover>td { background-color: #0a36b9 }
}
</style>
