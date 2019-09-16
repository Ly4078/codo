<template>
  <div class="ass_host mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="search"
          placeholder="输入主机名搜索"
          @keyup.enter.native="gethostlist(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="gethostlist(1)">搜索</el-button>
      </div>
      <div class="topright">
        <el-button type="primary" icon="el-icon-plus" @click="addhost">添加主机</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addbatch">批量添加</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="batchdel">批量删除</el-button>
      </div>
    </div>
    <el-table
      :data="hostlist"
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
      <el-table-column prop="name" align="center" sortable label="主机名"></el-table-column>
      <el-table-column prop="ip" align="center" sortable label="IP"></el-table-column>
      <el-table-column prop="in_ip" align="center" sortable label="内网IP"></el-table-column>
      <el-table-column prop="idc_name" align="center" sortable label="IDC"></el-table-column>
      <el-table-column prop="user_name" align="center" sortable label="管理用户"></el-table-column>
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
      <el-table-column fixed="right" label="操作" align="center" width="200">
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
      :sizes="sizes"
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
        <el-form-item label="主机名" prop="name">
          <el-input v-model="ruleForm.name" clearable placeholder="请输入主机名"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="IP">
          <el-input v-model="ruleForm.IP" clearable placeholder="请输入IP地址"></el-input>
        </el-form-item>
        <el-form-item label="公网IP">
          <el-input v-model="ruleForm.publicIp" clearable placeholder="公网IP"></el-input>
        </el-form-item>
        <el-form-item label="IDC">
          <el-select v-model="ruleForm.IDC" placeholder="请选择IDC机房">
            <el-option v-for="item in IDCs" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管理用户" prop="management">
          <el-select v-model="ruleForm.management" placeholder="请选择一个管理用户" @focus="getuserlist">
            <el-option
              v-for="item in userlist"
              :key="item.user_id"
              :label="item.username"
              :value="item.user_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="ruleForm.label" placeholder="请选择关联的标签"  @focus="gettaglist">
            <el-option v-for="item in taglist" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
      search: "",
      total: 0,
      page: 1,
      max_page: 3,
      loading: false,
      AddDialogVisible: false,
      batchDialogVisible: false,
      form: {
        textarea2: ""
      },
      actObj: {},
      sizes: [3, 4, 5],
      ruleForm: {
        name: "",
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
        name: [{ required: true, message: "请输入主机名", trigger: "blur" }],
        IP: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
        management: [
          { required: true, message: "请选择管理用户", trigger: "change" }
        ]
      },
      taglist:[],
      userlist: [],
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
      hostlist: [],
      multipleSelection: []
    };
  },
  components: {
    Pagein
  },
  methods: {
    gethostlist(val) {
      if (val == 1) {
        this.page = 1;
      }
      let _Url = "host/?page=" + this.page + "&max_page=" + this.max_page;
      this.loading = true;
      if (this.search) {
        _Url += "&search=" + this.search;
      }
      this.$http.get(_Url).then(res => {
        this.loading = false;
        this.total = res.data.data.count;
        this.hostlist = res.data.data.results;
      });
    },
    //表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val;

      console.log("this.multipleSelection:", this.multipleSelection);
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
      if (this.multipleSelection.length) {
        // console.log("multipleSelection:",this.multipleSelection)
        this.deletedata(1);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    //获取用户列表
    getuserlist() {
      if (!this.userlist.length) {
        this.$http.get("user/").then(res => {
          console.log(res);
          if (res && res.status == 200) {
            if (res.data.status == 0) {
              this.userlist = res.data.data;
              console.log("userlist:",this.userlist)
            }
          }
        });
      }
    },
    //获取标签列表
    gettaglist(){
      if(!this.taglist.length){
        this.$http.get("tag/").then(res => {
          console.log(res);
          if (res && res.status == 200) {
            if (res.data.status == 0) {
              this.taglist = res.data.data;
              console.log("taglist:",this.taglist)
            }
          }
        });
      }
    },
    //修改用户状态
    changestatus(obj) {
      let _status = obj.status ? 1 : 0;
      let _parms = {
        status: _status
      };
      this.$http.patch("host/" + obj.id + "/", _parms).then(res => {
        if (res && res.status == 200) {
          if (res.data.status == 0) {
            this.$message.success("修改成功");
          }
        }
      });
    },
    //编辑
    handleedit(obj) {
      this.AddDialogVisible = true;
    },
    //单个删除
    handledel(obj) {
      this.actObj = obj;
      this.deletedata(2);
    },
    //删除数据
    deletedata(val) {
      let arrid = [],
        _Url = "host/",
        _parms = {};
      if (val == 1) {
        //批量删除
        for (let i in this.multipleSelection) {
          arrid.push(this.multipleSelection[i].id);
        }
      } else if (val == 2) {
        //单个删除
        arrid.push(this.actObj.id);
      }
      _parms = {
        pk: arrid
      };

      this.$http.delete(_Url, { data: _parms }).then(res => {
        if (res && res.status == 200) {
          if (res.data.status == 0) {
            this.$message.success("删除成功");
            this.gethostlist();
          }
        }
      });
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(formName);
          if (formName == "form" && !this.form.textarea2) {
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
      this.page = val;
      this.gethostlist();
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      console.log("handleSizeChange", val);
      this.max_page = val;
      this.gethostlist();
    }
  },
  created() {
    this.gethostlist();
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