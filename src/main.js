import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueWechatTitle from 'vue-wechat-title'


Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(vueWechatTitle)


new Vue({
  render: h => h(App),
  router, store
}).$mount('#app')
