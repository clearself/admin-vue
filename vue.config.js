'use strict'
const path = require('path')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
// const defaultSettings = require('./src/settings.js')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HappyPack = require('happypack')
const isProduction = process.env.NODE_ENV === 'production'
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
const { HashedModuleIdsPlugin } = require('webpack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const rules = [
  {
    test: /\.js$/,
    include: path.resolve('src'),
    use: [
      {
        loader: 'thread-loader',
        options: {
          // 产生的 worker 的数量，默认是 cpu 的核心数
          workers: 3,
          // 一个 worker 进程中并行执行工作的数量
          // 默认为 20
          workerParallelJobs: 50
        }
      }
    ]

  }

]
const pluginsArr = [
  new SimpleProgressWebpackPlugin(),
  new HardSourceWebpackPlugin(),
  new CompressionWebpackPlugin({
    filename: '[path].gz[query]',
    algorithm: 'gzip',
    test: productionGzipExtensions,
    threshold: 10240,
    minRatio: 0.8
  }),
  new HashedModuleIdsPlugin()
]
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */

  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
  transpileDependencies: [
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]src/,
    /[/\\]node_modules[/\\](.+?)?element-ui(.*)[/\\]package/,
    /[/\\]node_modules[/\\](.+?)?f-render(.*)/,
    /[/\\]node_modules[/\\](.+?)?quill-image-drop-module(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-ele-form(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-ele-form-bmap(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-baidu-map(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-ele-upload-image(.*)/,
    /[/\\]node_modules[/\\](.+?)?vuex(.*)/,
    /[/\\]node_modules[/\\](.+?)?iview(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-router(.*)/,
    /[/\\]node_modules[/\\](.+?)?jspdf(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue2-ace-editor(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-ueditor-wrap(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-json-viewer(.*)/,
    /[/\\]node_modules[/\\](.+?)?vuedraggable(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-property-decorator(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-codemirror(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-class-component(.*)/,
    /[/\\]node_modules[/\\](.+?)?vue-clipboard2(.*)/,
    /[/\\]node_modules[/\\](.+?)?html2canvas(.*)/

  ],
  configureWebpack: config => {
    let plugins = []
    const module = {}
    if (isProduction) {
      module.rules = [].concat(rules)
      plugins = [].concat(pluginsArr)
      // 开启分离js
      config.optimization = {
        runtimeChunk: 'single',
        /* splitChunks: {
                      chunks: 'all', // 表明选择哪些 chunk 进行优化。通用设置，可选值：all/async/initial。设置为 all 意味着 chunk 可以在异步和非异步 chunk 之间共享。
                      minSize: 1000 * 60, // 允许新拆出 chunk 的最小体积
                      maxAsyncRequests: 10, // 每个异步加载模块最多能被拆分的数量
                      maxInitialRequests: 10, // 每个入口和它的同步依赖最多能被拆分的数量
                      enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
                      cacheGroups: {
                          libs: { // 第三方库
                              name: 'chunk-libs',
                              test: /[\\/]node_modules[\\/]/, // 请注意'[\\/]'的用法，是具有跨平台兼容性的路径分隔符
                              priority: 10 // 优先级，执行顺序就是权重从高到低
                          // chunks: 'initial' // 只打包最初依赖的第三方
                          },
                          elementUI: { // 把 elementUI 单独分包
                              name: 'chunk-elementUI',
                              test: /[\\/]node_modules[\\/]element-ui[\\/]/,
                              priority: 20 // 权重必须比 libs 大，不然会被打包进 libs 里
                          },
                          commons: {
                              name: 'chunk-commons',
                              minChunks: 2, // 拆分前，这个模块至少被不同 chunk 引用的次数
                              priority: 0,
                              reuseExistingChunk: true
                          },
                          svgIcon: {
                              name: 'chunk-svgIcon',
                              // 函数匹配示例，把 svg 单独拆出来
                              test(module) {
                                  // `module.resource` 是文件的绝对路径
                                  // 用`path.sep` 代替 / or \，以便跨平台兼容
                                  // const path = require('path') // path 一般会在配置文件引入，此处只是说明 path 的来源，实际并不用加上
                                  return (
                                      module.resource &&
                                      module.resource.endsWith('.svg') &&
                                      module.resource.includes(`${path.sep}icons${path.sep}`)
                                  )
                              },
                              priority: 30
                          }
                      }
                  },*/
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: undefined,
              warnings: false,
              parse: {},
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log'] // 移除console
              }
            },
            // 代码压缩插件
            parallel: 4, // 开启并行压缩
            cache: true
          })
        ]
      }

      // 取消webpack警告的性能提示
      config.performance = {
        hints: 'warning',
        // 入口起点的最大体积
        maxEntrypointSize: 1000000 * 500,
        // 生成文件的最大体积
        maxAssetSize: 10000000 * 1000,
        // 只给出 js 文件的性能提示
        assetFilter: function(assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
    }

    return isProduction ? { plugins, module } : { plugins }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@mixins', resolve('src/mixins'))
      .set('@store', resolve('src/store'))
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config.plugin('HappyPack').use(HappyPack, [
      {
        loaders: [
          {
            loader: 'babel-loader?cacheDirectory=true'
          }
        ]
      }
    ])

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js')
  }

}
