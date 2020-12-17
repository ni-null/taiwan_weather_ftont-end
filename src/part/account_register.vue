<template>
  <div>



    <div class="reg">

      <div class="reg_title"> 註冊帳號 </div>


      <div class="reg_box">

        <div class="reg_account_box">
          <span> <img :src="require('../img/svg/account.svg')" />
          </span>
          <input type="text" v-model="user_name" placeholder="Account">

        </div>


        <div class="reg_password_box">
          <span> <img :src="require('../img/svg/lock.svg')" />
          </span>
          <input type="text" v-model="user_passowrd" placeholder="Password">
        </div>

        <div class="reg_password_box">
          <span> <img :src="require('../img/svg/lock.svg')" />
          </span>
          <input type="text" v-model="user_passowrd_check" placeholder="Password_Check">
        </div>
        <div class="account_check">
          {{account_check}}
        </div>
        <div>
          <input class="reg_input_button" type="button" value="註冊" @click="send_reg">
        </div>

        <div class=" switch_register" @click="switch_login">

          已經有帳號 ? 立即登入!

        </div>

      </div>






    </div>
    <!--    
    帳號
    <input type="text" v-model="user_name">

    密碼
    <input type="text" v-model="user_passowrd">

    <input type="button" value="送出" @click="restgist">

    <p>

      {{account_check}}
    </p> -->

  </div>
</template>

<script>
  export default {
    data() {
      return {

        user_name: null,
        user_passowrd: null,
        user_passowrd_check: null,
        account_check: null

      };
    },
    methods: {

      send_reg: async function () {

        const re = /^[\d|a-zA-Z]+$/

        if (this.user_name == null || this.user_passowrd == null) this.account_check = "帳號或密碼為空"
        else if (!re.test(this.user_name) && !re.test(this.user_passowrd)) this.account_check = "帳號或密碼格式錯誤"
        else if (this.user_name.length < 5) this.account_check = "帳號長度太短，需大於五"
        else if (this.user_passowrd.length < 5) this.account_check = "密碼長度太短，需大於五"
        else if (this.user_passowrd == this.user_passowrd_check)

        {

          const response = await this.axios.post(this.api_url + "/account/register", {
            user_name: this.user_name,
            user_passowrd: this.user_passowrd
          })

          this.account_check = response["data"]


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