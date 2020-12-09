<template>
  <div>
    <div class="main_box">
      <city_list></city_list>

      <div class="city_box">
        <div class="other_box city_box_item">
          <div
            class="other_box_title"
            v-for="(item, index) in city_weather"
            :key="item.id"
          >
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
                <img :src="require('../img/weather_svg/temp.svg')" />

                <span> {{ item.temp }}</span>
              </div>

              <div class="flex_box_2_item_3">
                <img
                  :src="require('../img/static_icon/' + item.WD_code + '.svg')"
                />

                <span> {{ item.WD }}</span>
              </div>
            </div>

            <div class="hr" v-if="(item.time_2 == '晚上') & (index != 6)"></div>
          </div>
        </div>
        <div class="city_box_item">
          <city_chart></city_chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import city_list from "./city_list.vue";
import city_chart from "./city_chart.vue";

export default {
  data() {
    return {
      city_weather: null,
      child_dist: null,
    };
  },
  inject: ["api_url"],

  components: {
    city_list,
    city_chart,
  },

  mounted() {
    const route_dist = this.$route.params.dist;
    const route_city = this.$route.params.city;

    this.axios.get(this.api_url + "/city/taiwan").then((response) => {
      this.city_weather = response["data"].filter(
        (x) => x.cityname_eng === route_city
      );

      if (this.city_weather[0].day_1 == this.city_weather[1].day_1) {
        this.city_weather[0].show_day = this.city_weather[2].show_day = this.city_weather[4].show_day = this.city_weather[6].show_day = true;
      } else {
        this.city_weather[0].show_day = this.city_weather[1].show_day = this.city_weather[3].show_day = this.city_weather[5].show_day = true;
      }
    });
  },

  //監聽寬度
};
</script>

<style lang="scss" scoped>
.city_box {
  display: flex;

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
