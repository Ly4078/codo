

<template>
  <div class="yaml mainboss">
    <div class="initform">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        label-width="130px"
      >
        <el-form-item label="选择role" clearable prop="zhuji">
          <el-select v-model="ruleForm.zhuji" clearable placeholder="请选择role">
            <el-option label="role一" value="shanghai"></el-option>
            <el-option label="role二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择标签" prop="beifen">
          <el-select v-model="ruleForm.beifen" clearable placeholder="请选择标签">
            <el-option label="标签一" value="shanghai"></el-option>
            <el-option label="标签二" value="beijing"></el-option>
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
  name: "yaml",
  data() {
    return {
      ruleForm: {
        zhuji: "",
        beifen: ""
      },
      rules: {
        zhuji: [{ required: true, message: "请选择主机", trigger: "change" }],
        beifen: [
          { required: true, message: "请选择配置文件", trigger: "change" }
        ]
      }
    };
  },
  methods: {
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
  }
};
</script>



<style lang="less" scoped>
.initform {
  form {
    text-align: left;
    .el-form-item__label {
      text-align: left;
    }
    .el-input{
        width: 220px;
    }
  }
}
</style>