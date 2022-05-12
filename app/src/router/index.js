import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    second: 'cmwork',
    about: () => import('../views/AboutView.vue')
  },
  {
    path: '/sshrmt',
    name: 'sshrmt',
    component: () => import('../views/SshRmt.vue')
  },
  {
    path: '/curconn',
    name: 'CurConn',
    second: 'curconn',
    components: {
      component: () => import('../views/CurConn.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
