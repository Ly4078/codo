<template>
  <div class="task_list mainboss">
    <el-table
      :data="userlist"
      :height="this.$store.state.tableHeight2"
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
      <el-table-column prop="trueName" align="center" sortable label="提交时间"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="执行时间"></el-table-column>
      <el-table-column prop="trueName" align="center" sortable label="发起人"></el-table-column>
      <el-table-column prop="username" align="center" sortable label="执行主机"></el-table-column>
      <el-table-column fixed="right" label="日志" align="center">
        <template slot-scope="scope">
          <el-button
            :disabled="!scope.row.status"
            @click="handlelog(scope.row)"
            type="primary"
            size="mini"
            icon="el-icon-edit"
          >查看</el-button>
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
  name: "task_list",
  data() {
    return {
      total: 100,
      loading:false,
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
    },
    handlelog(obj){
        console.log(obj)
    }
  }
};
</script>
