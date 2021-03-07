<template>
  <div>


    <!-- 訂閱提示 -->
    <transition name="bob_sub">
      <div class="sub_info_box">
        <div v-show="sub_info_show" class="sub_info">
          <p> {{sub_info}}</p>
        </div>
      </div>
    </transition>
    <!-- 訂閱提示 -->


    <!--  標題/縣市列表 -->
    <div class="info_box_title_box">
      <router-link :to="{ path:  '/weather/'+route_city+'/' +dist}">
        <div class="h4 hover">
          <img id="local_icon" :src="require('../img/svg/dist.svg')" />
          <span>鄉鎮天氣</span>
        </div>
      </router-link>
      <div class="title_box_title">

        <transition name="load">




          <div class="title_city">
            <p> {{ city_name_che }}</p>
          </div>



        </transition>

        <div @click="sub_button" class="sub_button">
          <div class="sub_text"> {{check_sub_stats_text}}</div>

          <img v-show="check_sub_stats" :src="require('../img/svg/favorite.svg')" />


          <img v-show="!check_sub_stats" :src="require('../img/svg/un_favorite.svg')" />

        </div>


      </div>
    </div>
    <!--  標題/縣市列表 -->

    <!--  區域選單 (北中南東外) -->

    <transition name="down">
      <div class="location_show">
        <div v-for="(item, index) in citys_list" :key="item.id" class="citys_list_title_box">

          <div @click="switch_city_list(index)" class="citys_list_title">
            <p> {{ item.name }} </p>
          </div>


        </div>

      </div>

    </transition>

    <!--  區域選單 (北中南東外) -->


    <!--  縣市選單 -->


    <div class="citys_list">
      <div v-for="(item, index) in select" :key="index">
        <transition name="bob_mobile">
          <div class="citys_list_child" @click="switch_city(item.eng)" v-show="select_ani">
            {{ item.che }}
          </div>
        </transition>
      </div>
    </div>


    <!--  縣市選單 -->




  </div>
</template>

<script>
  const citys_json = require("../json/citys_list.json");
  const dist_json = require("../json/dist_list.json");

  export default {
    data() {
      return {

        //路由名，英文
        route_city: null,
        //標題中文地名
        city_name_che: null,
        //預設進入地區
        dist: null,

        //縣市列表
        citys_list: [],

        //訂閱
        check_sub_stats: false,
        check_sub_stats_text: "未訂閱",

        //列表切換
        show_list: true,
        select: null,
        select_ani: false,

        //訂閱提示
        sub_info_show: false,
        sub_info: null

      };
    },
    inject: ["api_url"],

    methods: {

      /* 顯示切換 - 北中南東 個別 */
      switch_city_list: function (a) {

        //動畫切換
        this.select_ani = false
        this.select = this.citys_list[a].child

        setTimeout(() => {
          this.select_ani = true
        }, 100)
      },



      /*  切換城市 */
      switch_city: function (city_eng) {

        //路由推送
        history.pushState(null, null, city_eng);
        this.$emit('switch_city', city_eng)

        //修改標題
        this.city_name_che = citys_json[2][0][city_eng]
        this.route_city = city_eng

        //重新獲取訂閱狀態
        this.get_sub()

        //獲取第一個鄉鎮名稱
        dist_json.find(e => {
          if (e.name == this.city_name_che)
            this.dist = e.dist[0]
        })

      },


      //訂閱按鈕 檢查合法性
      sub_button: function () {

        //檢查城市是否存在及當前訂閱狀態
        for (let i = 0; i < dist_json.length; i++) {
          if (dist_json[i].eng == this.route_city) {
            if (this.check_sub_stats) this.delete_sub(this.route_city)
            if (!this.check_sub_stats) this.send_sub(this.route_city)
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
        } else if (response["data"] == "max") {


          //訂閱
          this.sub_info = "訂閱已達上限"

          //動畫
          this.sub_info_ani()

        } else {

          //訂閱
          this.sub_info = "成功訂閱"

          //動畫
          this.sub_info_ani()

          //獲取訂閱狀態
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

        const data = {
          data: {
            sub: sub_data
          }
        }

        const response = await this.axios.delete(this.api_url + "/account/user/sub", data)


        //訂閱
        this.sub_info = "取消訂閱"

        //動畫
        this.sub_info_ani()

        //獲取狀態
        this.get_sub()

      },
      //提示動畫
      sub_info_ani: function () {

        this.sub_info_show = true

        setTimeout(
          () => {
            this.sub_info_show = false
          },
          1000
        )

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