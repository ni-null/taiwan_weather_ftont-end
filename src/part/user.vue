<template>
  <div>

    <div class="main_box">


      <p>
        登入狀態 {{login_check}}
      </p>


      <input @click="delete_login" type="button" value="登出">

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


      //登入
      after_login: function () {

          this.axios.post(this.api_url + "/account/login_check")
            .then((response) => {


              if (response["data"] != 'error') {
                this.login_check = response["data"]

                console.log(this.login_check + 'cxc')
              } else {
                this.$router.push({
                  path: '/account/'
                })
              }
              //if

            });



          console.log(this.login_check)
          console.log('132')

        }

        ,

      //登出
      delete_login: function () {

          this.axios.delete(this.api_url + "/account/login")
            .then((response) => {
              console.log('登出')
              this.login_check = '尚未登入'

            });

          //登出後返回
          this.$router.push({
            path: '/account/'
          })
        }

        ,
      child_show: function (value) {
        this.show = value
        console.log(value)
      }
    },

    inject: ["api_url"],
    mounted() {

      this.after_login()

      //如果沒登入轉跳回登入頁面


    },

    created() {




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