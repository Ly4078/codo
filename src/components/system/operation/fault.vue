<template>
  <div class="fault mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="roleName"
          placeholder="输入关键字快速查找"
          @keyup.enter.native="getrole(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="getrole(1)">搜索</el-button>
        <el-button type="primary" @click="addfault">新建故障</el-button>
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
      <el-table-column prop="username" align="center" sortable label="故障名称"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="故障状态"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="故障级别"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="故障责任人"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="开始时间"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="结束时间"></el-table-column>
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
      title="新建故障"
      :visible.sync="DialogVisible"
      :modal-append-to-body="false"
      top="3%"
      width="30%"
      min-width="30%"
      center
    >
      <p class="prompt">
        <i class="el-icon-alarm-clock"></i> 记录一些运维过程中的故障信息，附件我们存储在阿里云OSS.
      </p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="故障名称" prop="name">
          <el-input v-model="ruleForm.name" clearable placeholder="请输入故障名称"></el-input>
        </el-form-item>
        <el-form-item label="故障状态" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择故障状态">
            <el-option v-for="item in statuss" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="故障等级" prop="grade">
          <el-select v-model="ruleForm.grade" placeholder="请选择故障等级">
            <el-option v-for="item in grades" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人员">
          <el-input v-model="ruleForm.personnel" clearable placeholder="请输入处理人员"></el-input>
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="开始时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date3"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker placeholder="选择时间" v-model="ruleForm.date4" style="width: 100%;"></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="故障原因">
          <el-input type="textarea" v-model="ruleForm.reason" maxlength="255" placeholder="简单描述一下吧"></el-input>
        </el-form-item>
        <el-form-item label="故障总结">
          <el-input
            type="textarea"
            v-model="ruleForm.summary"
            maxlength="255"
            placeholder="简单描述一下吧"
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
  name: "fault",
  data() {
    return {
      roleName: "",
      total: 100,
      loading: false,
      DialogVisible: false,
      statuss: [
        {
          id: "001",
          label: "处理中"
        },
        {
          id: "002",
          label: "已关闭"
        }
      ],
      grades: [
        {
          id: "01",
          label: "一级故障"
        },
        {
          id: "02",
          label: "二级故障"
        },
        {
          id: "03",
          label: "三级故障"
        },
        {
          id: "04",
          label: "四级故障"
        },
        {
          id: "05",
          label: "五级故障"
        }
      ],
      ruleForm: {
        name: "",
        status: "",
        grade: "",
        personnel: "",
        date1: "",
        date2: "",
        date3: "",
        date4: "",
        reason: "",
        summary: ""
      },
      rules: {
        name: [{ required: true, message: "请输入故障名称", trigger: "blur" }],
        status: [
          { required: true, message: "请选择故障状态", trigger: "change" }
        ],
        grade: [
          { required: true, message: "请选择故障等级", trigger: "change" }
        ],
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
        date3: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date4: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      },
      userlist: []
    };
  },
  components: {
    Pagein
  },

  methods: {
    addfault() {
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
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message.success("提交成功");
          this.DialogVisible = false;
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
.prompt {
  padding: 10px 0;
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid pink;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

