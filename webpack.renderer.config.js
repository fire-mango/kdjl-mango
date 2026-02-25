const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
// 新增：确保 Node 内置模块适配 Electron 渲染进程
const webpack = require('webpack');

module.exports = {
  target: 'electron-renderer',
  mode: 'development',
  entry: './src/renderer.js',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, '.webpack/renderer'),
    clean: true,
    // 新增：修复 Electron 中路径解析问题
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ['@babel/preset-env', {
              // 新增：适配 Electron 环境，避免不必要的 polyfill
              targets: {
                electron: require('electron/package.json').version
              },
              useBuiltIns: 'usage',
              corejs: 3 // 需安装 core-js@3：npm i core-js@3 --save-dev
            }]
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            // 新增：css-loader 配置优化，避免路径解析报错
            loader: 'css-loader',
            options: {
              esModule: false, // 兼容 Vue Style Loader
              url: false // 禁用 CSS 中的 url() 解析（按需开启）
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // 新增：Vue 3 全局变量注入（避免 runtime 报错）
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'], // 补充 .json 避免依赖解析报错
    alias: {
      // 区分 Vue 2 / Vue 3 适配（根据你的实际版本调整）
      // Vue 3 适配（推荐）
      'vue$': 'vue/dist/vue.esm-bundler.js',
      // 若用 Vue 2，替换为：'vue$': 'vue/dist/vue.esm.js'
      // 新增：简化路径别名（可选）
      '@': path.resolve(__dirname, 'src')
    },
    // 新增：修复 Electron 中 Node 模块解析问题
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false // 渲染进程禁用 fs 模块（Electron 需通过预加载脚本调用）
    }
  },
  devtool: 'source-map',
  // 新增：提升构建速度 + 避免内存溢出
  cache: {
    type: 'filesystem'
  },
  performance: {
    hints: false // 关闭性能提示（开发模式无需关注）
  },
  // 新增：Node 环境模拟（适配 Electron）
  node: {
    __dirname: false,
    __filename: false
  }
};