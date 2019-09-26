<template>
  <div class="release mainboss">
    <div class="initform">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        label-width="130px"
      >
        <el-form-item label="主机IP">
          <el-input clearable v-model="ruleForm.ips" disabled></el-input>
        </el-form-item>
        <el-form-item label="主机名称">
          <el-input clearable v-model="ruleForm.hosts" disabled></el-input>
        </el-form-item>
        <el-form-item label="脚本">
          <el-input clearable v-model="ruleForm.scripts" disabled></el-input>
        </el-form-item>
        <el-form-item label="分支">
          <el-input clearable v-model="ruleForm.branch" disabled></el-input>
        </el-form-item>
        <el-form-item label="仓库名称" prop="hosts">
          <el-select v-model="ruleForm.depot" clearable placeholder="请选择仓库名称">
            <el-option
              v-for="item in app_maven"
              :key="item.id+'maven'"
              :label="item.repo_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库地址">
          <el-input clearable v-model="ruleForm.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="tag">
          <el-select v-model="ruleForm.tag" clearable placeholder="请选择tag" @focus="focustag">
            <el-option
              v-for="item in tags"
              :key="item.id+'tag'"
              :label="item.repo_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "release",
  data() {
    return {
      app_maven: [],
      tags: [],
      ruleForm: {
        ips: '["127.0.0.1"]',
        module: "script",
        hosts: '["tomcat-node1902"]',
        address: "",
        branch: "master",
        scripts: "/root/scripts/maven_java.sh",
        tag: "",
        depot: "",
        details: ""
      },
      rules: {
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        zhuji: [{ required: true, message: "请选择主机", trigger: "change" }],
        leixin: [{ required: true, message: "请选择应用", trigger: "change" }],
        beifen: [
          { required: true, message: "请选择配置文件", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写备注", trigger: "blur" }],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    "ruleForm.depot": {
      handler: function() {
        console.log("ruleForm.depot:", this.ruleForm.depot);
        this.gettags(this.ruleForm.depot);
      }
    }
  },
  methods: {
    gettags(val) {
      for (let i in this.app_maven) {
        if (val == this.app_maven[i].id) {
          this.ruleForm.address = this.app_maven[i].repo_url;
          let _tags = this.app_maven[i].tag,
            tagarr = [];
          for (let j in _tags) {
            let _obj = {
              id: _tags[j],
              label: _tags[j]
            };
            tagarr.push(_obj);
          }
          this.tags = tagarr;
        }
      }
    },
    focustag() {
      if (!typeof(this.ruleForm.depot)==='Number') {
        this.$message.error("请先选择仓库名称");
      } else if (!this.tags.length) {
        this.$message.error("该仓库下没有tag");
      }
    },
    getapp_maven() {
      this.$http.get("app_maven/").then(res => {
        if (res && res.status == 200) {
          if (res.data.status == 0) {
            this.app_maven = res.data.results;
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _parms = {
            ips: ["127.0.0.1"],
            module: "script",
            hosts: ["tomcat-node1902"],
            details: ["java_demo v6版本打包"],
            scripts:
              "[" +
              this.ruleForm.scripts +
              " " +
              this.ruleForm.depot +
              " " +
              this.ruleForm.branch +
              " " +
              this.ruleForm.tag +
              "]"
          };
          console.log("_parms:", _parms);
          this.$http.post("app_maven/", _parms).then(res => {
            if (res && res.status == 200) {
              if (res.data.status == 2) {
                // this.$message(res.data.msg);
                this.$alert(res.data.msg, {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.ruleForm.depot = "";
                    this.ruleForm.then = "";
                    this.ruleForm.address = "";
                    this.tags = [];
                  }
                });
              }
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.getapp_maven();
  }
};
</script>



<style lang="less" scoped>
.initform {
  //   width: 450px;
  form {
    text-align: left;
    .el-form-item__label {
      text-align: left;
    }
  }
}
</style>