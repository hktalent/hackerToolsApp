export default {
  path: '/error/404',
  name: '404',
  meta: {
    belong: ['error'],
    title: '错误',
    token: false // 此页面是否需要权限
  },
  component: () => import(/* webpackChunkName: "error" */ '@/views/notFound.vue')
}
