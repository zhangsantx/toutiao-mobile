// postcss配置文件
module.exports = {
  // 配置要使用的相关插件
  plugins: {
    // 自动添加浏览器厂商声明前缀，用于兼容不同的浏览器
    // autoprefixer: {
    //   // 配置需要兼容的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 将 px 转换成 rem
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
