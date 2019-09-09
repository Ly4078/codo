<template>
  <div class="mainboss">
    <div class="initform">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择主机" prop="date1">
          <el-select v-model="ruleForm.date1" placeholder="请选择主机">
            <el-option label="主机一" value="shanghai"></el-option>
            <el-option label="主机二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择脚本" prop="date2">
          <el-select v-model="ruleForm.date2" placeholder="请选择脚本">
            <el-option label="脚本一" value="shanghai"></el-option>
            <el-option label="脚本二" value="beijing"></el-option>
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
  name: "ass_init",
  data() {
    return {
      ruleForm: {
        date1: "",
        date2: ""
      },
      rules: {
        date1: [{ required: true, message: "请选择主机", trigger: "change" }],
        date2: [{ required: true, message: "请选择脚本", trigger: "change" }]
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
  }
}
</style>