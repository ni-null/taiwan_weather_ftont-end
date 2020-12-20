//css
import Vue from "vue";


import "./css/all.scss";

import "./css/normal.scss";



//axios
import axios from 'axios'
import VueAxios from 'vue-axios'
//設置axios快取時間
import {
	setupCache
} from 'axios-cache-adapter'

const cache = setupCache({
	maxAge: 5 * 60 * 1000
})
//設置axios快取時間
axios.defaults.withCredentials = true;
Vue.use(VueAxios, axios)
Vue.axios.defaults.adapter = cache.adapter

//VueRouter
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//VueCookies
import VueCookies from "vue-cookies";
Vue.use(VueCookies);

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
		},

		{
			path: '/account/',
			component: () => import( /* webpackPreload: true */ /* webpackChunkName: 'account' */ './part/account.vue')
		}
		,

		{
			path: '/account/user/',
			component: () => import( /* webpackPreload: true */ /* webpackChunkName: 'user' */ './part/user.vue')
		}



	]

})


const vm = new Vue({
	el: "#app",
	data: {

	},
	methods: {
		//登入驗證
		login_check: function () {

			this.axios.post(this.api_url + "/account/login_check")
				.then((response) => {


					if (response["data"] != 'error') {
						this.login_check_result = response["data"]
					} else {
						this.$router.push({
							path: '/account/'
						})
					}
					//if

				});
		}

	}
	,
	mounted() {


	}
	,
	components: {


	},
	provide: {
		api_url: 'https://weather-api.ninull.com'
		//	api_url: 'http://127.0.0.1:5000'
	},
	created() {


	},

	router
});