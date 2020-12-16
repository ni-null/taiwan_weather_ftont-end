<template>
  <div>
    <navbar></navbar>
    <div class="main_box">
      <city_list></city_list>

      <!--  手機縣市列表 -->

      <div class="city_box">


        <div class="other_box city_box_item city_other_box ">
          <div class="other_box_title" v-for="(item, index) in city_weather" :key="item.id">
            <p v-if="item.show_day">

              <span v-if="item.day_1 != null">
                {{ item.day_1 }}({{ item.day_2 }})
              </span>
              <span v-if="item.day_1 == null">星期{{ item.day_2 }}</span>

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

            <div class="hr" v-if="(item.time_2 == '晚上') & (index != 6)"></div>
          </div>
        </div>

        <div class="city_box_item">
          <city_chart v-if="city_weather" :city_weather="city_weather"></city_chart>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
  import "../css/city.scss";


  export default {
    data() {
      return {
        axios_city_weather: null,
        list_now_title: null,
        city_weather: null,
        child_dist: null,
        show_list: false,
      };
    },
    inject: ["api_url"],

    components: {

      city_list: () => import( /* webpackPreload: true */ /* webpackChunkName: 'city' */ './city_list.vue'),
      city_chart: () => import( /* webpackPreload: true */ /* webpackChunkName: 'city' */ './city_chart.vue'),
      navbar: () => import( /* webpackPreload: true */ /* webpackChunkName: 'navbar' */ './navbar.vue')

    },
    methods: {
      switch_list: function () {
        this.show_list = !this.show_list;
      },
    },


    mounted() {
      const route_dist = this.$route.params.dist;
      const route_city = this.$route.params.city;

      this.axios.get(this.api_url + "/city/taiwan").then((response) => {

        //原始資料
        this.axios_city_weather = response["data"]

        //資料處理
        this.city_weather = response["data"].filter(
          (x) => x.cityname_eng === route_city
        );



        console.log(this.city_weather)



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


        this.list_now_title = this.city_weather[0].cityname;

      });
    },
  };
</script>

<style lang="scss" scoped>
</style>