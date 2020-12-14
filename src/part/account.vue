<template>
  <div>

    <div class="main_box">



      <account_register v-if="show!='login'"></account_register>

      <account_login v-if="show=='login'" @child_show="child_show"></account_login>




    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: 'login',
        login_check: null

      }
    },

    methods: {


      child_show: function (value) {
        this.show = value
        console.log(value)
      }
    },

    inject: ["api_url"],
    mounted() {

      this.after_login()

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