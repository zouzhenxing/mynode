//第三方组件
import Vue from 'vue';
import vuerouter from 'vue-router';
import touch from 'vue-touch';
import jquery from './jquery.js';

//自定义组件
import filters from './filter.js';
import trans from './transition.js';
import home from './view/home.vue';
import homecontent from './component/homeContent.vue';
import listtopic from './view/listtopic.vue';
import loading from './component/loading.vue';

//引入样式
import './css/animate.css';
import './css/weui.css';
import './css/style.css';

//加入中间件
Vue.use(vuerouter);
Vue.use(touch);

//注册全局组件
Vue.component("loading",loading);
//实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
//注册全局过渡效果
Object.keys(trans).forEach(k => Vue.transition(k, trans[k]))

var App = Vue.extend({});
global.router = new vuerouter();
global.rootPath = "https://cnodejs.org/";
global.$ = jquery;

$.ajaxSettings.crossDomain = true;

var homerouter = {
      component : home,
      subRoutes : {
          '/:type' : {
              component : homecontent
          }
      }
  }
//首页路由
router.map({
  "/home" : homerouter,
  "/topic/:id" : {
      component : listtopic
  }
});
router.go("/home/all");
router.start(app,"#app");