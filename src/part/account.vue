<template>
  <div>



    <div class="main_box">
      <transition name="bob">

        <div class="account_box" v-show="ani_show">

          <account_register v-if="show!='login'" @child_show="child_show"></account_register>
          <account_login v-if="show=='login'" @child_show="child_show"></account_login>

        </div>
      </transition>
    </div>

  </div>
</template>

<script>
  import '../css/account.scss'
  export default {
    data() {
      return {
        show: 'login',
        login_check_result: null,
        //特效
        ani_show: false

      }
    },

    methods: {


      //登入驗證
      login_check: async function () {

        if (this.$cookies.get('user') != null) {

          const response = await this.axios.get(this.api_url + "/account/login", {
            cache: false
          })

          //成功
          if (response["data"]) {
            this.login_check_result = response["data"]
            this.$router.push({
              path: '/account/user'
            })
          }
          //失敗
          else {
            this.$cookies.remove('user')
          }
        }




      },
      child_show: function (value) {
        this.show = value
      }
    },

    inject: ["api_url", "remove_loading"],
    mounted() {

      this.login_check()


    },

    components: {

      account_register: () => import( /* webpackPreload: true */ /* webpackChunkName: 'account' */
        "./account_register.vue"),
      account_login: () => import( /* webpackPreload: true */ /* webpackChunkName: 'account' */ "./account_login.vue"),

    }

    ,
    created() {

      setInterval(() => {
        this.ani_show = true
      }, 0);
      this.remove_loading()

    }
  };
</script>