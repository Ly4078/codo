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
            <el-option label="主机一" value="shanghai"></el-option>
            <el-option label="主机二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择playbook" prop="playbooks">
          <el-select v-model="ruleForm.playbooks" multiple clearable placeholder="请选择playbook">
            <el-option label="配置文件一" value="shanghai"></el-option>
            <el-option label="配置文件二" value="beijing"></el-option>
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
         console.log("res:",res)
        if (res && res.status == 200) {
          if (res.data.status == 0) {
            console.log("res:", res);
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("ruleForm:", this.ruleForm);
          alert("submit!");
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
</style>