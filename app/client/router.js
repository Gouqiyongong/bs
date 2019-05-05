export default [
  {
    path: '/login',
    component: resolve => require(['./page/login.vue'], resolve)
  },
  {
    path: '/sign',
    component: resolve => require(['./page/sign.vue'], resolve)
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
      {
        path: 'manage',
        component: resolve => require(['./page/manage.vue'], resolve),
      },
      {
        path: 'personal',
        component: resolve => require(['./page/personal.vue'], resolve),
      },
    ]
  },
  {
    path: '*',
    redirect: '/login'
  }
]