import Vue from 'vue'
import App from './App'
import store from '@/store'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

// 全局引入vuex
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore)

const app = new Vue({
  ...App,
	store
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/apis/interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API集中管理引入部分
import httpApi from '@/apis/http.js'
Vue.use(httpApi, app)

import tools from '@/common/tools.js';
Vue.use(tools, app)

app.$mount(); 
