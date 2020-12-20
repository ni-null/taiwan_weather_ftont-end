<template>
  <div>
    <div class="info_box_title_box">
      <div class="h4 hover" @click="switch_dist_list">
        <img id="local_icon" :src="require('../img/svg/down.svg')" />
        <span>鄉鎮天氣</span>
      </div>

      <div class="title_box_title">

        <h2 @click="switch_list()">{{ list_now_title }} </h2>

        <div @click="sub_button" class="sub_button">
          <div class="sub_text"> {{check_sub_stats_text}}</div>
          <img v-show="check_sub_stats" :src="require('../img/svg/favorite.svg')" />
          <img v-show="!check_sub_stats" :src="require('../img/svg/un_favorite.svg')" />
        </div>


      </div>
    </div>

    <!--  標題/縣市列表 -->
    <transition name="fade">
      <div v-if="show_list" class="location_show">
        <div @click="switch_city_list(index)" v-for="(item, index) in citys_list" :key="item.id"
          class="citys_list_title">
          {{ item.name }}
        </div>
      </div>

    </transition>


    <div @click=" switch_city_list(index)" v-for="(item, index) in citys_list" :key="item.id">
      <div v-if="show_dist_child[index]" class="citys_list">
        <div @click="switch_router(child.eng)" v-for="child in item.child" :key="child.id" class="citys_list_child">
          {{ child.che }}
        </div>
      </div>
    </div>


    <!--  標題/縣市列表 -->

    <!--  鄉鎮列表 -->
    <transition name="fade">
      <div class="dist_list" v-if="show_dist_list">
        <div v-for="item in dist_list" :key="item" id="city_button">
          <router-link :to="{ path:  '/weather/'+route_city+'/' + item}">
            {{ item}}
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

        //
        route_city: null,
        //標題
        list_now_title: null,
        //地區
        dist_list: null,
        citys_list: [],

        //列表切換
        show_dist_child: {
          0: false,
          1: false,
          2: false,
          3: false,
          4: false,
        },
        show_list: false,
        show_dist_list: true,
        check_sub_stats: false,
        check_sub_stats_text: "未訂閱"
      };
    },
    inject: ["api_url"],

    methods: {
      //顯示切換 - 北中南東
      switch_list: function () {
        this.show_list = !this.show_list;
        if (this.show_list) this.show_dist_list = false;
      },

      //顯示切換 - 北中南東 個別
      switch_city_list: function (a) {

        for (let index in this.show_dist_child) {
          if (index != a) this.show_dist_child[index] = false
        }

        this.show_dist_child[a] = !this.show_dist_child[a];

      },

      //顯示切換 - 鄉鎮列表
      switch_dist_list: function () {
        this.show_dist_list = !this.show_dist_list;
        if (this.show_dist_list) this.show_list = false;
      },

      //切換城市路由
      switch_router: function (city_eng) {
        this.$router.push("/weather/" + city_eng);
      },


      //訂閱按鈕 檢查合法性
      sub_button: function () {


        const city = this.route_city

        //檢查城市是否存在及當前訂閱狀態
        for (let i = 0; i < dist_json.length; i++) {
          if (dist_json[i].eng == city) {
            if (this.check_sub_stats) this.delete_sub(city)
            if (!this.check_sub_stats) this.send_sub(city)
            return
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
            if (this.route_city == e.sub) {
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

      this.get_sub()
      // this.$forceUpdate();

      this.route_city = this.$route.params.city;

      this.citys_list = citys_json[0];

      //透過路由獲取地名
      this.list_now_title = Object.keys(citys_json[1][0]).find(
        (key) => citys_json[1][0][key] === this.$route.params.city
      );
      //獲取鄉鎮
      dist_json.forEach(e => {
        if (e.name == this.list_now_title)
          this.dist_list = e.dist
      })

    },
  };
</script>