const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: 'localhost',
    port: 8081,
    proxy: {
      '/api/v1/': {
        target: 'http://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/conn/': {
        target: 'http://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      },
      '/ssh/': {
        target: 'http://127.0.0.1:8081',
        ws: true,
        changeOrigin: true
      }
    }
  },

  transpileDependencies: true,
  publicPath: '',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  }
})
