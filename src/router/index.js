import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const routes = [
  // 实现路由懒加载
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */'../components/login.vue')
  }, {
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */'../components/Home.vue'),
    redirect: '/welcome',
    children: [{
      path: '/welcome', component: () => import(/* webpackChunkName: "welcome" */'../components/Welcome.vue')
    }, {
      path: '/users', component: () => import(/* webpackChunkName: "users" */'../components/Users/Users.vue')
    }, {
      path: '/roles', component: () => import(/* webpackChunkName: "roles" */'../components/Rights/Roles.vue')
    }, {
      path: '/rights', component: () => import(/* webpackChunkName: "rights" */'../components/Rights/Rights.vue')
    },
    { path: '/goods', component: () => import(/* webpackChunkName: "goods" */'../components/goods/Goods.vue') },
    { path: '/params', component: () => import(/* webpackChunkName: "params" */'../components/goods/Params.vue') },
    { path: '/categories', component: () => import(/* webpackChunkName: "categories" */'../components/goods/Categories.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, form, next) => {
  if (to.path === '/login') return next()
  var tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
