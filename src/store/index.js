import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

import actions from "./actions"
import { state, mutations, getters } from "./mutations"
import cate from "./modules/cate"
import specs from "./modules/specs"
import vip from "./modules/vip"
import goods from "./modules/goods"
import seckill from "./modules/seckill"
import banner from "./modules/banner"
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules: {
        cate,
        specs,
        vip,
        goods,
        seckill,
        banner
    }
})