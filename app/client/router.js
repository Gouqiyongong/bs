export default [
  {
    path: '/login',
    component: resolve => require(['./page/login.vue'], resolve)
  },
  {
    path: '/main',
    component: resolve => require(['./page/main.vue'], resolve)
  },
  {
    path: '*',
    redirect: '/login'
  }
]