<template>






  <div class="sub_list">

    <h2> 你的訂閱內容</h2>


    <div class="sub_item_box" v-for="(item, index) in user_subs" :key="index">
      <div class="sub_item_text" @click="route_to(item.eng)"> {{ item.che }}</div>
      <div class="sub_item_button">
        <button @click="delete_sub(item.eng)"> <img id="remove" :src="require('../img/svg/remove.svg')" />
          <p>刪除 </p>
        </button>

      </div>

    </div>





  </div>




</template>

<script>
  const city_list = require('../json/citys_list.json')[2][0]
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

              let sub = e.sub.split("/")


              let che = city_list[sub[0]]


              if (sub[1]) {
                data.push({
                  che: che + "-" + sub[1],
                  eng: sub[0] + "/" + sub[1]
                })
              } else {
                data.push({
                  che: che,
                  eng: sub[0]
                })

              }




            });

            this.user_subs = data


          }

        }

        ,

      //刪除訂閱
      delete_sub: async function (item) {


          const response = await
          this.axios.delete(this.api_url + "/account/user/sub", {
            data: {
              sub: item
            }
          })
          this.get_sub()

        }

        //路由轉跳
        ,
      route_to: function (url) {
        this.$router.push({
          path: `/weather/${url}`
        })
      }



    },

    inject: ["api_url"],
    mounted() {

      this.get_sub()

    },


  };
</script>