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
        <el-form-item label="选择主机" clearable prop="zhuji">
          <el-select v-model="ruleForm.zhuji" clearable placeholder="请选择主机">
            <el-option label="主机一" value="shanghai"></el-option>
            <el-option label="主机二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择应用" clearable prop="leixin">
          <el-select v-model="ruleForm.leixin" clearable placeholder="请选择应用">
            <el-option label="应用一" value="shanghai"></el-option>
            <el-option label="应用二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-col :span="5">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="0.7">-----</el-col>
          <el-col :span="5">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
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
  name: "release",
  data() {
    return {
      ruleForm: {
        date1: "",
        date2: "",
        zhuji: "",
        leixin: "",
        beifen: "",
        type: [],
        desc: ""
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