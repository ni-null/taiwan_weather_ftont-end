<template>
  <div>


    <div class="main_box">



      <user_sub v-if="login_check_result"></user_sub>
      <p>
        登入狀態 {{login_check_result}}
      </p>


      <input @click="delete_login" type="button" value="登出">

    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: 'login',
        login_check_result: null

      }
    },

    methods: {

      login_check: async function () {


        const response = await this.axios.get(this.api_url + "/account/login")



        //this.$cookies.remove('user')
        if (response["data"]) {
          this.login_check_result = response["data"].split(":")[1]
          this.$cookies.set('user', this.login_check_result) //return this
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
          //登出後返回
          this.$router.push({
            path: '/account/'
          })

        }


      }
    },

    inject: ["api_url"],
    mounted() {

      this.login_check()

    },


    components: {
      user_sub: () => import( /* webpackPreload: true */ /* webpackChunkName: 'user' */ './user_sub.vue')


    }
  }
</script>