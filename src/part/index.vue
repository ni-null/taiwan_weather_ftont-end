<template>
  <div>
    <div class="main_box">
      <div class="info_box">
        <!--  標題/縣市列表 -->
        <div class="info_box_title_box">
          <div class="h4 hover">
            <router-link :to="{ path: '/weather/' + list_now.cityname_eng }">
              <img id="local_icon" :src="require('../img/svg/more.svg')" />
              <span>詳細天氣</span>
            </router-link>
          </div>

          <div class="title_box_title" @click="switch_list()">
            {{ list_now.cityname }}

            <img id="pin_icon" :src="require('../img/svg/pin.svg')" />
          </div>
        </div>
        <!--  標題/縣市列表 -->

        <!--  手機縣市列表 -->
        <transition name="fade">
          <div v-if="show_list" class="location_show">
            <div
              @click="switch_city_list(index)"
              v-for="(item, index) in citys_list"
              :key="item.id"
            >
              <div class="citys_list_title">{{ item.name }}</div>
              <transition name="fade">
                <div v-if="citys_list_child[index]" class="citys_list">
                  <div
                    @click="switch_now(child.che)"
                    v-for="child in item.child"
                    :key="child.id"
                    class="citys_list_child"
                  >
                    {{ child.che }}
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>
        <!--  手機縣市列表 -->

        <!--  天氣描述 -->
        <div class="now_weather_box1">
          <div class="now_weather_flex_box">
            <div class="now_weather_flex_box_child left_child">
              <img
                :src="
                  require('../img/svg/weather_svg/' + list_now.WD_code + '.svg')
                "
              />
              <div class="WD">{{ list_now.WD }}</div>
            </div>
            <!--  溫度 -->
            <div class="now_weather_flex_box_child">
              <img :src="require('../img/svg/temp_now.svg')" />
              <div class="temp">{{ list_now.temp }}</div>
            </div>
          </div>

          <div class="other_box">
            <div
              class="other_box_title"
              v-for="(item, index) in list_full"
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
                  <img :src="require('../img/svg/temp.svg')" />

                  <span> {{ item.temp }}</span>
                </div>

                <div class="flex_box_2_item_3">
                  <img
                    :src="
                      require('../img/svg/static_icon/' + item.WD_code + '.svg')
                    "
                  />

                  <span> {{ item.WD }}</span>
                </div>
              </div>

              <div
                class="hr"
                v-if="(item.time_2 == '晚上') & (index != 6)"
              ></div>
            </div>
          </div>
        </div>
        <!--  天氣描述 -->
      </div>

      <!--  D3 -->
      <svg id="tw_box" viewBox="0 0 370 500">
        <g class="counties"></g>
        <path class="county-borders"></path>
      </svg>
      <!--  D3 -->
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  data() {
    return {
      taiwan_weatger: null,
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
    switch_list: function() {
      this.show_list = !this.show_list;
    },

    switch_city_list: function(a) {
      this.citys_list_child[a] = !this.citys_list_child[a];
      console.log(this.citys_list_child[a]);
    },

    switch_now: function(data) {
      const now_weather = this.taiwan_weatger.filter(
        (x) => x.cityname === data
      );

      if (parseInt(now_weather[0].WD_code) > 18) now_weather[0].WD_code = "04";

      this.list_now = now_weather[0];
      this.show_list = !this.show_list;
    },
  },
  mounted() {
    //地區列表
    const citys_list = require("../json/citys_list.json");
    this.citys_list = citys_list[0];
    let taiwan_weatger;

    this.axios.get(this.api_url + "/city/taiwan").then((response) => {
      taiwan_weatger = response["data"];
      this.taiwan_weatger = response["data"];
      this.list_now = now_weather("臺北市");
      this.list_full = full_weather("臺北市");
    });
    //寫入預設天氣

    if (window.innerWidth < 1370) return;
    else {
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
        .attr("id", function(i) {
          return "block_" + i.properties["COUNTYCODE"];
        })
        .on("mouseover", (i) => {
          d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
            "class",
            "active"
          );
        })
        .on("mouseleave", function() {
          d3.select(this).attr("class", "none");
        })
        .on("click", (i) => {
          this.list_now = now_weather(i.properties["COUNTYNAME"]);
          this.list_full = full_weather(i.properties["COUNTYNAME"]);
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
        .text((i) => {
          return i.properties["COUNTYNAME"];
        })
        .on("mouseover", (i) => {
          //  this.temp = ;
          d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
            "class",
            "active"
          );
        })
        .on("mouseleave", (i) => {
          d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
            "class",
            "none"
          );
        })
        .on("click", (i) => {
          this.list_now = now_weather(i.properties["COUNTYNAME"]);
          this.list_full = full_weather(i.properties["COUNTYNAME"]);
        });
    }

    () => console.log(this.taiwan_weatger);

    //從資料取得選取地區天氣
    function now_weather(COUNTYNAME) {
      const now_weather = taiwan_weatger.filter(
        (x) => x.cityname === COUNTYNAME
      );

      if (parseInt(now_weather[0].WD_code) > 18) now_weather[0].WD_code = "04";

      return now_weather[0];
    }

    //從資料取得選取地區天氣
    function full_weather(COUNTYNAME) {
      const full_weather = taiwan_weatger.filter(
        (x) => x.cityname === COUNTYNAME
      );
      //刪除第一筆

      console.log(full_weather);
      //添加判斷顯示
      if (full_weather[0].day_1 == full_weather[1].day_1) {
        full_weather[0].show_day = full_weather[2].show_day = full_weather[4].show_day = full_weather[6].show_day = true;
      } else {
        full_weather[0].show_day = full_weather[1].show_day = full_weather[3].show_day = full_weather[5].show_day = true;
      }
      return full_weather;
    }
  },
};
</script>

<style lang="scss">
/* D3 地圖 */
svg {
  width: auto;
  max-width: 600px;

  path {
    fill: #7fe4ff;
    stroke: white;
    stroke-width: 1.5;
    cursor: pointer;
  }

  path.active {
    fill: pink;
    transform: translateY(-5px);
    transition: all 0.5s ease;
  }

  text {
    fill: rgb(0, 0, 0);
    font-size: 0.8rem;
    font-weight: bold;
    -webkit-user-select: none;
    cursor: pointer;
  }
}

#tw_box {
  float: right;
}

#taiwan_box {
  text-align: right;
  right: 100px;
  font-size: 1.5em;
  padding: 25px;
}

@media screen and (min-width: 1800px) {
  /* D3 */
  svg {
    margin-right: 200px;
  }

  /* D3 */
}

@media screen and (max-width: 1370px) {
  /*  SVG */

  #tw_box {
    display: none;
  }
}
</style>
