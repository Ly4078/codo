<template>
  <span class="pagein">
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="10"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </span>
</template>
<script>
export default {
  name: "pagein",
  props: {
    // sizes: {
    //     type:Array,
    //     default:[10, 30, 50, 100]
    // },
    // size: {
    //     type:Number,
    //     default:10
    // },
    total: {
        type:Number,
        default:0
    }
  },

  methods: {
    //表格翻页
    handleCurrentChange(val) {
      this.pageNum = val;
      this.$emit("handleCurrentChange", val);
    },
    //修改每页请求数据条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("handleSizeChange", val);
    }
  }
};
</script>