
<template>
  <div class="playbook mainboss">
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
 
        <el-form-item label="选择yaml文件" prop="beifen">
          <el-select v-model="ruleForm.beifen" clearable placeholder="请选择yaml文件">
            <el-option label="yaml文件一" value="shanghai"></el-option>
            <el-option label="yaml文件二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注详情" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" clearable></el-input>
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
  name: "playbook",
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
        desc: [{ required: true, message: "请填写备注", trigger: "blur" }],

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
  }
}
</style>