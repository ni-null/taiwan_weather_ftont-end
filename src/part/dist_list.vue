<template>
  <div>
    <div class="info_box_title_box">
      <router-link :to="{ path: './' }">
        <div class="h4 hover">
          <img id="local_icon" :src="require('../img/svg/back.svg')" />
          <span>返回</span>
        </div>
      </router-link>

      <div class="title_box_title">
        <h2 @click="switch_dist_list">
          <span> {{city_name_che}}</span>
          {{ route_dist }}
        </h2>

        <div @click="sub_button" class="sub_button">
          <div class="sub_text"> {{check_sub_stats_text}}</div>
          <img v-show="check_sub_stats" :src="require('../img/svg/favorite.svg')" />
          <img v-show="!check_sub_stats" :src="require('../img/svg/un_favorite.svg')" />
        </div>

      </div>
    </div>

    <!--  標題/縣市列表 -->

    <!--  標題/縣市列表 -->

    <!--  鄉鎮列表 -->
    <transition name="fade">

      <div class="dist_list" v-show="show_dist_list">
        <div class="dist_name">
          {{city_name_che}}
        </div>
        <div v-for="item in dist_list" :key="item.id" class="city_button">
          <router-link :to="{ path: item.dist }">
            {{ item.dist }}
          </router-link>
        </div>
      </div>
    </transition>
    <!--  鄉鎮列表 -->
  </div>
</template>

<script>
  const citys_json = require("../json/citys_list.json");
  const dist_json = require("../json/dist_list.json");

  export default {
    data() {
      return {
        //縣市中文
        city_name_che: null,

        //地區列表
        dist_list: [],

        show_list: false,
        show_dist_list: true,


        //路由
        route_dist: null,
        route_city: null,


        //訂閱
        check_sub_stats: false,
        check_sub_stats_text: "未訂閱"

      };
    },
    inject: ["api_url"],
    props: {
      dist_weathers: Object
    },

    methods: {


      //顯示切換 - 鄉鎮列表
      switch_dist_list: function () {
        this.show_dist_list = !this.show_dist_list;
        if (this.show_dist_list) this.show_list = false;
      },


      //訂閱按鈕 檢查合法性
      sub_button: function () {


        const city = this.route_city
        const dist = this.route_dist


        //檢查城市和鄉鎮是否存在及當前訂閱狀態
        for (let i = 0; i < dist_json.length; i++) {
          if (dist_json[i].eng == city) {




            for (let i = 0; i < dist_json.length; i++) {
              if (dist_json[i].eng == city) {




                for (let a = 0; a < dist_json[i].dist.length; a++) {
                  if (dist_json[i].dist[a] == dist) {
                    if (this.check_sub_stats) this.delete_sub(city + "/" + dist)
                    if (!this.check_sub_stats) this.send_sub(city + "/" + dist)
                    return
                  }

                }


              }
            }



          }
        }

      },
      //發送訂閱 發送訂閱
      send_sub: async function (sub_data) {


        const response = await this.axios.put(this.api_url + "/account/user/sub", {
          sub_data: sub_data,
        })


        //失敗
        if (!response["data"]) return

        //登入失敗
        if (response["data"] == "login_fail") {
          $cookies.remove('user')
          this.login_user = null,
            this.$router.push({
              path: '/account/'
            })
        }

        //達到上限
        else if (response["data"] == "max") {

          console.log("達到上限值")

        }
        //訂閱成功重新取得狀態
        else {
          this.get_sub()
        }


      },
      //獲取訂閱內容
      get_sub: async function () {



        const response = await this.axios.get(this.api_url + "/account/user/sub")

        //失敗返回
        if (!response["data"]) return

        //登入失敗
        if (response["data"] == "login_fail") {
          //   
          this.check_sub_stats = false
          this.check_sub_stats_text = "未訂閱"
          $cookies.remove('user')
        }

        //成功
        else {
          this.check_sub_stats = false
          this.check_sub_stats_text = "未訂閱"
          response["data"].forEach(e => {
            if (this.route_city + '/' + this.route_dist == e.sub) {
              this.check_sub_stats = true
              this.check_sub_stats_text = "已訂閱"
            }
          });


        }

      },
      //刪除訂閱
      delete_sub: async function (sub_data) {

        const data = {
          data: {
            sub: sub_data
          }
        }

        const response = await this.axios.delete(this.api_url + "/account/user/sub", data)

        //失敗返回
        if (!response["data"]) return

        //登入失敗
        if (response["data"] == "login_fail") {
          $cookies.remove('user')
        }

        //取得訂閱狀態
        this.get_sub()

      }
    },

    mounted() {



      //從路由獲取城市
      this.route_city = this.$route.params.city;
      this.route_dist = this.$route.params.dist;
      this.city_name_che = citys_json[2][0][this.route_city]



      //獲取鄉鎮列表
      for (let i = 0; i < dist_json.length; i++) {
        if (dist_json[i].eng == this.route_city) {
          dist_json[i].dist.forEach(e => {
            this.dist_list.push({
              city: this.route_city,
              dist: e,
            })
          });
        }
      }

      //獲取訂閱狀態
      this.get_sub()



    },
  };
</script>