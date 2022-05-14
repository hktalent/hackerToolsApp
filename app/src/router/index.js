import Vue from 'vue'
import VueRouter from 'vue-router'
import AboutView from '../views/AboutView.vue'

// 定义加载的路由数组
const routerList = []
// 声明路由加载函数--主路由动态添加
function importAll (router) {
  // router.keys()拿到对应路径的所有文件名并返回一个数组
  router.keys().forEach(item => {
    // router(item)能够拿到路由对象
    routerList.push(router(item).default)
  })
}
/*
*调用路由加载函数
*require.context方法参数介绍
*'./'：表示同级目录,true：表示能够查找同级目录下的子级文件,/\.router\.js/：正则匹配文件后缀
*/
importAll(require.context('./', true, /\.router\.js/))

Vue.use(VueRouter)

const routes = [
  ...routerList,
  {
    path: '/',
    name: 'home',
    title: '51pwn hacker tools',
    component: AboutView
  },
  {
    path: '/sshRmt',
    name: 'sshRmt',
    title: 'remote connection configuration',
    component: () => import('../views/SshRmt.vue')
  },
  {
    path: '*',
    redirect: '/error/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
