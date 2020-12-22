<template>
  <div>

    <div class="index">
      <div class="info_box index_child">
        <!--  標題/縣市列表 -->

        <div class="info_box_title_box">
          <router-link :to="{ path: '/weather/' + list_now.cityname_eng }">
            <div class="h4 hover">
              <img id="local_icon" :src="require('../img/svg/more.svg')" />
              <span>詳細天氣</span>
            </div>
          </router-link>
          <div class="title_box_title" @click="switch_list()">

            <h2>{{ list_now.cityname }} </h2>

            <img id="pin_icon" :src="require('../img/svg/pin.svg')" />
          </div>
        </div>
        <!--  標題/縣市列表 -->

        <!--  手機縣市列表 -->
        <transition name="fade">
          <div v-if="show_list" class="location_show">
            <div @click="switch_city_list(index)" v-for="(item, index) in citys_list" :key="item.id"
              class="citys_list_title">
              {{ item.name }}
            </div>
          </div>
        </transition>


        <div @click="switch_city_list(index)" v-for="(item, index) in citys_list" :key="item.id">
          <div v-if="citys_list_child[index]" class="citys_list">
            <div @click="switch_now(child.che)" v-for="child in item.child" :key="child.id" class="citys_list_child">
              {{ child.che }}
            </div>
          </div>
        </div>
        <!--  手機縣市列表 -->

        <!--  天氣描述 -->
        <div class="now_weather_box1">
          <div class="now_weather_flex_box">
            <div class="now_weather_flex_box_child left_child">
              <img :src="
                  require('../img/svg/weather_svg/' + list_now.WD_code + '.svg')
                " />
              <div class="WD">{{ list_now.WD }}</div>
            </div>
            <span class="now_weather_flex_box_child_line"> </span>
            <!--  溫度 -->
            <div class="now_weather_flex_box_child">
              <img :src="require('../img/svg/temp_now.svg')" />
              <div class="temp">{{ list_now.temp }}</div>
            </div>
          </div>

          <div class="other_box">
            <div class="other_box_title" v-for="(item, index) in list_full" :key="item.id">
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

              <div class="hr" v-if="(item.time_2 == '晚上') & (index != 5)"></div>
            </div>
          </div>
        </div>
        <!--  天氣描述 -->
      </div>

      <!--  D3 -->
      <div class="index_child">
        <svg id="tw_box" viewBox="0 0 370 500">
          <g class="counties"></g>
          <path class="county-borders"></path>
        </svg>
      </div>
      <!--  D3 -->
    </div>
  </div>
</template>

<script>
  const d3 = Object.assign({}, require("d3-geo"), require("d3-selection"), )
  import "../css/index.scss";

  export default {
    data() {
      return {
        taiwan_weather: null,
        list_now: {
          WD_code: "14",
        },
        list_full: [],
        citys_list: [],
        citys_list_child: {
          0: false,
          1: false,
          2: false,
          3: false,
          4: false,
        },
        show_list: false,
      };
    },
    inject: ["api_url"],

    methods: {

      //顯示切換 - 北中南東
      switch_list: function () {
        this.show_list = !this.show_list;
      },

      //顯示切換 - 北中南東 個別
      switch_city_list: function (a) {


        for (let index in this.citys_list_child) {
          if (index != a) this.citys_list_child[index] = false
        }
        this.citys_list_child[a] = !this.citys_list_child[a];

      },
      //顯示切換 - 鄉鎮列表
      switch_now: function (data) {
        const now_weather = this.taiwan_weather.filter(
          (x) => x.cityname === data
        );

        if (parseInt(now_weather[0].WD_code) > 18) now_weather[0].WD_code = "04";

        this.list_now = now_weather[0];
        this.show_list = !this.show_list;
      },
      creat_D3_map: function () {
        //D3繪製地圖
        const projection = d3
          .geoMercator()
          .center([122.95, 23.7])
          .scale(7300);

        const map = require("../json/taiwan_map_mod.json");

        var path = d3.geoPath().projection(projection);

        const svg = d3
          .select("#tw_box")
          .select("g")
          .selectAll("path")
          .data(map.features)
          .enter();

        //地圖
        svg
          .append("path")
          .attr("d", path)
          .attr("class", "none")
          .attr("id", (i) => {
            return "block_" + i.properties["COUNTYCODE"];
          })
          .attr("name", (i) => {
            return i.properties["COUNTYNAME"];
          })
          .on("mouseover", function () {

            d3.select(this).attr(
              "class",
              "active"
            );
          })
          .on("mouseleave", function () {
            d3.select(this).attr("class", "none");
          })
          .on("click", (i) => {


            this.list_full = this.full_weather(d3.selectAll('#' + i.currentTarget.id).attr('name'));
          });

        //標籤
        svg
          .append("text")
          .attr("x", (i) => {
            if (i.properties["X"] != null)
              return path.centroid(i)[0] + i.properties["X"];
            else return path.centroid(i)[0] - 25;
          })
          .attr("y", (i) => {
            if (i.properties["Y"] != null)
              return path.centroid(i)[1] + i.properties["Y"];
            else return path.centroid(i)[1] + 8;
          })
          .attr("id", (i) => {
            return "block_" + i.properties["COUNTYCODE"];
          })
          .text((i) => {
            return i.properties["COUNTYNAME"];
          })
          .on("mouseover", (i) => {


            d3.selectAll("#" + i.target.id).attr(
              "class",
              "active"
            );
          })
          .on("mouseleave", (i) => {

            d3.selectAll("#" + i.target.id).attr(
              "class",
              "none"
            );
          })
          .on("click", (i) => {


            this.list_full = this.full_weather(i.target.innerHTML);
          });

      },

      full_weather: function (COUNTYNAME) {

        let full_weather = this.taiwan_weather.filter(
          (x) => x.cityname === COUNTYNAME
        );

        full_weather.splice(6, 1)


        //添加判斷顯示

        if (full_weather[1].time_1 == full_weather[2].time_1) {

          if (full_weather[0].time_1 != full_weather[1].time_1) {
            full_weather.splice(5, 1)
            full_weather[0].show_day = full_weather[1].show_day = full_weather[3].show_day = true;

          } else {
            full_weather[0].show_day = full_weather[3].show_day = full_weather[5].show_day = true;
          }


        } else if (full_weather[0].time_1 == full_weather[1].time_1) {

          full_weather[0].show_day = full_weather[2].show_day = full_weather[4].show_day =
            true;


        } else {
          full_weather.splice(5, 1)
          full_weather[0].show_day = full_weather[1].show_day = full_weather[3].show_day = true;

        }

        full_weather.forEach(e => {
          if (parseInt(e.WD_code) > 18) e.WD_code = "04";
        });

        //現在天氣
        this.list_now = full_weather[0]

        //添加判斷顯示
        return full_weather;

      }

    },
    async mounted() {
      //地區列表
      const citys_list = require("../json/citys_list.json");
      this.citys_list = citys_list[0];
      let taiwan_weather;

      //獲取資料
      const response = await this.axios.get(this.api_url + "/city/taiwan")
      taiwan_weather = response["data"];
      this.taiwan_weather = response["data"];
      this.list_full = this.full_weather("臺北市");

      //判斷寬度顯示繪製地圖
      if (window.innerWidth < 1370) return;
      else {
        this.creat_D3_map()
      }

    },


    components: {


    }


  };
</script>