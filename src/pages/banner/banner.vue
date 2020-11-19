<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

   
    <v-list  @edit="edit"></v-list>

    
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list.vue";
import vForm from "./components/form.vue";
import { reqUserList,reqUserCount } from "../../utils/http";
export default {
  components: {
    vList,
    vForm
  },
  data() {
    return {
      // 1.初始值 弹框数据
      info: {
        isshow: false,
        title: "添加轮播图"
      },
     
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    //5.点击了添加按钮
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加轮播图"
      };
    },
    
    //36 编辑
    edit(id) {
      this.info = {
        isshow: true,
        title: "编辑轮播图"
      };
      this.$refs.form.getOne(id);
    }
  },
  mounted() {
   
  }
};
</script>
<style scoped>
</style>