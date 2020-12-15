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

      send_reg: function () {

        const re = /^[\d|a-zA-Z]+$/

        if (this.user_name == null || this.user_passowrd == null) this.account_check = "帳號或密碼為空"
        else if (!re.test(this.user_name) && !re.test(this.user_passowrd)) this.account_check = "帳號或密碼格式錯誤"
        else if (this.user_name.length < 5) this.account_check = "帳號長度太短，需大於五"
        else if (this.user_passowrd.length < 5) this.account_check = "密碼長度太短，需大於五"
        else if (this.user_passowrd == this.user_passowrd_check)

        {
          this.axios.post(this.api_url + "/account/register", {
            user_name: this.user_name,
            user_passowrd: this.user_passowrd
          }).then((response) => {
            this.account_check = response["data"]
          });

        } else {

          this.account_check = "資料輸入錯誤"
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
<style lang="scss" scoped>
  @mixin mobile {
    @media screen and (max-width:560px) {
      @content;
    }
  }


  .reg {
    background-color: #2c3338;
    color: #606468;
    width: 100%;
    max-width: 800px;
    border-radius: 20px;
    text-align: center;
    padding: 50px;
    margin: 0 auto;


    @include mobile {
      padding: 10px;

    }
  }

  .reg_box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    width: 400px;
    margin: 0 auto;

    @include mobile {
      width: 100%;

    }
  }

  .reg_title {
    color: #fff;
    font-size: 3rem;
    text-align: center;
    padding-bottom: 50px;

  }

  .reg_account_box,
  .reg_password_box {

    flex: 1;
    margin-bottom: 50px;
    display: flex;
    border-radius: 10px;
    overflow: hidden;

    span {
      display: inline-block;

      img {
        width: 50px;
        background: #747474;
      }
    }

    input {
      border-style: none;
      border: none;
      height: 50px;
      width: calc(100% + -50px);
      font-size: 2rem;
      padding: 10px;
    }

    input:focus {
      background: #fff4bd;
      outline: none;
    }

    span {
      display: inline-block;
    }

  }

  .reg_input_button {
    width: 100%;
    background-color: #4be6fe;
    border-style: none;
    border: none;
    border-radius: 8px;
    font-size: 2rem;
    color: #fff;
    font-weight: 900;

    @include mobile {

      background-color: #ffda6d;
    }
  }

  .account_check {

    margin-bottom: 20px;
    color: #fff;

  }


  .switch_register {
    margin-top: 20px;
    color: #fff;
    cursor: pointer;
  }
</style>