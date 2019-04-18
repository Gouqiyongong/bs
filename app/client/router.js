export default [
  {
    path: '/login',
    component: resolve => require(['./page/login.vue'], resolve)
  },
  {
    path: '/main',
    component: resolve => require(['./page/main.vue'], resolve),
    children: [
      {
        path: '',
        component: resolve => require(['./components/main-list.vue'], resolve),
      },
      {
        path: 'order',
        component: resolve => require(['./page/order.vue'], resolve),
      },
    ]
  },
  {
    path: '*',
    redirect: '/login'
  }
]