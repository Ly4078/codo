<template>
  <div class="backups mainboss">
    <div class="initform">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
        label-width="130px"
      >
        <el-form-item label="选择主机" prop="date1">
          <el-select v-model="ruleForm.date1" placeholder="请选择主机">
            <el-option label="主机一" value="shanghai"></el-option>
            <el-option label="主机二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择数据库类型" prop="leixin">
          <el-select v-model="ruleForm.leixin" placeholder="请选择数据库类型">
            <el-option label="数据库类型一" value="shanghai"></el-option>
            <el-option label="数据库类型二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择表" prop="type">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="表一" name="type0"></el-checkbox>
            <el-checkbox label="表二" name="type1"></el-checkbox>
            <el-checkbox label="表三" name="type2"></el-checkbox>
            <el-checkbox label="表四" name="type3"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="选择备份类型" prop="beifen">
          <el-select v-model="ruleForm.beifen" placeholder="请选择备份类型">
            <el-option label="备份类型一" value="shanghai"></el-option>
            <el-option label="备份类型二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
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
        date2: "",
        leixin: "",
        beifen: "",
        type: [],
        desc: ""
      },
      rules: {
        date1: [{ required: true, message: "请选择主机", trigger: "change" }],
        leixin: [
          { required: true, message: "请选择数据库类型", trigger: "change" }
        ],
        beifen: [
          { required: true, message: "请选择备份类型", trigger: "change" }
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