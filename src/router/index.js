import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'Welcome',
        component: () => import('../components/home/Welcome')
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import('../components/user/Users')
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('../components/rights/Rights')
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('../components/rights/Roles')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
