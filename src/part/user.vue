<template>
  <div>


    <div class="main_box main_user">

      <transition name="bob">
        <div class="user_box" v-show="animal_show">
          <div class="user_nav">

            <div class="user_nav_item item_2" @click="user_sub">
              <img :src="require('../img/svg/favorite.svg')" />
              <p>我的訂閱</p>
            </div>
            <div class="user_nav_item item_3" @click="user_info">
              <img :src="require('../img/svg/me.svg')" />
              <p>我的帳號</p>
            </div>
          </div>



          <user_sub v-show="show==`user_sub`"></user_sub>



          <user_info v-show="show==`user_info`"></user_info>



          <button @click="delete_login" id="login_out"> 登出 </button>
        </div>

      </transition>

    </div>

  </div>
</template>

<script>
  import('../css/user.scss')
  import bus from '../js/bus'


  export default {
    data() {
      return {
        show: 'user_sub',

        login_check_result: null,

        animal_show: false

      }
    },

    methods: {

      //登入檢查
      login_check: async function () {


        const response = await this.axios.get(this.api_url + "/account/login")

        if (response["data"]) {

          this.login_check_result = response["data"].split(":")[1]
          // this.$cookies.set('user', this.login_check_result) //return this



        } else {
          this.$cookies.remove('user')
          this.$router.push({
            path: '/account/'
          })
        }

      },

      //登出
      delete_login: async function () {

        const response = await this.axios.delete(this.api_url + "/account/login")

        if (response) {
          console.log('登出')
          this.login_check_result = '尚未登入'
          $cookies.remove('user')
          bus.$emit('login', false)
          //登出後返回
          this.$router.push({
            path: '/account/'
          })

        }


      },

      //切換訂閱
      user_sub: function () {
        this.show = 'user_sub'
      },

      //telegram切換
      user_info: function () {
        this.show = 'user_info'
      }
    },

    inject: ["api_url", "remove_loading"],
    mounted() {

      this.login_check()

    },
    created() {

      setInterval(() => {
        this.animal_show = true
      }, 0);


      this.remove_loading()
    },


    components: {
      user_sub: () => import( /* webpackPreload: true */ /* webpackChunkName: 'user' */ './user_sub.vue'),
      user_info: () => import( /* webpackPreload: true */ /* webpackChunkName: 'user' */ './user_info.vue')


    }
  }
</script>