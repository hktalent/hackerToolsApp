import Vue from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
// import vuetify from '@/plugins/vuetify'
import ElementUI from 'element-ui'
// 引入全局组件
import enrollComponents from '@/publicComponents/z-enrollComponents.js'

Vue.use(ElementUI, { size: 'medium', zIndex: 3000 })
// Vue.use(vuetify)
Vue.use(VueResource)
Vue.use(enrollComponents)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.title = '51pwn Tools'
  next()
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
