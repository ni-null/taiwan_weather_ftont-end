//css
import Vue from "vue";

import {
	BootstrapVue
} from 'bootstrap-vue'
Vue.use(BootstrapVue)

import "./js/all";
import "./css/all.scss";



//part
const navbar = () => import( /* webpackPreload: true */ /* webpackChunkName: 'navbar' */ './part/navbar.vue')

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

//VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)



const router = new VueRouter({

	routes: [


		{
			path: '/',
			component: () => import( /* webpackPreload: true */ /* webpackChunkName: 'index' */ './part/index.vue')
		},


		{
			path: '/weather/:city/',
			component: () => import( /* webpackPreload: true */ /* webpackChunkName: 'city' */ './part/city.vue')

		},

		{
			path: '/weather/:city/:dist',
			component: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './part/dist.vue')
		}


	]

})


const vm = new Vue({
	el: "#app",
	data: {

	},
	components: {
		navbar
	},
	provide: {
		api_url: 'https://weather-api.ninull.com'
		//api_url: 'http://127.0.0.1:5000'
	},
	router
});