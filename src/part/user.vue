<template>
  <div>

    <navbar></navbar>
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

      login_check: function () {

        this.axios.get(this.api_url + "/account/login")
          .then((response) => {

            //this.$cookies.remove('user')
            if (response["data"] != 'error') {
              this.login_check_result = response["data"]
              $cookies.set('user', this.login_check_result) //return this
            } else {

              this.$router.push({
                path: '/account/'
              })
            }



          })
      },

      //登出
      delete_login: function () {

        this.axios.delete(this.api_url + "/account/login")
          .then((response) => {
              console.log('登出')
              this.login_check_result = '尚未登入'
              $cookies.remove('user')
              //登出後返回
              this.$router.push({
                path: '/account/'
              })
            }

          )


      }
    },

    inject: ["api_url"],
    mounted() {

      this.login_check()



    },

    created() {




    },

    components: {

      navbar: () => import( /* webpackPreload: true */ /* webpackChunkName: 'navbar' */ './navbar.vue'),
      user_sub: () => import( /* webpackPreload: true */ /* webpackChunkName: 'user' */ './user_sub.vue')


    }
  }
</script>


<style lang="scss" scoped>

</style>