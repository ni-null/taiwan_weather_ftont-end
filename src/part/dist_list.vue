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
        <h2 @click="switch_dist_list">{{ list_now_title }} </h2>

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
      <div class="dist_list" v-if="show_dist_list">
        <div v-for="item in dist_list" :key="item.id" id="city_button">
          <router-link :to="{ path: item.dist }" class="btn btn-primary">
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
        //標題
        list_now_title: null,

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
      //顯示切換 - 北中南東
      switch_list: function () {
        this.show_list = !this.show_list;
        if (this.show_list) this.show_dist_list = false;
      },

      //顯示切換 - 北中南東 個別
      switch_city_list: function (a) {
        this.show_dist_child[a] = !this.show_dist_child[a];
      },

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

        if (response["data"] == "login_fail") {
          $cookies.remove('user')
          this.login_user = null,
            this.$router.push({
              path: '/account/'
            })
        } else {
          this.get_sub()
        }


      },
      //獲取訂閱內容
      get_sub: async function () {

        const response = await this.axios.get(this.api_url + "/account/user/sub")

        if (response["data"] == "login_fail") {
          $cookies.remove('user')
        } else {
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


        const response = await
        this.axios.delete(this.api_url + "/account/user/sub", {
          data: {
            sub: sub_data
          }
        })
        this.get_sub()

      }
    },

    mounted() {


      this.route_city = this.$route.params.city;
      this.route_dist = this.$route.params.dist;

      this.get_sub()
      //透過路由獲取地名
      this.list_now_title = this.route_dist;





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


    },
  };
</script>