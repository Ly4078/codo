
<template>
  <div class="git mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="roleName"
          placeholder="输入关键字快速查找"
          @keyup.enter.native="getgitlist(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="getgitlist(1)">搜索</el-button>
      </div>
      <div class="topright">
        <el-button type="primary" icon="el-icon-plus" @click="getdel">批量删除</el-button>

        <el-button type="primary" icon="el-icon-plus" @click="addgit">新建仓库</el-button>
      </div>
    </div>
    <el-table
      :data="gitlist"
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
      <el-table-column prop="project_name" align="center" label="项目名称"></el-table-column>
      <el-table-column prop="project_url" align="center" label="项目地址"></el-table-column>
      <el-table-column prop="get_username" align="center" label="用户"></el-table-column>
      <el-table-column prop="get_type" align="center" label="仓库类型"></el-table-column>
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
      :sizes="sizes"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></Pagein>

    <el-dialog
      :title="ruleForm.id?'编辑仓库':'新建仓库'"
      :visible.sync="AddDialogVisible"
      :modal-append-to-body="false"
      v-loading="loading"
      element-loading-text="数据提交中..."
      width="50%"
      center
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- <el-form-item label="用户" prop="user">
          <el-input v-model="ruleForm.user" clearable placeholder="请输入用户" disabled></el-input>
        </el-form-item>-->
        <el-form-item label="user" prop="user">
          <el-select v-model="ruleForm.user" placeholder="请选择用户">
            <el-option
              v-for="item in user_repo.id_user"
              :key="item.id+'user'"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="project_name">
          <el-input v-model="ruleForm.project_name" clearable placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label=" 项目地址" prop="project_url">
          <el-input v-model="ruleForm.project_url" clearable placeholder="请输入 项目地址"></el-input>
        </el-form-item>
        <!-- <el-form-item label="仓库类型" prop="repo_type">
          <el-input v-model="ruleForm.repo_type" clearable placeholder="请输入仓库类型"></el-input>
        </el-form-item>-->
        <el-form-item label="repo_type" prop="repo_type">
          <el-select v-model="ruleForm.repo_type" placeholder="请选择IDC机房">
            <el-option
              v-for="item in user_repo.type_choice"
              :key="item.id+'repo'"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
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
  name: "git",
  data() {
    return {
      roleName: "",
      page: 1,
      page_size: 3,
      sizes: [3, 4, 5],
      total: 100,
      loading: false,
      AddDialogVisible: false,
      ruleForm: {
        project_name: "",
        project_url: "",
        user: "",
        repo_type: ""
      },
      user_repo: [],
      rules: {
        user: [
          { required: true, message: "请选择管理用户", trigger: "change" }
        ],
        project_name: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        project_url: [
          { required: true, message: "请输入项目地址", trigger: "blur" }
        ],
        repo_type: [
          { required: true, message: "请选择管理用户", trigger: "change" }
        ]
      },
      gitlist: [],
      multipleSelection: []
    };
  },
  components: {
    Pagein
  },
  watch: {
    AddDialogVisible: function() {
      if (!this.AddDialogVisible) {
        for (let key in this.ruleForm) {
          this.ruleForm[key] = "";
          delete this.ruleForm.id;
        }
      }
    }
  },
  methods: {
    getuserrepo() {
      this.$http.get("user_repo/").then(res => {
        let _data = res.data.results;
        for (let i in _data.id_user) {
          _data.id_user[i].id = Number(_data.id_user[i].id);
        }
        for (let i in _data.type_choice) {
          _data.type_choice[i].id = Number(_data.type_choice[i][0]);
          _data.type_choice[i].label = _data.type_choice[i][1];
        }
        this.user_repo = _data;
        this.getgitlist();
      });
    },
    //新建仓库
    addgit() {
      this.AddDialogVisible = !this.AddDialogVisible;
    },
    //查询列表数据
    getgitlist(val) {
      if (val == 1) {
        this.page = 1;
      }
      let _Url = "repo/?page=" + this.page + "&page_size=" + this.page_size;
      this.$http.get(_Url).then(res => {
        this.total = res.data.results.count;
        this.gitlist = res.data.results.results;
      });
    },
    //表格翻页
    handleCurrentChange(val) {
      this.page = val;
      this.getgitlist();
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      this.page_size = val;
      this.getgitlist();
    },
    //表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //编辑
    handleedit(obj) {
      this.AddDialogVisible = true;
      obj.repo_type = obj.get_type;
      for (let key in this.ruleForm) {
        for (let keys in obj) {
          if (key == keys) {
            this.ruleForm[key] = obj[keys];
          }
        }
      }
      delete this.ruleForm.get_type;
      this.ruleForm.user = obj.get_username;
      this.ruleForm.id = obj.id;
    },
    //删除
    handledel(obj) {
      this.actObj = obj;
      this.deletedata(2);
    },
    getdel() {
      if (this.multipleSelection.length) {
        this.deletedata(1);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },
    //删除数据
    deletedata(val) {
      let arrid = [],
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

      this.$confirm("是否确定删除数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete("repo/", { data: _parms }).then(res => {
            if (res && res.status == 200) {
              if (res.data.status == 0) {
                this.$message.success("删除成功");
                this.getgitlist();
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.id) {
            this.editgit();
          } else {
            this.newgit();
          }
        }
      });
    },
    //新建
    newgit() {
      this.$http.post("repo/", this.ruleForm).then(res => {
        if (res && res.status == 200) {
          if (res.data.status == 0) {
            this.$message.success("新建成功");
            this.AddDialogVisible = false;
            this.getgitlist();
          } else {
            this.$message.error(res.data.msg);
          }
        }
      });
    },
    //编辑
    editgit() {
      let _parms = {};
      _parms.id = this.ruleForm.id;
      _parms.project_name = this.ruleForm.project_name;
      _parms.project_url = this.ruleForm.project_url;
      _parms.get_username = this.ruleForm.user;
      _parms.get_type = this.ruleForm.repo_type;
      this.$http.patch("repo/" + this.ruleForm.id + "/", _parms).then(res => {
        if (res && res.status == 200) {
          if (res.data.status == 0) {
            this.$message.success("修改成功");
            this.AddDialogVisible = false;
            this.getgitlist();
          } else {
            this.$message.error(res.data.msg);
          }
        }
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    this.getuserrepo();
  }
};
</script>

<style lang="less" scoped>
.martop {
  .el-input {
    width: 70%;
  }
}
</style>

