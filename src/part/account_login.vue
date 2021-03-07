<template>
  <div class="account_info_box">

    <div class="account_info_title"> 登入帳號 </div>


    <div class="account_main_box">

      <div class="account_type_box">
        <div> <img :src="require('../img/svg/account.svg')" />
        </div>
        <input type="text" v-model="user_name" placeholder="Account">

      </div>


      <div class="account_type_box">
        <div> <img :src="require('../img/svg/lock.svg')" />
        </div>
        <input type="text" v-model="user_password" placeholder="Password">
      </div>
      <div>
        <input class="account_input_button " type="button" value="登入" @click="send_login">
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
  import md5 from 'md5'
  import bus from '../js/bus'

  export default {
    data() {
      return {

        user_name: null,
        user_password: null,
        user_password_check: null,
        login_check: null

      };
    },

    methods: {

      send_login: async function () {


        const data = {
          user_name: this.user_name,
          user_password: md5(this.user_password)
        }

        const response = await this.axios.post(this.api_url + "/account/login", data)


        if (!response["data"])
          this.login_check = "登入失敗"
        else {

          this.$cookies.set('user', this.user_name, 60 * 60 * 24 * 2) //兩天過期
          bus.$emit('login', true)
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