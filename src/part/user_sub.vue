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

  const axios_cache = setup({
    cache: {
      maxAge: 0
    }
  })

  export default {
    data() {
      return {

        user_subs: []
      }
    },

    methods: {

      //獲取訂閱
      get_sub: async function () {

          const response = await axios_cache.get(this.api_url + "/account/user/sub", {
            maxAge: 0
          })

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

        ,

      delete_sub: async function (item) {


        const response = await
        this.axios.delete(this.api_url + "/account/user/sub", {
          data: {
            sub: item
          }
        })
        this.get_sub()

      }



    },

    inject: ["api_url"],
    mounted() {

      this.get_sub()

    },


  };
</script>