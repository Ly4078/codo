<template>
  <div class="wiki mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="roleName"
          placeholder="输入关键字快速查找"
          @keyup.enter.native="getrole(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="getrole(1)">搜索</el-button>
        <el-button type="primary" @click="addarticle">新建文章</el-button>
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
      <el-table-column prop="username" align="center" sortable label="标题"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="作者"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="内容简介"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="发布时间"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="handleview(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >查看</el-button>
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
      :title="isedit?'阅读文章':'编辑文章'"
      :visible.sync="DialogVisible"
      :modal-append-to-body="false"
      top="1%"
      width="70%"
      center
    >
    <div class="editor">
      <QuillEditor :isedit="isedit" :content="content" @submitForm="submitForm" @resetForm="resetForm"></QuillEditor>
    </div>
      
    </el-dialog>
  </div>
</template>

<script>
import Pagein from "../../public/pagein";
import QuillEditor from "../../public/quillEditor";
export default {
  name: "wiki",
  data() {
    return {
      roleName: "",
      article:"12",
      total: 100,
      isedit:false,
      loading: false,
      DialogVisible:false,
      userlist: [],
      content:"",
      content1: `<p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>
      <p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>
      <p></p><p><br></p><ol><li><strong><em>Or drag/paste an image here.</em></strong></li><li><strong><em>rerew</em></strong></li><li><strong><em>rtrete</em></strong></li><li><strong><em>tytrytr</em></strong></li><li><strong><em>uytu</em></strong></li></ol>`
      
    };
  },
  components: {
    Pagein,
    QuillEditor
  },
  mounted(){
    this.content=this.content1;
  },
  methods: {
    //新建文章
    addarticle(){
      this.isedit=false;
      this.DialogVisible=true;
    },
    //提交
    submitForm(val){
      if(val){
        this.$message.success("提交成功!")
        this.DialogVisible=false;
      }else{
        this.$message.error("内容不能为空")
      }
    },
    //重置
    resetForm(){
      this.content=this.content1;
    },
    //表格翻页
    handleCurrentChange(val) {
      console.log("handleCurrentChange", val);
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      console.log("handleSizeChange", val);
    },
    //查看文章
    handleview(obj){
      this.isedit=true;
      this.DialogVisible=true;
    },
    //编辑文章
    handleedit(obj) {
      this.isedit=false;
      this.DialogVisible=true;
    },
    handledel(obj) {},
    //修改用户状态
    changestatus(obj) {}
  }
};
</script>

<style lang="less" scoped>
.el-input {
  width: 50%;
}
.editor{
  width: 100%;
  height: 720px;
  max-height: 720px;
  overflow: hidden;
}
</style>

