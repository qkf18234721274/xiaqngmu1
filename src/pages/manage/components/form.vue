<template>
  <div>
    <!-- 4.绑定数据到模板 -->
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="用户名" label-width="120px">
          <!-- 9.通过v-model将user绑定到表单上 -->
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <!-- 9.通过v-model将user绑定到表单上 -->
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加管理员'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqRoleList,
  reqUserAdd,
  reqUserDetail,
  reqUserUpdate
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  // 3.接收info
  props: ["info"],
  data() {
    return {
      //7.初始化user
      user: {
        uid: "",
        roleid: "",
        username: "",
        password: "",
        status: 1
      },

      //  11.角色列表
      roleList: []
    };
  },
  computed: {
    ...mapGetters({})
  },
  methods: {
    ...mapActions({}),
    //6.点了取消
    cancel() {
      this.info.isshow = false;
    },
    //17.清空数据
    empty() {
      this.user = {
        uid: "",
        roleid: "",
        username: "",
        password: "",
        status: 1
      };
    },
    //10.点了添加按钮User
    // add() {
    //   //16.ajax
    //   reqUserAdd(this.user).then(res => {
    //     if (res.data.code == 200) {
    //       //弹成功
    //       successAlert("添加成功");
    //       //弹框消失
    //       this.cancel();
    //       //数据清空
    //       this.empty();
    //       //24 刷新list
    //       this.$emit("init");
    //     }
    //   });
    // },
    getOne(uid) {
      reqUserDetail(uid).then(res => {
        this.user = res.data.list;
        this.user.password = "";
      });
    },
    update() {
      reqUserUpdate(this.user).then(res => {
        if (res.data.code == 200) {
          successAlert("修改成功"),
            this.cancel(),
            this.empty(),
            this.$emit("init");
        }
      });
    },
    closed() {
      if (this.info.title === "编辑管理员") {
        this.empty();
      }
    }
  },
  mounted() {
    //   12.一进来，先获取菜单列表数据
    reqvipList().then(res => {
      if (res.data.code == 200) {
        this.vipList = res.data.list;
      }
    });
  }
};
</script>
<style scoped>
</style>