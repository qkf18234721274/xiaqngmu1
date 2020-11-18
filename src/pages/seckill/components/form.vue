<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @opened="opened" @closed="closed">
      <el-form :model="user" :rules="rules">
        {{user}}
        <el-form-item label="活动名称" label-width="120px">
          <el-input v-model="user.title" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="120px">
          <el-date-picker
            v-model="value"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :blur="blur"
            align="right"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px">
          <el-select placeholder="请选择一级分类" v-model="user.first_cateid" @change="changeFirst">
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px">
          <el-select placeholder="请选择二级分类" v-model="user.second_cateid" @change="changeSecond">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="120px">
          <el-select placeholder="请选择商品" v-model="user.goodsid">
            <el-option
              v-for="item in thirdCateList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加秒杀'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
import {
  reqcateList,
  reqseckAdd,
  reqseckList,
  reqseckDel,
  reqseckDetail,
  reqseckUpdate,
  reqgoodsList
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      rules: {
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        first_cateid: [
          { required: true, message: "请输入一级分类", trigger: "change" }
        ],
        second_cateid: [
          { required: true, message: "请输入二级分类", trigger: "change" }
        ],
        time: [{ required: true, message: "请输入活动期限", trigger: "blur" }],
        goodsid: [{ required: true, message: "请输入商品", trigger: "blur" }],
        specsattr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个规格属性",
            trigger: "change"
          }
        ]
      },
      //1.初始化数据
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1
      },

      value: [],
      secondCateList: [],

      //三级分类的list
      thirdCateList: []
    };
    //二级分类的list
  },
  computed: {
    ...mapGetters({
      seckList: "seckill/list",
      specsList: "specs/list",
      //3。一级分类list
      cateList: "cate/list",
      goodsList: "goods/list"
    })
  },
  methods: {
    ...mapActions({
      //请求一级分类list
      reqseckList: "seckill/reqList",
      reqCateList: "cate/reqList",
      reqGoodsList: "goods/reqList"
    }),
    // 5.根据一级分类id，得到二级分类list
    changeFirst() {
      //二级分类的id重置
      this.user.second_cateid = "";
      this.getSecondList();
    },
    getSecondList() {
      //获取二级分类list
      reqcateList({ pid: this.user.first_cateid }).then(res => {
        this.secondCateList = res.data.list;
      });
    },
    changeSecond() {
      //三级分类的id重置
      this.user.goodsid = "";
      this.getThirdList();
    },

    getThirdList() {
      reqgoodsList().then(res => {
        console.log(res);
        let obj = this.goodsList.filter(
          item => item.second_cateid === this.user.second_cateid
        );
        this.thirdCateList = obj;
      });
    },
    changeSpecsId() {
      this.user.specsattr = [];
      this.getAttrs();
    },
    getAttrs() {
      // 取出 specsList ,哪条数据的id和this.user.specsid是一样的
      let obj = this.specsList.find(item => item.id === this.user.specsid);
      //就将这条数据的attrs取出来，赋值给attrsList
      this.attrsList = obj.attrs;
    },
    cancel() {
      this.info.isshow = false;
    },
    //新增规格属性
    addAttr() {
      this.attrArr.push({
        value: ""
      });
    },
    //删除规格属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    //清空
    empty() {
      this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
        secondCateList: []
      };
    },

    //验证
    check() {
      return new Promise((resolve, reject) => {
        //验证
        if (this.user.time === "") {
          errorAlert("活动期限为空");
          return;
        }
        if (this.user.first_cateid === "") {
          errorAlert("一级分类不能为空");
          return;
        }
        if (this.user.second_cateid === "") {
          errorAlert("二级分类不能为空");
          return;
        }
        if (this.user.title === "") {
          errorAlert("秒杀名称为空");
          return;
        }
        if (this.user.goodsid === "") {
          errorAlert("商品为空");
          return;
        }
        resolve();
      });
    },
    blur() {
      this.user.begintime = this.value[0];
      this.user.endtime = this.value[1];
    },
    //添加
    add() {
      this.check().then(() => {
        reqseckAdd(this.user).then(res => {
          if (res.data.code === 200) {
            successAlert("添加成功");
            this.cancel();
            this.empty();
            //刷新list
            this.reqseckList();
          }
        });
      });
    },
    //详情
     getOne(id) {
      reqseckDetail(id).then(res => {
        this.user = res.data.list;
        //此刻是没有id的
        this.user.id = id;
        // 请二级list
        this.getSecondList();
        //请求获取商品
        this.getThirdList();
        // 时间处理
        this.value = [
          new Date(Number(res.data.list.begintime)),
          new Date(Number(res.data.list.endtime))
        ];
      });
    },
    //更新
    update() {
      this.check().then(() => {
       
        reqseckUpdate(this.user).then(res => {
          if (res.data.code == 200) {
            successAlert("更新成功");
            this.cancel();
            this.empty();
            this.reqseckList();
          }
        });
      });
    },
    closed() {
      if (this.info.title == "编辑秒杀") {
        this.empty();
      }
    },
    //弹框打开，并且动画结束了
    opened() {
      this.editor = new E("#edit");
      this.editor.create();
      this.editor.txt.html(this.user.description);
    }
  },
  mounted() {
    this.reqCateList();
    this.reqGoodsList(true);
  }
};
</script>
<style scoped>
.line {
  display: flex;
}
.line .el-input {
  flex: 1;
}
.line .el-button {
  width: auto;
}

.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}

.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}

.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.myupload .img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>