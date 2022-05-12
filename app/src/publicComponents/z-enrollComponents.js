// 注册高复用全局组件

// 将复用组件名称首字母大写
function initialUppercase (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default {
  // 利用install注册插件的形式，在main.js中使用Vue.use()时会自动传入Vue实例
  install (Vue) {
    // 匹配同级的vue文件
    const allComponents = require.context('./', false, /\.vue$/)
    allComponents.keys().forEach(item => {
      // 循环注册组件
      Vue.component(initialUppercase(item.replace(/\.\//, '').replace(/\.vue$/, '')), allComponents(item).default)
    })
  }
}
