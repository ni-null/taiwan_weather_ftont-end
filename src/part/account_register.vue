<template>
  <div>

    帳號
    <input type="text" v-model="user_name">

    密碼
    <input type="text" v-model="user_passowrd">

    <input type="button" value="送出" @click="restgist">

    <p>

      {{account_check}}
    </p>

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

      restgist: function () {



        this.axios.post(this.api_url + "/account/register", {
          user_name: this.user_name,
          user_passowrd: this.user_passowrd
        }).then((response) => {
          //鄉鎮列表處理
          this.account_check = response["data"]


        });
      }

    },

    inject: ["api_url"],
    mounted() {





    },
  };
</script>

<style lang="stylus" scoped></style>