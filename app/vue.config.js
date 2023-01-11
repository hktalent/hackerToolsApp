const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: 'localhost',
    port: 8082,
    runtimeCompiler: true,
    proxy: {
      '/.*_index/': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/api': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/md/': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/conn/': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/ssh/': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/CyberChef/': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/indexes/': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/HackTools/': {
        target: 'https://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      }
    }
    // convertJsToTs: true,
    // allowJs: true
  },
  // markdowm文件展示配置
  chainWebpack: config => {
    config.module
      .rule('md')
      .test(/\.md/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .use('markdown-loader')
      .loader('markdown-loader')
      .end()
  },
  transpileDependencies: true,
  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  }
})
