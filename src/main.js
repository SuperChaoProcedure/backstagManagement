import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/fonts/iconfont.css'
import './plugins/element'
import axios from 'axios'
import './assets/css/globel.css'
import ZkTable from 'vue-table-with-tree-grid'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截器
axios.interceptors.request.use(
  function (config) {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config // 请求头配置项
  },
  function (error) {
    console.log(error)
  }
)

Vue.component('tree-table', ZkTable)
// axios响应拦截器
axios.interceptors.response.use(
  function (res) {
    NProgress.done()
    res = res.data
    return res // 响应回来的数据
  },
  function (error) {
    console.log(error)
  }
)
NProgress.configure({ showSpinner: false })

Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
