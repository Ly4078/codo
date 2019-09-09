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
        <el-button type="primary">新建故障</el-button>
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
    handleedit(obj) {},
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
</style>

