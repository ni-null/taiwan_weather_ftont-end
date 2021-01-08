<template>
  <div>

    <div class="main_box">

      <!--  縣市列表 -->
      <city_list @switch_city="switch_city"></city_list>
      <!--  縣市列表 -->

      <!--  動畫 -->
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
      <!--  動畫 -->

      <!--  天氣 -->
      <transition name="bob_mobile">
        <div class="city_box" v-show="city_weather" :key="key">

          <div class="other_box city_box_item city_other_box ">

            <div class="other_box_title" v-for="(item, index) in city_weather" :key="item.id">

              <p v-if="item.show_day">

                <span v-if="item.day_1 != ''"> {{ item.day_1 }}({{ item.day_2 }}) </span>
                <span v-else-if="item.day_1 == ''">星期{{ item.day_2 }}</span>

                <span> {{ item.time_1 }}</span>

              </p>

              <div class="flex_box_2">
                <div class="flex_box_2_item_1">
                  {{ item.time_2 }}
                </div>

                <div class="flex_box_2_item_2">
                  <img :src="require('../img/svg/temp.svg')" />

                  <span> {{ item.temp }}</span>
                </div>

                <div class="flex_box_2_item_3">
                  <img :src="
                    require('../img/svg/static_icon/' + item.WD_code + '.svg')
                  " />

                  <span> {{ item.WD }}</span>
                </div>
              </div>

            </div>

          </div>

          <div class="city_box_item">
            <city_chart :key="key" v-if="city_weather" :city_weather="city_weather"></city_chart>
          </div>

        </div>
      </transition>
      <!--  天氣 -->

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        //完整天氣
        full_city_weather: null,
        //選擇的天氣
        city_weather: null,
        //顯示列表
        show_list: false,
        //地區列表
        city_list: null,

        //key
        key: null,
        rwd: false
      };
    },
    inject: ["api_url", "remove_loading"],

    components: {

      city_chart: () => import( /* webpackPreload: true */ /* webpackChunkName: 'city' */ './city_chart.vue'),
      city_list: () => import( /* webpackPreload: true */ /* webpackChunkName: 'city' */ './city_list.vue'),

    },
    methods: {
      switch_list: function () {
        this.show_list = !this.show_list;
      },

      //判斷顯示日期與否
      show_day: function () {


        if (this.city_weather[1].time_1 == this.city_weather[2].time_1) {


          if (this.city_weather[0].time_1 != this.city_weather[1].time_1) {

            this.city_weather[0].show_day = this.city_weather[1].show_day = this.city_weather[3].show_day =
              this.city_weather[5].show_day = true;

          } else {
            this.city_weather[0].show_day = this.city_weather[3].show_day = this.city_weather[5].show_day =
              true;

          }


        } else if (this.city_weather[0].time_1 == this.city_weather[1].time_1) {

          this.city_weather[0].show_day = this.city_weather[2].show_day = this.city_weather[4].show_day = this
            .city_weather[6].show_day =
            true;

        } else {
          this.city_weather[0].show_day = this.city_weather[1].show_day = this.city_weather[3].show_day = this
            .city_weather[5].show_day =
            true;

        }

      },

      //天氣
      set_weather: function (city) {

        this.key = city

        //天氣篩選
        this.city_weather = this.full_city_weather.filter(
          (x) => x.cityname_eng === city
        );
        //添加判斷顯示
        this.show_day()
      },

      //子組件傳值，切換城市

      switch_city: function (city) {


        this.set_weather(city)

      }




    },


    async mounted() {

      const route_city = this.$route.params.city;

      //獲取資料
      const response = await this.axios.get(this.api_url + "/city/taiwan")
      this.full_city_weather = response["data"]

      //設置天氣

      this.set_weather(route_city)


      //移除載入前效果
      setTimeout(() => {
        document.getElementById("Element_loding").remove();

      }, 200)


      //監聽視窗變動
      window.onresize = () => {

        this.rwd = !this
        this.rwd = !this

      }


    },

    created() {

      //移除首次加載動畫
      this.remove_loading()


    }



  };
</script>