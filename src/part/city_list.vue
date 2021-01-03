<template>
  <div>
    <div class="info_box_title_box">
      <router-link :to="{ path:  '/weather/'+route_city+'/' +dist}">
        <div class="h4 hover">
          <img id="local_icon" :src="require('../img/svg/dist.svg')" />
          <span>鄉鎮天氣</span>
        </div>
      </router-link>
      <div class="title_box_title">

        <transition name="load">
          <h2 v-show="city_name_che">
            {{ city_name_che }}
          </h2>
        </transition>

        <div @click="sub_button" class="sub_button">
          <div class="sub_text"> {{check_sub_stats_text}}</div>

          <img v-show="check_sub_stats" :src="require('../img/svg/favorite.svg')" />


          <img v-show="!check_sub_stats" :src="require('../img/svg/un_favorite.svg')" />

        </div>


      </div>
    </div>

    <!--  地區列表 -->

    <transition name="down">
      <div class="location_show">
        <div v-for="(item, index) in citys_list" :key="item.id" class="citys_list_title_box">

          <div @click="switch_city_list(index)" class="citys_list_title">
            <p> {{ item.name }} </p>
          </div>


        </div>

      </div>

    </transition>

    <!--  地區列表 -->


    <!--  標題/縣市列表 -->


    <div class="citys_list">
      <div v-for="(item, index) in select" :key="index">
        <transition name="bob_mobile">
          <div class="citys_list_child" @click="switch_router(item.eng)" v-show="select_ani">
            {{ item.che }}
          </div>
        </transition>
      </div>
    </div>


    <!--  標題/縣市列表 -->




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
        //標題中文地名
        city_name_che: null,
        //預設進入地區
        dist: null,
        //
        citys_list: [],

        //列表切換
        show_list: true,
        check_sub_stats: false,
        check_sub_stats_text: "未訂閱",
        select: null,
        select_ani: false

      };
    },
    inject: ["api_url"],

    methods: {

      //顯示切換 - 北中南東 個別
      switch_city_list: function (a) {

        document.querySelector(".citys_list").classList.add('citys_list_height')
        this.select_ani = false

        this.select = this.citys_list[a].child


        setTimeout(() => {
          this.select_ani = true
        }, 100)
      },



      //切換城市路由
      switch_router: function (city_eng) {

        if (city_eng != this.route_city)
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

      //獲取訂閱
      this.get_sub()


      //路由
      this.route_city = this.$route.params.city;
      this.citys_list = citys_json[0];



      //獲取中文名
      this.city_name_che = citys_json[2][0][this.route_city]


      //獲取第一個鄉鎮名稱
      dist_json.find(e => {
        if (e.name == this.city_name_che)
          this.dist = e.dist[0]
      })


    },
  };
</script>