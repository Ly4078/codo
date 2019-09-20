<template>
  <div class="ass_host mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="search"
          placeholder="输入标签名搜索"
          @keyup.enter.native="gethostlist(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="gethostlist(1)">搜索</el-button>
      </div>
      <div class="topright">
        <el-button type="primary" icon="el-icon-plus" @click="addhost">添加标签</el-button>
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
      <el-table-column prop="name" align="center" label="标签名"></el-table-column>
      <el-table-column align="center" label="主机名称">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.tag_hosts" :key="index">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="host_count" align="center" sortable label="主机个数"></el-table-column>

      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleedit(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button @click="handledel(scope.row)" type="primary" size="mini" icon="el-icon-edit">删除</el-button>
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
      :title="ruleForm.id?'编辑标签':'添加标签'"
      :visible.sync="AddDialogVisible"
      :modal-append-to-body="false"
      v-loading="loading"
      element-loading-text="数据提交中..."
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
        <el-form-item label="标签名" prop="name">
          <el-input v-model="ruleForm.name" clearable placeholder="请输入标签名"></el-input>
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
      v-loading="loading"
      element-loading-text="数据提交中..."
      width="50%"
      center
    >
      <p class="prompt">格式: [name] 多条数据用分号(;)分开</p>
      <el-form ref="form" :model="form" label-width="0px">
        <el-form-item label>
          <el-input
            type="textarea"
            :autosize="{ minRows: 14, maxRows: 30}"
            placeholder="[name]"
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
var isValidIP = (rule, value, callback) => {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  if (!value) {
    return callback(new Error("IP地址不能为空"));
  }
  setTimeout(() => {
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("IP地址格式错误"));
    }
  }, 100);
};
import Pagein from "../../public/pagein";
export default {
  name: "ass_host",
  data() {
    return {
      search: "",
      total: 0,
      page: 1,
      page_size: 3,
      loading: false,
      DialogVisible: false,
      AddDialogVisible: false,
      batchDialogVisible: false,
      form: {
        textarea2: ""
      },
      actObj: {},
      sizes: [3, 5, 10],
      ruleForm: {
        name: ""
      },
      rules: {
        name: [{ required: true, message: "请输入标签名", trigger: "blur" }]
      },
      objarr: [],
      taglist: [],
      hostlist: [],
      multipleSelection: []
    };
  },
  components: {
    Pagein
  },
  watch: {
    AddDialogVisible: function() {
      if (!this.AddDialogVisible) {
        this.ruleForm.name = "";
      }
    },
    batchDialogVisible: function() {
      if (!this.batchDialogVisible) {
        this.form.textarea2 = "";
        this.objarr = [];
      }
    }
  },
  methods: {
    //获取列表数据
    gethostlist(val) {
      if (val == 1) {
        this.page = 1;
      }
      let _Url = "tag/?page=" + this.page + "&page_size=" + this.page_size;
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
        this.deletedata(1);
      } else {
        this.$message.error("请先选择要删除的数据");
      }
    },

    //修改用户状态
    changestatus(obj) {
      let _status = obj.status ? 1 : 0;
      let _parms = {
        status: _status
      };
      this.$http.patch("tag/" + obj.id + "/", _parms).then(res => {
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
      for (let key in this.ruleForm) {
        for (let keys in obj) {
          if (key == keys) {
            this.ruleForm[key] = obj[keys];
          }
        }
      }
      this.ruleForm.id = obj.id;
    },
    //单个删除
    handledel(obj) {
      this.actObj = obj;
      this.deletedata(2);
    },
    //删除数据
    deletedata(val) {
      let arrid = [],
        _Url = "tag/",
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
          this.$http.delete(_Url, { data: _parms }).then(res => {
            if (res && res.status == 200) {
              if (res.data.status == 0) {
                this.$message.success("删除成功");
                this.gethostlist();
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
          if (formName == "form") {
            if (this.form.textarea2) {
              let _tx = this.form.textarea2;
              let arr = _tx.split(";");
              for (let i in arr) {
                let obj = {},
                  arr2 = arr[i].split(" ");
                for (let j in arr2) {
                  arr2[j] = arr2[j].replace(/(^\[*)|(\]*$)/g, "");
                  obj.name = arr2[0] ? arr2[0] : "";
                }
                this.objarr.push(obj);
              }
              for (let k in this.objarr) {
                if (!this.objarr[k].name) {
                  this.objarr.splice(k, 1);
                }
              }
              this.savedata(2);
            } else {
              this.$message.error("请输入相关数据");
            }
          } else {
            if (this.ruleForm.id) {
              this.$http
                .patch("tag/" + this.ruleForm.id + "/", this.ruleForm)
                .then(res => {
                  if (res && res.status == 200) {
                    if (res.data.status == 0) {
                      this.gethostlist();
                      this.$message.success("修改成功");
                      this.AddDialogVisible = false;
                    }
                  }
                });
            } else {
              this.savedata(1);
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    savedata(val) {
      let arr = [];
      if (val == 1) {
        arr.push(this.ruleForm);
      } else if (val == 2) {
        arr = this.objarr;
      }
      this.loading = true;
      this.$http.post("tag/", arr).then(res => {
        this.loading = false;
        this.$message.success("提交成功");
        this.AddDialogVisible = false;
        this.batchDialogVisible = false;
        this.gethostlist(1);
      });
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (formName == "form") {
        this.form.textarea2 = "";
      }
    },
    //表格翻页
    handleCurrentChange(val) {
      this.page = val;
      this.gethostlist();
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      this.page_size = val;
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
.el-dialog__body {
  .el-row {
    padding: 7px 0;
  }
}
.el-tag {
  margin: 0 3px;
}
</style>