import "./js/all";
import "./css/all.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Vue from "vue";
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
Vue.use(animated)

//page 
import login from "./part/login.vue";
import read from "./part/read.vue";
import city from "./part/city.vue";
import dist from "./part/dist.vue";

//css
import animated from "animate.css"; // npm install animate.css --save安装，在引入
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)



const router = new VueRouter({

	routes: [{
			path: '/weather/:city/',
			component: city
		},

		{
			path: '/weather/:city/:dist',
			component: dist
		},

		{
			path: '/read',
			component: read
		},

	]

})


const vm = new Vue({
	el: "#app",
	data: {},
	components: {

		login,
		read,

	},
	router
});