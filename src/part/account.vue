<template>
  <div>

    <div class="main_box">





      <transition name="fade_long" mode="out-in">
        <account_register v-if="show!='login'" @child_show="child_show"></account_register>
        <account_login v-if="show=='login'" @child_show="child_show"></account_login>
      </transition>

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


      //登入驗證
      login_check: function () {

        this.axios.post(this.api_url + "/account/login_check")
          .then((response) => {


            if (response["data"] != 'error') {
              this.login_check_result = response["data"]
              this.$router.push({
                path: '/account/user'
              })
            } else {

            }
            //if

          });
      },
      child_show: function (value) {
        this.show = value
        console.log(value)
      }
    },

    inject: ["api_url"],
    mounted() {

      this.login_check()

    },

    components: {

      account_register: () => import("./account_register.vue"),
      account_login: () => import("./account_login.vue")


    }
  };
</script>


<style lang="scss" scoped>
  .main_box {
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;


  }
</style>

</style>