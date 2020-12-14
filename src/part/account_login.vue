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

      send_login: function () {



        this.axios.post(this.api_url + "/account/login", {
          user_name: this.user_name,
          user_passowrd: this.user_passowrd
        }).then((response) => {


          if (response["data"] == "login_fail")

            this.login_check = "登入失敗"

          else {


            this.$emit('after_login', 'success')

            //登入成功後轉跳

            this.$router.push({
              path: '/account/user/'
            })

          }

        });
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

<style lang="scss" scoped>
  @mixin mobile {
    @media screen and (max-width:560px) {
      @content;
    }
  }


  .login {
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

  .login_box {
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

  .login_title {
    color: #fff;
    font-size: 3rem;
    text-align: center;
    padding-bottom: 50px;

  }

  .login_account_box,
  .login_password_box {

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

  .login_input_button {
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

  .login_check {

    margin-top: 10px;
    color: #fff;

  }


  .switch_register {
    margin-top: 20px;
    color: #fff;
    cursor: pointer;
  }
</style>