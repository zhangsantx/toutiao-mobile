// vue.config.js是vue-cli创建的项目的配置文件，可以对整个项目的打包和构建进行全局的配置
const path = require('path')
// 利用path模块获取自定义覆盖样式的less文件的绝对路径
const thremPath = path.join(__dirname, './src/styles/threm.less')
module.exports = {
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        // lessOptions: {
        modifyVars: {
          // 直接覆盖变量(在Vant文档中对应组件的样式变量)
          // nav-bar-background-color NavBar组件的背景色
          // 缺点：每次修改完之后都需要重启服务，实际开发中不建议使用
          // 'nav-bar-background-color': 'red'
          // 通过 less 文件覆盖（文件路径为绝对路径）
          // 优点：可以修改之后直接保存就生效，不需要重启服务--推荐使用的形式
          // hack: `true; @import "自定义覆盖样式的less文件路径";`
          hack: `true; @import "${thremPath}";`
        }
        // }
      }
    }
  }
}
