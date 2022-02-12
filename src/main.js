import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载Vant组件库
import Vant from 'vant'

// 加载二次封装的dayjs处理相对时间
import './utils/dayjs'

// 加载Vant组件库样式
import 'vant/lib/index.less'
// 加载全局样式
import './styles/index.less'

// 加载lib-flexible，自动设置rem基准值（html标签字体大小）
import 'amfe-flexible'

// 注册Vant组件库
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
