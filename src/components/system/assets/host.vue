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
  </div>
</template>

<script>
import Pagein from "../../public/pagein";
export default {
  name: "ass_host",
  data() {
    return {
      roleName:"",
      total: 0,
      loading:false,
      userlist:[],
      dellist:[]
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
    addhost(){

    },
    //批量添加
    addbatch(){

    },
    //批量删除
    batchdel(){
        if(this.dellist.length){
            
        }else{
            this.$message.error('请先选择要删除的数据');
        }
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
</style>