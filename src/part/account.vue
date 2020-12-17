<template>
  <div>

    <navbar></navbar>
    <div class="main_box">


      <transition name="fade_long" mode="out-in">
        <account_register v-if="show!='login'" @child_show="child_show"></account_register>
        <account_login v-if="show=='login'" @child_show="child_show"></account_login>
      </transition>
      132
    </div>

  </div>
</template>

<script>
  import '../css/account.scss'
  export default {
    data() {
      return {
        show: 'login',
        login_check_result: null

      }
    },

    methods: {


      //登入驗證
      login_check: async function () {

        const response = await this.axios.get(this.api_url + "/account/login", {
          cache: false
        })

        //成功
        if (response["data"] != 'error') {
          this.login_check_result = response["data"]
          this.$cookies.set('user', this.login_check_result) //return this
          this.$router.push({
            path: '/account/user'
          })
        }
        //失敗
        else {
          this.$cookies.remove('user')
        }


      },
      child_show: function (value) {
        this.show = value
      }
    },

    inject: ["api_url"],
    mounted() {

      this.login_check()


    },

    components: {

      account_register: () => import("./account_register.vue"),
      account_login: () => import("./account_login.vue"),
      navbar: () => import( /* webpackPreload: true */ /* webpackChunkName: 'navbar' */ './navbar.vue'),


    }
  };
</script>