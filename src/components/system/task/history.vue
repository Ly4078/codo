<template>
  <div class="task_history mainboss">
    <div class="martop">
      <div class="topleft">
        <el-input
          v-model="roleName"
          placeholder="输入关键字快速查找"
          @keyup.enter.native="getrole(1)"
          clearable
        ></el-input>
        <el-button type="primary" @click="getrole(1)">搜索</el-button>
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
      <el-table-column prop="username" align="center" sortable label="ID"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="任务名称"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="状态"></el-table-column>
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
  name: "task_history",
  data() {
    return {
      roleName: "",
      total: 100,
      loading: false,
      userlist: []
    };
  },
  components: {
    Pagein
  },
  methods: {
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
.el-input {
  width: 70%;
}
</style>

