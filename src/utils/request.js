// 请求模块
import axios from 'axios'
import store from '@/store/'
import JSONbig from 'json-bigint'

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
// 相应拦截器

export default request
