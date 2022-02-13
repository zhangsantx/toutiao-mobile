import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

const routes = [
  // 登录页
  {
    path: '/login',
    name: 'login',
    // 设置路由懒加载
    component: () => import('@/views/login/'),
    meta: { requiresAuth: false } // 是否登录才能访问--否
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      // 首页
      {
        // 默认子路由
        path: '',
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requiresAuth: false } // 是否登录才能访问--否
      },
      // 问答页
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requiresAuth: false } // 是否登录才能访问--否
      },
      // 视频页
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requiresAuth: false } // 是否登录才能访问--否
      },
      // 我的页
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requiresAuth: false } // 是否登录才能访问--否
      }
    ]
  },
  // 搜索页
  {
    path: '/search',
    name: 'search',
    // 设置路由懒加载
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false } // 是否登录才能访问--否
  },
  // 文章详情页(动态路由)
  {
    path: '/article/:articleId',
    name: 'article',
    // 设置路由懒加载
    component: () => import('@/views/article/'),
    props: true,
    meta: { requiresAuth: false } // 是否登录才能访问--否
  },
  // 用户资料页(动态路由)
  {
    path: '/user/profile',
    name: 'user-profile',
    // 设置路由懒加载
    component: () => import('@/views/user-profile/'),
    meta: { requiresAuth: true } // 是否登录才能访问--是
  },
  // 小智同学页
  {
    path: '/user/chat',
    name: 'user-chat',
    // 设置路由懒加载
    component: () => import('@/views/user-chat/'),
    meta: { requiresAuth: true } // 是否登录才能访问--是
  }
]

// 解决控制台抛出Promise错误
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, resolve, reject) {
  if (resolve || reject) return originalPush.call(this, location, resolve, reject)
  return originalPush.call(this, location).catch((err) => err)
}

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 不需要登录权限--方向
  if (to.name === 'login' || !to.meta.requiresAuth) {
    return next()
  }

  if (store.state.user) {
    return next()
  }

  Dialog.confirm({
    title: '该功能需要登录，确认登录吗？'
  })
    .then(() => {
      next({
        name: 'login',
        query: {
          redirect: from.fullPath
        }
      })
    })
    .catch(() => {
      // 取消
      next(false) // 取消导航
    })
})

export default router
