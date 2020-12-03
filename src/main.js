import "./js/all";
import "./css/all.scss";
import "./js/d3.v4.min"
import Vue from "vue";
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
Vue.use(VueRouter)


//page 
import navbar from "./part/navbar.vue";
import taiwan_map from "./part/taiwan_map.vue";
import city from "./part/city.vue";
import dist from "./part/dist.vue";



//css

import {
	BootstrapVue,
	IconsPlugin
} from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)



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