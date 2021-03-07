<template>
  <div>


    <div class="main_box">

      <dist_list @switch_dist="switch_dist"></dist_list>




      <div id="Element_loding">
        <div class="loading">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <!--  縣市列表 -->
      <transition name="bob_mobile">
        <div class="city_box" v-show="dist_weathers" :key="key">
          <div class="other_box city_box_item city_other_box">

            <transition name="fade">



              <div class="other_box_title">
                <div v-for="(item) in dist_weathers" :key="item.id">


                  <p v-if="item.show_day">

                    <span v-if="item.day_1 != ''"> {{ item.day_1 }}({{ item.day_2 }}) </span>
                    <span v-else-if="item.day_1 == ''">星期{{ item.day_2 }}</span>
                    <span> {{ item.time_1 }}</span>

                  </p>


                  <div class="flex_box_2">

                    <div class="flex_box_2_item_1"> {{ item.time_2 }} </div>

                    <div class="flex_box_2_item_2">
                      <img :src="require('../img/svg/temp.svg')" />
                      <span> {{ item.temp }}</span>
                    </div>

                    <div class="flex_box_2_item_3">
                      <img :src="   require('../img/svg/static_icon/' + item.WD_code + '.svg') " />
                      <span> {{ item.WD }}</span>
                    </div>

                  </div>


                </div>

              </div>
            </transition>

          </div>

          <div class="city_box_item">
            <dist_chart :dist_weathers="dist_weathers" v-if="dist_weathers" :key="key"></dist_chart>
          </div>

        </div>
      </transition>

      <!--  縣市列表 -->
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //完整天氣
        dist_full_weathers: null,
        //選定的鄉鎮天氣
        dist_weathers: null,
        //鄉鎮列表
        city_data: null,

        //key 
        key: null

      };
    },
    inject: ["api_url", "remove_loading"],

    components: {
      dist_list: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_list.vue'),
      dist_chart: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_chart.vue'),
    },
    methods: {

      //子組件傳值後切換地區

      switch_dist: function (dist) {

        this.key = dist
        this.set_weather(dist)
      },


      //顯示日期
      show_day: function () {
        if (this.dist_weathers[1].time_1 == this.dist_weathers[2].time_1) {



          if (this.dist_weathers[0].time_1 != this.dist_weathers[1].time_1) {

            this.dist_weathers[0].show_day = this.dist_weathers[1].show_day = this.dist_weathers[3].show_day =
              this.dist_weathers[5].show_day = true;

          } else {
            this.dist_weathers[0].show_day = this.dist_weathers[3].show_day = this.dist_weathers[5].show_day = true;

          }


        } else if (this.dist_weathers[0].time_1 == this.dist_weathers[1].time_1) {

          this.dist_weathers[0].show_day = this.dist_weathers[2].show_day = this.dist_weathers[4].show_day = this
            .dist_weathers[6].show_day =
            true;

        } else {
          this.dist_weathers[0].show_day = this.dist_weathers[1].show_day = this.dist_weathers[3].show_day = this
            .dist_weathers[5].show_day =
            true;

        }
      },

      //天氣

      set_weather: function (dist) {
        //天氣篩選
        this.dist_weathers = this.dist_full_weathers.filter(function (item) {
          return item.cityname == dist;
        });

        this.dist_weathers.splice(7, 8);

        //key

        this.key = dist

        //添加判斷顯示
        this.show_day()
      }


    },
    provide() {
      return {
        city_data: this.city_data,
      };
    },
    async mounted() {
      const route_dist = this.$route.params.dist;
      const route_city = this.$route.params.city;

      const response = await this.axios.get(this.api_url + "/city/" + route_city)


      //組件傳遞的資料
      this.city_data = response["data"];


      this.dist_full_weathers = response["data"]

      this.set_weather(route_dist)


      //移除載入前效果
      document.getElementById("Element_loding").remove();


    },

    components: {
      dist_list: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_list.vue'),
      dist_chart: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_chart.vue'),

    },
    created() {

      this.remove_loading()
    },




  };
</script>