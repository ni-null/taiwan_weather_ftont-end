<template>
  <div>


    <div class="main_box">

      <dist_list></dist_list>




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
        <div class="city_box" v-show="dist_weathers">
          <div class="other_box city_box_item city_other_box">

            <transition-group class="other_box_title" name="fade">
              <div v-for="(item, index) in dist_weathers" :key="item.id">


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

            </transition-group>


          </div>

          <div class="city_box_item">
            <dist_chart :dist_weathers="dist_weathers" v-if="dist_weathers"></dist_chart>
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
        list_now_title: null,
        dist_weathers: null,
        child_dist: null,
        city_data: null,

      };
    },
    inject: ["api_url", "remove_loading"],

    components: {
      dist_list: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_list.vue'),
      dist_chart: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_chart.vue'),
    },
    methods: {

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

      //天氣篩選
      this.dist_weathers = response["data"].filter(function (item) {
        return item.cityname == route_dist;
      });

      this.dist_weathers.splice(7, 8);

      //添加判斷顯示
      this.show_day()

      //移除載入前效果
      document.getElementById("Element_loding").remove();



    },

    components: {
      dist_list: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_list.vue'),
      dist_chart: () => import( /* webpackPreload: true */ /* webpackChunkName: 'dist' */ './dist_chart.vue'),

    },
    created() {
      this.remove_loading()
    }

  };
</script>