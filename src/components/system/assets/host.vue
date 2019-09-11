<template>
  <div class="ass_host mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="roleName"
          placeholder="输入关键字全局搜索"
          @keyup.enter.native="getrole(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="getrole(1)">搜索</el-button>
      </div>
      <div class="topright">
        <el-button type="primary" icon="el-icon-plus" @click="addhost">添加主机</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addbatch">批量添加</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchdel">批量删除</el-button>
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="主机名"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="IP"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="内网IP"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="IDC"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="区域"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="管理用户"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="!scope.row.status"
            @click="handleedit(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            :disabled="!scope.row.status"
            @click="handledel(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
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
      title="添加主机"
      :visible.sync="AddDialogVisible"
      :modal-append-to-body="false"
      top="3%"
      width="30%"
      min-width="30%"
      center
    >
      <p class="prompt">管理用户：用来登陆你的主机获取资产信息，请务必配置！</p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="主机名" prop="host">
          <el-input v-model="ruleForm.host" clearable placeholder="请输入主机名"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="IP">
          <el-input v-model="ruleForm.IP" clearable placeholder="请输入IP地址"></el-input>
        </el-form-item>
        <el-form-item label="公网IP">
          <el-input v-model="ruleForm.publicIp" clearable placeholder="公网IP"></el-input>
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="ruleForm.port" clearable></el-input>
        </el-form-item>
        <el-form-item label="IDC">
          <el-select v-model="ruleForm.IDC" placeholder="请选择IDC机房">
            <el-option v-for="item in IDCs" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="ruleForm.region" clearable placeholder="请输入区域"></el-input>
        </el-form-item>
        <el-form-item label="管理用户" prop="management">
          <el-select v-model="ruleForm.management" placeholder="请选择一个管理用户">
            <el-option
              v-for="item in managements"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="ruleForm.label" placeholder="请选择关联的标签">
            <el-option v-for="item in labels" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" maxlength="255" placeholder="简单描述一下吧"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="批量添加"
      :visible.sync="batchDialogVisible"
      :modal-append-to-body="false"
      top="3%"
      width="30%"
      min-width="30%"
      center
    >
      <p class="prompt">格式: [hostname] [ip] [port] [管理用户] 多台换行分开, 管理用户必须是存在的</p>
      <el-form ref="form" :model="form" label-width="0px">
        <el-form-item label>
          <el-input
            type="textarea"
            :autosize="{ minRows: 14, maxRows: 30}"
            placeholder="ops-hostname 10.0.0.1 22 ec2-user"
            v-model="form.textarea2"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagein from "../../public/pagein";
export default {
  name: "ass_host",
  data() {
    return {
      roleName: "",
      total: 0,
      loading: false,
      AddDialogVisible: false,
      batchDialogVisible: false,
      form: {
        textarea2: ""
      },
      ruleForm: {
        host: "",
        IP: "",
        publicIp: "",
        port: "",
        IDC: "",
        region: "",
        management: "",
        label: "",
        desc: ""
      },
      rules: {
        host: [{ required: true, message: "请输入主机名", trigger: "blur" }],
        IP: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
        management: [
          { required: true, message: "请选择管理用户", trigger: "change" }
        ]
      },
      IDCs: [
        {
          id: "001",
          label: "IDC1"
        },
        {
          id: "002",
          label: "IDC2"
        },
        {
          id: "003",
          label: "IDC3"
        }
      ],
      managements: [
        {
          id: "001",
          label: "管理用户1"
        },
        {
          id: "002",
          label: "管理用户2"
        },
        {
          id: "003",
          label: "管理用户3"
        }
      ],
      labels: [
        {
          id: "001",
          label: "label1"
        },
        {
          id: "002",
          label: "label2"
        },
        {
          id: "003",
          label: "label3"
        }
      ],
      userlist: [],
      dellist: []
    };
  },
  components: {
    Pagein
  },
  methods: {
    //表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //添加主机
    addhost() {
      this.AddDialogVisible = true;
    },
    //批量添加
    addbatch() {
      this.batchDialogVisible = true;
    },
    //批量删除
    batchdel() {
      if (this.dellist.length) {
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    //编辑
    handleedit(obj) {
      this.AddDialogVisible = true;
    },
    //删除
    handledel(obj) {
      console.log("handledel");
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(formName);
          if ((formName == "form" && !this.form.textarea2)) {
            this.$message.error("请输入相关数据");
          } else {
            this.$message.success("提交成功");
            this.AddDialogVisible = false;
            this.batchDialogVisible = false;
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //表格翻页
    handleCurrentChange(val) {
      console.log("handleCurrentChange", val);
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      console.log("handleSizeChange", val);
    }
  }
};
</script>





<style lang="less" scoped>
.topleft {
  .el-input {
    width: 70%;
  }
}
.prompt {
  padding: 10px 0;
  text-align: center;
}
</style>