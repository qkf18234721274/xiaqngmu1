<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <!-- 21.传递list数据 给list 组件 -->
    <v-list :list="list" @init="newInit" @edit="edit"></v-list>

    <!-- 分页 -->
    <!-- total：总条数
    page-size:一页的数量
    current-change:当前页码发生了修改，会触发，回调函数的参数就是新的页码
    -->

    <el-pagination
      background
      @current-change="changePage"
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
    ></el-pagination>

    <!-- 2.传递info给form  -->
    <!-- 25.绑定自定义事件init -->
    <v-form :info="info" @init="newInit" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list.vue";
import vForm from "./components/form.vue";
import { reqUserList } from "../../utils/http";
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
        title: "添加管理员"
      },
      //19.列表数据初始值
      list: [],
      // 51.初始化数据
      total: 0, //总数
      size: 2, //一页的数量
      page: 1 //页码
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
        title: "添加管理员"
      };
    },
    //发请求
    init() {
      reqUserList({ page: this.page, size: this.size }).then(res => {
         let list=res.data.list?res.data.list:[]

        // 56.如果取到的list是[],并且page>1,page自减，请列表
        if(list.length===0&&this.page>1){
          this.page--;
          this.init();
          return;
        }

        this.list =list;

      });
    },
    getCount() {
      reqUserCount().then(res => {
        this.total = res.data.list[0].total;
      });
    },
    changePage(page) {
      this.page = page;
      this.init();
    },
    newInit() {
      this.init();
      this.getCount();
    },
    edit(uid) {
      this.info = {
        isshow: true,
        title: "编辑管理员"
      };
      this.$refs.form.getOne(uid);
    }
  },
  mounted() {
    //20.一进来发请求
    this.init();
    this.getCount();
  }
};
</script>
<style scoped>
</style>