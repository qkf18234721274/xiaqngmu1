<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
    
        <el-form-item label="标题" label-width="120px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <!-- <div class="myupload">
            <h3>+</h3>
            <img class="img" v-if="imgUrl" :src="imgUrl" alt="">
           
            <input v-if="info.isshow" type="file" class="ipt" @change="changeFile">
          </div>-->
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeFile2"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="info.title=='添加轮播图'" @click="add">添 加</el-button>
        <el-button type="primary" v-else @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from "path";
import { mapGetters, mapActions } from "vuex";
import {
  reqbannerList,
  reqbannerAdd,
  reqbannerInfo,
  reqbannerUpdate
} from "../../../utils/http";
import { successAlert, errorAlert } from "../../../utils/alert";
export default {
  // 3.接收info
  props: ["info"],
  data() {
    return {
      //7.初始化user
      user: {
       title:"",
        img: null,
        status: 1
      },
      //  11.角色列表
      imgUrl: []
    };
  },
  computed: {
    ...mapGetters({
      bannerList: "banner/list"
    })
  },
  methods: {
    ...mapActions({
      reqbannerList: "banner/reqList"
    }),
    changeFile(e) {
      let file = e.target.files[0];

      //判断文件大小 file.size B ，1M=1024KB 1KB=1024B
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件大小不能超过2M");
        return;
      }

      //判断文件类型
      let extname = path.extname(file.name); //'.jpg'
      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确的图片格式！");
        return;
      }

      //URL.createObjectURL(file) 将一个文件生成一个URL地址
      this.imgUrl = URL.createObjectURL(file);
      //给user.img赋值
      this.user.img = file;
    },
    changeFile2(e) {
      let file = e.raw;
      this.imgUrl = URL.createObjectURL(file);

      this.user.img = file;
    },
    //6.点了取消
    cancel() {
      this.info.isshow = false;
    },
    //17.清空数据
    empty() {
      this.user = {
       title:"",
        img: null,
        status: 1
      };
      this.imgUrl = "";
    },
    //10.点了添加按钮User
    add() {
      console.log(this.user);

      //16.ajax
      reqbannerAdd(this.user).then(res => {
        if (res.data.code == 200) {
          //弹成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据清空
          this.empty();
          //24 刷新list
          this.reqbannerList();
        }
      });
    },
    //删除商品属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    getOne(id) {
      reqbannerInfo(id).then(res => {
        //此时的user没有id
        
        this.user = res.data.list;
        console.log(res);
        
        console.log(this.user);
        this.imgUrl = this.$imgPre + this.user.img;
        //补id
        this.user.id = id;
      });
    },
    update() {
      console.log(this.user);
      
      reqbannerUpdate(this.user).then(res => {
        if (res.data.code == 200) {
          successAlert("修改成功"), this.cancel(), this.empty(), this.reqbannerList();
        }
      });
    },
    closed() {
      if (this.info.title === "编辑轮播图") {
        this.empty();
      }
    }
  },
  mounted() {
    this.reqbannerList();
  }
};
</script>
<style scoped lang="stylus">
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

/* 穿透 */
.add >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>