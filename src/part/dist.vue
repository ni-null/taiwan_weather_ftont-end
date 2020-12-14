<template>
  <div>
    <div class="main_box">
      <dist_list :city_data="city_data" v-if="city_data"></dist_list>

      <!--  手機縣市列表 -->

      <div class="city_box">
        <div class="other_box city_box_item">
          <div class="other_box_title" v-for="(item, index) in dist_weathers" :key="item.id">
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
          <dist_chart :dist_weathers="dist_weathers" v-if="dist_weathers"></dist_chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dist_list from "./dist_list.vue";
  import dist_chart from "./dist_chart.vue";

  export default {
    data() {
      return {
        list_now_title: null,
        dist_weathers: null,
        child_dist: null,
        show_list: false,
        city_data: null,
      };
    },
    inject: ["api_url"],

    components: {
      dist_list,
      dist_chart,
    },
    methods: {
      switch_list: function () {
        this.show_list = !this.show_list;
      },
    },
    provide() {
      return {
        city_data: this.city_data,
      };
    },
    mounted() {
      const route_dist = this.$route.params.dist;
      const route_city = this.$route.params.city;

      this.axios.get(this.api_url + "/city/" + route_city).then((response) => {
        //組件傳遞的資料
        this.city_data = response["data"];

        //天氣篩選
        this.dist_weathers = response["data"].filter(function (item) {
          return item.cityname == route_dist;
        });

        this.dist_weathers.splice(7, 8);

        //添加判斷顯示

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

      });
    },
  };
</script>

<style lang="scss" scoped>
  .city_box {
    display: flex;
    margin-top: 20px;

    .city_box_item {
      flex: 2;
    }
  }

  .other_box {
    max-width: 800px;
  }

  .other_box_title p {
    font-size: 2rem;
    margin-top: 50px;
  }

  .hr {
    border-bottom: 1px solid #1a1a1a;
    padding-top: 10px;
    margin-bottom: 30px;
  }

  @media screen and (max-width: 1100px) {
    .other_box {
      max-width: none;
    }

    .city_box {
      flex-direction: column;
    }
  }
</style>