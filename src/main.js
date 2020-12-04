//css
import {
	BootstrapVue,
	IconsPlugin
} from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import "./js/all";
import "./css/all.scss";
import "./js/d3.v4.min"
import Vue from "vue";

//VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)


//paer 
import navbar from "./part/navbar.vue";
import taiwan_map from "./part/taiwan_map.vue";
import city from "./part/city.vue";
import dist from "./part/dist.vue";





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
			component: taiwan_map
		},


		{
			path: '/weather/:city/',
			component: city
		},

		{
			path: '/weather/:city/:dist',
			component: dist
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