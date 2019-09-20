<template>
  <div class="mainboss">
    <div class="initform" v-loading="loading" element-loading-text="数据提交中...">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择主机" prop="hosts">
          <el-select v-model="ruleForm.hosts" multiple placeholder="请选择主机">
            <el-option
              v-for="item in hosts"
              :key="item.id+'h'"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="选择地址" prop="ips">
          <el-select v-model="ruleForm.ips" multiple placeholder="请选择地址">
            <el-option v-for="item in ips" :key="item.id+'s'" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="选择脚本" prop="scripts">
          <el-select v-model="ruleForm.scripts" multiple placeholder="请选择脚本">
            <el-option
              v-for="item in scripts"
              :key="item.id+'sc'"
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
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column align="center" prop="hostname" label="主机名称"></el-table-column>
      <el-table-column align="center" prop="playbook_script" label="脚本"></el-table-column>
      <el-table-column align="center" label="详情">
        <template slot-scope="scope">
          <el-button size="small" @click="handle(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="详情"
      :visible.sync="DialogVisible"
      :modal-append-to-body="false"
      top="3%"
      width="50%"
      center
    >{{actobj.result}}</el-dialog>
  </div>
</template>

<script>
export default {
  name: "ass_init",
  data() {
    return {
      loading: false,
      DialogVisible: false,
      actobj: {},
      hosts: [],
      scripts: [],
      _results: [],
      tableData: [],
      ruleForm: {
        hosts: [],
        scripts: [],
        ips: []
      },
      rules: {
        hosts: [{ required: true, message: "请选择主机", trigger: "change" }],
        ips: [{ required: true, message: "请选择地址", trigger: "change" }],
        scripts: [{ required: true, message: "请选择脚本", trigger: "change" }]
      }
    };
  },
  watch:{
    'ruleForm.hosts':{
      handler: function() {
          for(let i in this._results){
            for(let j in this.ruleForm.hosts){
              // console.log(this._results[i],this.ruleForm.hosts[j])
              
              if(this._results[i].name==this.ruleForm.hosts[j].name){
                this.ruleForm.ips.push(this._results[i].ip)
              }
            }
          }
            console.log(this.ruleForm.hosts,this.ruleForm.ip)
         },
    }
  },
  created() {
    this.gethosts_initial();
  },

  methods: {
    gethosts_initial() {
      this.$http.get("hosts_initial/").then(res => {
        this._results = res.data.results;
        for (let i in this._results) {
          let obj1 = {};
          obj1 = {
            id: this._results[i].name,
            label: this._results[i].name
          };
          this.hosts.push(obj1);
        }

        let arr = [],
          _scripts = res.data.results[0].scripts;
        for (let i in _scripts) {
          let obj = {};
          obj.id = _scripts[i];
          obj.label = _scripts[i];
          arr.push(obj);
        }
        this.scripts = arr;
      });
    },
    handle(obj) {
      this.actobj = obj;
      this.DialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$http.post("hosts_initial/", this.ruleForm).then(res => {
            console.log("res:", res);
            if (res.data.status == 0) {
              this.tableData = res.data.results;
              this.ruleForm.hosts = [];
              this.ruleForm.scripts = [];
              this.ruleForm.ips = [];
              this.loading = false;
              this.$message.success("操作成功");
            }
          });
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
  .el-select {
    width: 40%;
  }
}
</style>