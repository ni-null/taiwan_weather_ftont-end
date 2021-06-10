//css
import "./css/all.scss"
import "./css/ani.scss"
import "./css/normal.scss"
import Vue from "vue"

/* axios */
import axios from "axios"
import VueAxios from "vue-axios"

//設置axios快取時間
import { setupCache } from "axios-cache-adapter"

const cache = setupCache({
  maxAge: 5 * 60 * 1000,
})
Vue.use(VueAxios, axios)
axios.defaults.withCredentials = true
Vue.axios.defaults.adapter = cache.adapter
//設置axios快取時間
/* axios */

//VueRouter
import VueRouter from "vue-router"
Vue.use(VueRouter)
//VueRouter

//VueCookies
import VueCookies from "vue-cookies"
Vue.use(VueCookies)
//VueCookies

//路由配置
const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: () => import(/* webpackPreload: true */ /* webpackChunkName: 'index' */ "./part/index.vue"),
    },

    {
      path: "/weather/:city/",
      component: () => import(/* webpackPreload: true */ /* webpackChunkName: 'city' */ "./part/city.vue"),
    },

    {
      path: "/weather/:city/:dist",
      component: () => import(/* webpackPreload: true */ /* webpackChunkName: 'dist' */ "./part/dist.vue"),
    },

    {
      path: "/account/",
      component: () => import(/* webpackPreload: true */ /* webpackChunkName: 'account' */ "./part/account.vue"),
    },
    {
      path: "/account/user/",
      component: () => import(/* webpackPreload: true */ /* webpackChunkName: 'user' */ "./part/user.vue"),
    },
  ],
})

const vm = new Vue({
  el: "#app",
  data: {},
  methods: {},
  mounted() {},
  components: {
    navbar: () => import(/* webpackChunkName: 'navbar' */ "./part/navbar.vue"),
  },
  provide: {
    api_url: "https://weather-api.ninull.com",
    // api_url: "http://127.0.0.1:5000",

    //刪除動畫
    remove_loading: function() {
      const vue_first_loding = document.getElementById("vue_first_loding")
      if (vue_first_loding != null) vue_first_loding.remove()
    },
  },

  router,
})
