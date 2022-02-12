import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录页
  {
    path: '/login',
    name: 'login',
    // 设置路由懒加载
    component: () => import('@/views/login/')
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
        component: () => import('@/views/home/')
      },
      // 问答页
      {
        path: 'qa',
        name: 'qa',
        component: () => import('@/views/qa/')
      },
      // 视频页
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/video/')
      },
      // 我的页
      {
        path: 'my',
        name: 'my',
        component: () => import('@/views/my/')
      }
    ]
  },
  // 搜索页
  {
    path: '/search',
    name: 'search',
    // 设置路由懒加载
    component: () => import('@/views/search/')
  },
  // 文章详情页(动态路由)
  {
    path: '/article/:articleId',
    name: 'article',
    // 设置路由懒加载
    component: () => import('@/views/article/'),
    props: true
  },
  // 用户资料页(动态路由)
  {
    path: '/user/profile',
    name: 'user-profile',
    // 设置路由懒加载
    component: () => import('@/views/user-profile/')
  },
  // 小智同学页
  {
    path: '/user/chat',
    name: 'user-chat',
    // 设置路由懒加载
    component: () => import('@/views/user-chat/')
  }
]

const router = new VueRouter({
  routes
})

export default router
