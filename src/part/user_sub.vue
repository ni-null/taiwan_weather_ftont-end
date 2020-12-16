<template>
  <div>

    <div v-for="item in user_subs" :key="item.id">
      {{ item }}
      <input @click="delete_sub(item)" type="button" value="刪除">
    </div>

  </div>
</template>

<script>
  import {
    setup
  } from 'axios-cache-adapter'



  export default {
    data() {
      return {

        user_subs: []
      }
    },

    methods: {

      //獲取定用
      get_sub: function () {

          this.axios.get(this.api_url + "/account/user/sub", {
              cache: false
            })
            .then((response) => {

                if (response["data"] == "login_fail") {
                  console.log('訂閱獲取失敗')
                  $cookies.remove('user')
                } else {
                  console.log('獲取成功')

                  let data = []

                  response["data"].forEach(e => {
                    data.push(e.sub)
                  });

                  this.user_subs = data

                  console.log(data)


                }

              }

            )
        }

        ,

      delete_sub: function (item) {

        console.log(item)


        this.axios.delete(this.api_url + "/account/user/sub",

          {
            data: {
              sub: item
            }
          }
        ).then((response) => {

            console.log(response["data"])

            this.get_sub()

          }

        )


      }



    },

    inject: ["api_url"],
    mounted() {


      this.get_sub()

    },

    created() {




    },

    components: {



    }
  };
</script>


<style lang="scss" scoped>

</style>

</style>