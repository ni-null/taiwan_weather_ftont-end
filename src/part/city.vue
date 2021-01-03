<template>
  <div>

    <div class="main_box">

      <!--  縣市列表 -->
      <city_list></city_list>
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
        <div class="city_box" v-show="city_weather">


          <div class="other_box city_box_item city_other_box ">


            <transition-group name="fade">
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
            </transition-group>


          </div>

          <div class="city_box_item">
            <city_chart v-if="city_weather" :city_weather="city_weather"></city_chart>
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
        city_weather: null,
        child_dist: null,
        show_list: false,
        city_list: null
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

      }
    },


    async mounted() {

      const route_city = this.$route.params.city;

      //獲取資料

      const response = await this.axios.get(this.api_url + "/city/taiwan")

      //資料處理，獲取該縣市天氣
      this.city_weather = response["data"].filter(
        (x) => x.cityname_eng === route_city
      );

      //添加show_day
      this.show_day()


      //移除載入前效果
      setTimeout(() => {
        document.getElementById("Element_loding").remove();

      }, 300)


    },

    created() {

      //移除首次加載動畫
      this.remove_loading()


    }



  };
</script>