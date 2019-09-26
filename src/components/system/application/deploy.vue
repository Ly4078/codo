<template>
  <div class="deploy mainboss">
    <div class="initform">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        label-width="130px"
      >
        <el-form-item label="应用">
          <el-input clearable placeholder="java" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择主机" prop="hosts">
          <el-select v-model="ruleForm.hosts" multiple clearable placeholder="请选择主机">
            <el-option
              v-for="item in appDeploy"
              :key="item.id+'appDeploy'"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择playbook" prop="playbooks">
          <el-select v-model="ruleForm.playbooks" multiple clearable placeholder="请选择playbook">
            <el-option
              v-for="item in scripts"
              :key="item.id+'scripts'"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注详情" prop="details">
          <el-input type="textarea" v-model="ruleForm.details"></el-input>
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
  name: "deploy",
  data() {
    return {
      appDeploy: [],
      scripts: [],
      ruleForm: {
        details: "",
        hosts: [],
        playbooks: []
      },
      rules: {
        details: [{ required: true, message: "请填写备注", trigger: "blur" }],
        hosts: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个主机",
            trigger: "change"
          }
        ],
        playbooks: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个playbooks",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    getapp_deploy() {
      this.$http.get("app_deploy/").then(res => {
        console.log("res:", res);
        if (res && res.status == 200) {
          if (res.data.status == 0) {
            this.appDeploy = res.data.results;
            let _scripts = res.data.results[0].scripts,
              arr = [];
            _scripts.forEach(element => {
              let _obj = {
                id: element,
                label: element
              };
              arr.push(_obj);
              console.log("element:", element);
            });
            this.scripts = arr;
            console.log("scripts:", this.scripts);
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("ruleForm:", this.ruleForm);
          let ips = [],
            hosts = [],
            _details = [],
            _parms = {};
          for (let i in this.ruleForm.hosts) {
            for (let j in this.appDeploy) {
              if (this.ruleForm.hosts[i] == this.appDeploy[j].id) {
                ips.push(this.appDeploy[j].ip);
                hosts.push(this.appDeploy[j].name);
              }
            }
          }
          _details = this.ruleForm.details.split(",");
          _parms = {
            ips: ips,
            hosts: hosts,
            details: _details,
            scripts: this.ruleForm.playbooks
          };
          this.$http.post("app_deploy/", _parms).then(res => {
            console.log(res);
            if (res && res.status == 200) {
              if (res.data.status == 2) {
                // this.$message(res.data.msg);
                this.$alert(res.data.msg, {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
                for (let key in this.ruleForm) {
                  this.ruleForm[key] = "";
                }
              }
            }
          });
          console.log("_parms:", _parms);
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
    this.getapp_deploy();
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
.el-select {
  width: 100%;
}
</style>