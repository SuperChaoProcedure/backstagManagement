// 默认vue脚手架帮我们配置好了webpack,但是如果你觉得他配置的还不够好，你想扩展，就可以在当前项目的根目录创建一个名字必须叫vue.config.js的文件，在这个文件中你配置的优先级是最高的
// 怎么配置这个不是乱写，需要参考 https://cli.vuejs.org/zh/config/
// npm run serve
// vue.config.js
module.exports = {
  publicPath: './',
  devServer: {
    open: true
  },
  productionSourceMap: false, // 打包的时候不会产生source map文件
  lintOnSave: process.env.NODE_ENV !== 'production', // 在开发阶段我们需要eslint，生产阶段关闭掉
  chainWebpack: config => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-prod.js')

      config.plugin('html').tap(args => {
        args[0].isProd = true
        args[0].title = 'production-后台管理系统'
        return args
      })

      // 这块一会儿打包之后可以看到效果，先不管，知道意思就行
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })

      // 打包的时候，直接排除掉这些，走的是cdn，可以减少包的体积
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config
        .entry('app')
        .clear()
        .add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        args[0].title = 'development--后台管理系统'
        return args
      })
    })
  }
}

// 如果我们执行npm run serve ，下面打印结果就是development
// 如果执行的是npm run build 下面打印结果就是production
// console.log('==========================')
// console.log(process.env.NODE_ENV)
// console.log('====================')

// 1. 把一些完整引入的第三方包想办法用对应的按需引入
// 2. 生产阶段路由懒加载
// 3. 生产阶段eslint,sourcemap禁用掉
// 4. 生产阶段打印信息全部移除掉
// 5. 生产阶段把开源库全部用的是cdn
