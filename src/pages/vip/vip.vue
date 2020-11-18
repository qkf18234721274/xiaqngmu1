<template>
  <div>

    <!-- 21.传递list数据 给list 组件 -->
    <v-list :list="list" @init="newInit" @edit="edit"></v-list>

    <!-- 2.传递info给form  -->
    <!-- 25.绑定自定义事件init -->
    <v-form :info="info" @init="newInit" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list.vue";
import vForm from "./components/form.vue";
import { reqvipList } from "../../utils/http";
import { reqUserCount } from "../../utils/http";
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
        title: "添加会员"
      },
      //19.列表数据初始值
      list: []
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
        title: "添加会员"
      };
    },
    //发请求
    init() {
      reqvipList().then(res => {
        let list = res.data.list ? res.data.list : [];
        this.list = list;
      });
    },
    newInit() {
      this.init();
     
    },
    edit(uid) {
      this.info = {
        isshow: true,
        title: "编辑会员"
      };
      this.$refs.form.getOne(uid);
    }
  },
  mounted() {
    //20.一进来发请求
    this.init();
   
  }
};
</script>
<style scoped>
</style>