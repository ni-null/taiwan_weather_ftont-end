//css
import {
	BootstrapVue,
	IconsPlugin
} from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import "./js/all";
import "./css/all.scss";
import Vue from "vue";

//VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)


//part



const navbar = () => import( /* webpackChunkName: 'index' */ './part/navbar.vue')


//axios
import axios from 'axios'
import VueAxios from 'vue-axios'
import {
	setupCache
} from 'axios-cache-adapter'

//設置axios快取時間
const cache = setupCache({
	maxAge: 5 * 60 * 1000
})
Vue.use(VueAxios, axios)
Vue.axios.defaults.adapter = cache.adapter



const router = new VueRouter({

	routes: [


		{
			path: '/',
			component: () => import( /* webpackChunkName: 'index' */ './part/index_taiwan_map.vue')
		},


		{
			path: '/weather/:city/',
			component: () => import( /* webpackChunkName: 'index' */ './part/city.vue')

		},

		{
			path: '/weather/:city/:dist',
			component: () => import( /* webpackChunkName: 'index' */ './part/dist.vue')
		}


	]

})


const vm = new Vue({
	el: "#app",
	data: {},
	components: {
		navbar
	},
	provide: {
		api_url: 'https://weather-api.ninull.com'
		//api_url: 'http://127.0.0.1:5000'
	},
	router
});