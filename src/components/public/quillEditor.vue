<template>
  <div class="edit_container">
    <!--  新增时输入 -->
    <quill-editor
      v-if="!isedit"
      v-model="contentstr"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
    ></quill-editor>
    <!-- 从数据库读取展示 -->
    <div v-else v-html="contentstr" class="ql-editor">{{contentstr}}</div>

    <div class="buts" v-if="!isedit">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor"; //调用编辑器
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  components: {
    quillEditor
  },
  props: {
    isedit:{
      type:Boolean,
      default:false
    },
    content: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      contentstr:this.content,
      editorOption: {}
    };
  },
  methods: {
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    // 转码
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      return str;
    },
    submitForm(){
      if(this.contentstr){
        this.$emit("submitForm",this.contentstr)
      }else{
        this.$message.error("内容不能为空")
      }
    },
    resetForm(){
      this.$emit("resetForm")
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.editor.container.style.height = `${600}px`;
    // this.editor.edit_container.style.height = `${600}px`;
    this.str = this.escapeStringHTML(this.contentstr);
  }
};
</script>
<style scoped>
.edit_container{
  height:700px;
 overflow: hidden;
 /* overflow-y: scroll; */
}
</style>
