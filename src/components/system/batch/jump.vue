
<template>
  <div class="jump mainboss">
    <div class="initform">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        label-width="130px"
      >
        <el-form-item label="选择主机" clearable prop="zhuji">
          <el-select v-model="ruleForm.zhuji" clearable placeholder="请选择主机">
            <el-option label="主机一" value="shanghai"></el-option>
            <el-option label="主机二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
 
        <el-form-item label="选择用户" prop="beifen">
          <el-select v-model="ruleForm.beifen" clearable placeholder="请选择用户">
            <el-option label="用户一" value="shanghai"></el-option>
            <el-option label="用户二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="输入密码" prop="desc">
          <el-input placeholder="请输入密码" v-model="ruleForm.desc" show-password></el-input>
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
  name: "jump",
  data() {
    return {
      ruleForm: {
        zhuji: "",
        beifen: "",
        desc: ""
      },
      rules: {

        zhuji: [{ required: true, message: "请选择主机", trigger: "change" }],
        beifen: [
          { required: true, message: "请选择配置文件", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写密码", trigger: "blur" }],

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
  //   width: 450px;
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