<template>
  <div class="timing_list mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="roleName"
          placeholder="输入关键字快速查找"
          @keyup.enter.native="getrole(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="getrole(1)">搜索</el-button>
        <el-button type="primary" @click="adddata">新建</el-button>
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
      <el-table-column prop="username" align="center" sortable label="job id"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="可执行命令"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="定时器（秒分时日月周）"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="下一次执行时间"></el-table-column>
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
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleedit(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>

          <el-button
            @click="handledel(scope.row)"
            type="danger"
            size="mini"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagein
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></Pagein>

    <el-dialog
      title="新建任务"
      :visible.sync="DialogVisible"
      :modal-append-to-body="false"
      top="3%"
      width="30%"
      min-width="30%"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="job id" prop="job">
          <el-input v-model="ruleForm.job" clearable placeholder="请输入定时任务ID，建议使用有意义的英文命名，名且不要更改"></el-input>
        </el-form-item>
        <el-form-item label="可执行命令" prop="order">
          <el-input v-model="ruleForm.order" clearable placeholder="请输入要执行的命令，必须为可执行，注意环境变量"></el-input>
        </el-form-item>
        <el-form-item label="任务定时器" prop="timer">
          <el-input
            v-model="ruleForm.timer"
            clearable
            placeholder="定时器，参考linux crontab，（秒 分 时 日 月 周）"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagein from "../../public/pagein";
export default {
  name: "timing_list",
  data() {
    return {
      roleName: "",
      total: 100,
      loading: false,
      DialogVisible: false,
      ruleForm: {
        job: "",
        order: "",
        timer: ""
      },
      rules: {
        job: [{ required: true, message: "job id不能为空", trigger: "blur" }],
        order: [
          { required: true, message: "可执行命令不能为空", trigger: "blur" }
        ],
        timer: [
          { required: true, message: "任务定时器不能为空", trigger: "blur" }
        ]
      },
      userlist: []
    };
  },
  components: {
    Pagein
  },

  methods: {
    //新建任务
    adddata() {
      this.DialogVisible = true;
    },
    //表格翻页
    handleCurrentChange(val) {
      console.log("handleCurrentChange", val);
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      console.log("handleSizeChange", val);
    },
    handleedit(obj) {},
    handledel(obj) {},
    //修改用户状态
    changestatus(obj) {},
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.DialogVisible = false;
          this.$message.success("提交成功");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.el-input {
  width: 50%;
}
</style>

