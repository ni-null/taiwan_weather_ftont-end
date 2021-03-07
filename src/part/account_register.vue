<template>
  <div class="account_info_box">



    <div class="account_info_title"> 註冊帳號 </div>


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

      <div class="account_type_box">
        <div> <img :src="require('../img/svg/lock.svg')" />
        </div>
        <input type="text" v-model="user_password_check" placeholder="Password_Check">
      </div>
      <div class="account_check">
        {{account_check}}
      </div>
      <div>
        <input class="account_input_button" type="button" value="註冊" @click="send_reg">
      </div>

      <div class=" switch_register" @click="switch_login">

        已經有帳號 ? 立即登入!

      </div>

    </div>







  </div>
</template>

<script>
  import md5 from 'md5'
  export default {
    data() {
      return {

        user_name: null,
        user_password: null,
        user_password_check: null,
        account_check: null

      };
    },
    methods: {

      send_reg: async function () {

        const re = /^[\d|a-zA-Z]+$/

        if (this.user_name == null || this.user_password == null) this.account_check = "帳號或密碼為空"
        else if (!re.test(this.user_name) && !re.test(this.user_password)) this.account_check = "帳號或密碼格式錯誤"
        else if (this.user_name.length < 5) this.account_check = "帳號長度太短，需大於五"
        else if (this.user_password.length < 5) this.account_check = "密碼長度太短，需大於五"
        else if (this.user_password == this.user_password_check)

        {


          const response = await this.axios.post(this.api_url + "/account/register", {
            user_name: this.user_name,
            user_password: md5(this.user_password),
            bind_code: 'TG@' + md5(this.user_name).substr(0, 5)

          })

          if (!response["data"]) {
            this.account_check = "註冊失敗，請再試一次"
          } else if (response["data"] == 'user_have_exist') {
            this.account_check = "帳號已經存在，請使用其他用戶名"
          } else {
            this.account_check = "註冊成功"
            this.$router.push({
              path: '/account/user/'
            })
          }



        } else {

          this.account_check = "兩次密碼不一致"
        }



      },
      switch_login: function () {

        this.$emit('child_show', 'login')

      }

    },

    inject: ["api_url"],
    mounted() {

    },
  };
</script>