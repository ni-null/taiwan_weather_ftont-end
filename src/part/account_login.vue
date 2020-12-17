<template>
  <div>

    <div class="login">

      <div class="login_title"> 登入帳號 </div>


      <div class="login_box">

        <div class="login_account_box">
          <span> <img :src="require('../img/svg/account.svg')" />
          </span>
          <input type="text" v-model="user_name" placeholder="Account">

        </div>


        <div class="login_password_box">
          <span> <img :src="require('../img/svg/lock.svg')" />
          </span>
          <input type="text" v-model="user_passowrd" placeholder="Password">
        </div>
        <div>
          <input class="login_input_button" type="button" value="登入" @click="send_login">
        </div>

        <div class=" switch_register" @click="switch_register">

          沒有帳號 ? 立即註冊

        </div>

      </div>



      <div class="login_check">

        {{login_check}}
      </div>


    </div>




  </div>
</template>

<script>
  export default {
    data() {
      return {

        user_name: null,
        user_passowrd: null,
        user_passowrd_check: null,
        login_check: null

      };
    },

    methods: {

      send_login: async function () {



        const response = await this.axios.post(this.api_url + "/account/login", {
          user_name: this.user_name,
          user_passowrd: this.user_passowrd
        })


        if (response["data"] == "login_fail")
          this.login_check = "登入失敗"
        else {
          $cookies.set('user', this.user_name)
          this.$router.push({
            path: '/account/user/'
          })
        }

      },
      switch_register: function () {

        this.$emit('child_show', null)

      }

    },

    inject: ["api_url"],
    mounted() {




    },
  };
</script>