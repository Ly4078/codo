<template>
  <div class="user_list mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="term.name"
          placeholder="请输入用户名"
          @keyup.enter.native="getuserlist(1)"
          clearable
        ></el-input>
        <el-input
          v-model="term.trueName"
          placeholder="请输入姓名"
          @keyup.enter.native="getuserlist(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="getuserlist(1)">搜索</el-button>
      </div>
      <div class="topright">
        <el-button type="primary" icon="el-icon-plus" @click="openDialog(1)">创建帐户</el-button>
      </div>
    </div>

    <el-table
      :data="userlist"
      :height="this.$store.state.tableHeight"
      resizable
      border
      style="width: 100%"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.5)"
      element-loading-text="数据正在加载中"
    >
      <el-table-column prop="username" align="center" label="用户名"></el-table-column>
      <el-table-column prop="trueName" align="center" label="真实姓名"></el-table-column>
      <el-table-column align="center" label="所在城市">
        <template slot-scope="scope">{{scope.row.cityId | fitercityId}}</template>
      </el-table-column>
      <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column align="center" label="当前状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @change="changestatus(scope.row)"
            active-text
            inactive-text
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="350px">
        <template slot-scope="scope">
          <el-button
            :disabled="!scope.row.status"
            @click="handleedit(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            :disabled="!scope.row.status"
            @click="handledeploy(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-service"
          >分配角色</el-button>
          <el-button
            :disabled="!scope.row.status"
            @click="handlereset(scope.row)"
            type="danger"
            size="mini"
            icon="el-icon-setting"
          >重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span class="pagein">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="10"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </span>
    <!-- 84 -->
    <el-dialog
      v-if="AddDialogVisible"
      title="创建帐户"
      :visible.sync="AddDialogVisible"
      :modal-append-to-body="false"
      width="50%"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        v-show="disval==1 || disval==2"
      >
        <el-form-item label="账号名称">
          <el-input v-model="ruleForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="账户手机" prop="mobile">
          <el-input v-model="ruleForm.mobile" maxlength="11" clearable></el-input>
        </el-form-item>
        <el-form-item label="账户密码" prop="password">
          <el-input v-model="ruleForm.password" maxlength="255" clearable></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" placeholder="验证码">
            <el-button slot="append" @click="handlecode" :disabled="num>0?true:false">
              获取验证码
              <i v-show="num">({{num}}s)</i>
            </el-button>
          </el-input>
          <!-- <el-input v-model="ruleForm.code" maxlength="255" clearable></!-->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认保存</el-button>
          <el-button @click="resetForm('ruleForm')">表单重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
var resultsCode = "";
const checkPhone = (rule, value, callback) => {
  const mailReg = /^1[3456789]\d{9}$/;
  if (!value) {
    return callback(new Error("账户手机号码不能为空"));
  }
  setTimeout(() => {
    if (mailReg.test(value)) {
      callback();
    } else {
      callback(new Error("账户手机号码错误"));
    }
  }, 100);
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

export default {
  name: "perlist",
  data() {
    return {
      timer: null,
      num: 0,
      total: 0,
      disval: 1,
      pageNum: 1,
      pageSize: 10,
      term: {
        trueName: "",
        name: ""
      },

      loading: false,
      AddDialogVisible: false,
      actuserobj: {},
      ruleForm: {
        username: "",
        password: "",
        mobile: "",
        code: ""
      },
      rules: {
        mobile: [{ required: true, validator: checkPhone, trigger: "blur" }],
        password: [
          { required: true, message: "请输入账户密码", trigger: "blur" },
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/,
            message:
              "密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位"
          }
        ],
        code: [{ required: true, validator: checkCode, trigger: "blur" }]
      },
      userlist: []
    };
  },
  filters: {},
  watch: {
    AddDialogVisible: function() {
      if (!this.AddDialogVisible) {
        for (let key in this.ruleForm) {
          this.ruleForm[key] = "";
        }
        this.actuserobj = {};
      }
    },
    "ruleForm.mobile": {
      handler: function() {
        clearInterval(this.timer);
        this.num = 0;
      }
    }
  },
  methods: {
    //获取验证码
    handlecode() {
      const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/;
      if (this.ruleForm.mobile) {
        if (reg.test(this.ruleForm.mobile)) {
          this.$http
            .post("mobiles/", {
              mobile: this.ruleForm.mobile
            })
            .then(res => {
              resultsCode = "";
              if (res.data.status == 0) {
                this.$message.error("该手机号已注册");
                this.ruleForm.mobile = "";
              } else {
                this.getsms();
              }
            });
        }
      } else {
        this.$message.error("请输入手机号");
      }
    },
    //获取验证码
    getsms() {
      const _this=this;
      this.$http
        .post("sms/", {
          mobile: this.ruleForm.mobile
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
    //获取列表数据
    getuserlist(val) {
      if (val == 1) {
        this.pageNum = 1;
      }
    },
    //表格翻页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getuserlist();
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getuserlist();
    },
    //打开编辑弹框
    openDialog(val) {
      this.disval = val;
      if (val == 1) {
        this.AddDialogVisible = true;
      }
    },
    //点击编辑某条数据
    handleedit(obj) {
      this.getidinfo(obj.id);
      this.openDialog(2);
      this.actuserobj = obj;
    },
    //分配角色
    handledeploy(obj) {
      this.openDialog(3);
      this.actuserobj = obj;
    },

    //通过ID查询某个数据信息
    getidinfo(id) {
      this.$http.get("user/" + id).then(res => {
        let obj = { ...res.data };
        obj.remark = obj.remark ? obj.remark : "";
        obj.areaId = obj.areaId ? String(obj.areaId) : "";
        for (let key in obj) {
          this.ruleForm[key] = obj[key];
        }
      });
    },
    //修改用户状态
    changestatus(obj) {
      let _Url = "user/status",
        _parms = {
          status: "",
          id: obj.id
        };
      if (obj.status) {
        _parms.status = 1;
      } else {
        _parms.status = 0;
      }
      this.$http.put(_Url, _parms).then(res => {
        if (res.status == 200) {
          this.$message.success("修改成功");
        }
      });
    },
    //保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.savedata();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置
    resetForm(formName) {
      if (this.actuserobj && this.actuserobj.id) {
        this.getidinfo(this.actuserobj.id);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    //保存编辑
    savedata() {
      let _parms = {};
      for (let key in this.ruleForm) {
        if (this.ruleForm[key]) {
          _parms[key] = this.ruleForm[key];
        }
      }
      this.$http.post("register/", _parms).then(res => {
        if (res.status == 200) {
          this.$message.success("保存成功");
          this.AddDialogVisible = !this.AddDialogVisible;
          this.getuserlist();
        }
      });
    }
  },
  created() {
    // this.getuserlist();
  }
};
</script>
<style lang="less">
.user_list {
  .topleft {
    .el-input {
      width: 40%;
    }
  }
  .diaul {
    width: 70%;
    padding-left: 15%;
    li {
      margin: 5px;
    }
    button {
      margin: 20px auto;
    }
  }
}
</style>
