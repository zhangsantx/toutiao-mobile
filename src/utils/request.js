// 请求模块
import axios from 'axios'
import store from '@/store/'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router/'

const refreshTokenRequest = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/'
})

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/',
  transformResponse: [
    function (data) {
      try {
        // 如果后端返回的不是JSON字符串会报错，所以使用try/catch
        return JSONbig.parse(data)
      } catch (error) {
        return data
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // 获取本地存储中的user信息
    const { user } = store.state
    if (user) {
      // 设置统一的token
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 请求失败
  function (error) {
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // 所有响应码为2xx的都会进入触发
    return response
  },
  async (error) => {
    // 所有响应码为2xx之外的都会进入触发
    const { status } = error.response
    // 处理请求401异常
    // 注意：在请求模块中使用this.$router需要important引入加载
    if (error.response && status === 401) {
      // 登录过期
      // 如果user不存在或user.token--跳转重新登录
      const { user } = store.state
      if (!user || !user.token) {
        // 跳转登录
        return redirectLogin()
      }
      // 如果存在refresh_token，则请求新的token并更新容器中的token
      if (user && user.refresh_token) {
        // 创建新的axios实例请求刷新token
        try {
          const { data } = await refreshTokenRequest({
            method: 'PUT',
            url: '/app/v1_0/authorizations',
            headers: {
              Authorization: `Bearer ${user.refresh_token}`
            }
          })
          // 刷新成功
          // 更新token
          user.token = data.data.token
          store.commit('setUser', user)
          // 将失败的请求发送出去（继续发送失败的请求）
          return request(error.config)
        } catch (error) {
          // 刷新失败--跳转登录
          redirectLogin()
        }
      }
    } else if (error.response && status === 400) {
      // 400 客户端参数错误
      Toast('参数错误')
    } else if (error.response && status === 403) {
      // 403 token未携带或已过期 / 无权限
      Toast('无权限')
    } else if (error.response && status >= 500) {
      // 服务端错误
      Toast('服务器异常，请稍后重试')
    }

    // 抛出异常
    return Promise.reject(error)

    // 跳转登录
    function redirectLogin() {
      router.replace({
        name: 'login',
        // 传递查询参数--查询参数会以?为分割符拼接到url中--告诉从哪来
        query: {
          // redirect 自定义名称
          // redirect: '当前路由路径'
          redirect: router.currentRoute.fuppPath
        }
      })
    }
  }
)

export default request
