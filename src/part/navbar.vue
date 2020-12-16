<template>
  <div>
    <nav>
      <router-link :to="{ path: '/'}">
        <span> Ninull天氣預報 </span>
      </router-link>
      登入訊息: {{this.login_user}}
      <input v-if="sub_show" @click="sub_button" type="button" value="訂閱">
      <router-link :to="{ path: '/account/user'}">
        <span> 用戶中心 </span>
      </router-link>
    </nav>
  </div>
</template>

<script>
  const dist_json = require("../json/dist_list.json");


  export default {


    data() {
      return {
        //路由名稱
        route_city: null,
        route_dist: null,
        sub_show: false,
        //
        login_user: null,
        login_check_result: null,
        //訂閱
        show_sub_button: null
      };
    },
    inject: ["api_url"],
    methods: {

      sub_button: function () {


        const city = this.route_city
        const dist = this.route_dist

        //檢查訂閱合法性
        if (this.$router.currentRoute.fullPath.split("/")[1] != "weather") return


        if (city !== null && dist == undefined) {
          for (let i = 0; i < dist_json.length; i++) {
            if (dist_json[i].eng == city) {
              this.send(city)
              return
            }
          }
        } else {
          for (let i = 0; i < dist_json.length; i++) {
            if (dist_json[i].eng == city) {
              this.send(city + '/' + dist)
              return
            }
          }

        }

        //檢查訂閱合法性

      },
      send: function (sub_data) {

        //發送訂閱
        this.axios.put(this.api_url + "/account/user/sub", {
            sub_data: sub_data,
          })
          .then((response) => {

              console.log(response["data"])
              if (response["data"] == "login_fail") {
                $cookies.remove('user')
                this.login_user = null,
                  this.$router.push({
                    path: '/account/'
                  })
              }

            }

          )
      }
    },
    mounted() {

      //


      this.route_dist = this.$route.params.dist;
      this.route_city = this.$route.params.city;

      if (this.$router.currentRoute.fullPath.split("/")[1] == "weather") this.sub_show = true


      //判斷cookie使否有使用者
      if ($cookies.get('user')) this.login_user = $cookies.get('user').split(":")[1]




    },
    created() {


    }
  };
</script>

<style lang="scss" scoped>

</style>