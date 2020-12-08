<template>
  <div>
    <div id="main_box">
      <div id="info_box">

        <div id="title_box" class="now_weather_show">
          <div>
            <router-link :to="{ path: '/weather/' + list_now.cityname_eng }">
              <img id="local_icon" :src="
                  require('../img/weather_svg/city.svg')
                " />
            </router-link>
          </div>

          <div id="title_box_title">
            {{ list_now.cityname }}
          </div>


          <img id="pin_icon" @click="switch_list()" :src="
                  require('../img/weather_svg/pin.svg')
                " />

        </div>
        <!--  手機縣市列表 -->
        <transition name="fade">
          <div v-if="show_list" class="location_show">
            <div @click="switch_city_list(index)" v-for="(item, index) in citys_list" :key="item.id">
              <div class="citys_list_title">{{ item.name }}</div>
              <transition name="fade">
                <div v-if="citys_list_child[index]" class="citys_list">
                  <div @click="switch_now(child.che)" v-for="child in item.child" :key="child.id"
                    class="citys_list_child">
                    {{ child.che }}
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>

        <!--  天氣描述 -->
        <div class="flex_box1">
          <div class="flex_box1_child">
            <div class="box_1 now_weather_show half_show">
              <img :src="
                  require('../img/weather_svg/' + list_now.WD_code + '.svg')
                " />
              <div class="WD">{{ list_now.WD }}</div>
            </div>
            <!--  溫度 -->
            <div class="box_1 now_weather_show half_show">
              <img :src="require('../img/weather_svg/temp_now.svg')" />
              <div class="temp">{{ list_now.temp }}</div>
            </div>
          </div>

          <div class="other_box ">
            <div class="flex_box_2" v-for="item in list_full" :key="item.id">

              <div class="flex_item_box_2"> {{ item.time_1 + item.time_2 }}</div>
              <div class="flex_item_box_2">

                <div class="flex_box_3">
                  <div class="flex_item_box_3 "><img id="icon_svg" :src="require('../img/weather_svg/temp.svg')" />
                  </div>
                  <div class="flex_item_box_3 "> <span> {{ item.temp }}</span>
                  </div>
                </div>

              </div>
              <div class="flex_item_box_2">
                <div class="flex_box_3">
                  <div class="flex_item_box_3 "> <img id="icon_svg" :src="require('../img/weather_svg/cloudy.svg')" />
                  </div>
                  <div class="flex_item_box_3 ">
                    <span> {{ item.WD }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>



      <svg id="tw_box" viewBox="0 0 370 500">
        <g class="counties"></g>
        <path class="county-borders"></path>
      </svg>


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
      switch_list: function () {
        this.show_list = !this.show_list;
      },

      switch_city_list: function (a) {
        this.citys_list_child[a] = !this.citys_list_child[a];
        console.log(this.citys_list_child[a]);
      },

      switch_now: function (data) {
        const now_weather = this.taiwan_weatger.filter(
          (x) => x.cityname === data
        );

        if (parseInt(now_weather[0].WD_code) > 18) now_weather[0].WD_code = "04";

        this.list_now = now_weather[0];
        this.show_list = !this.show_list;
      },
    },
    async mounted() {
      //地區列表
      const citys_list = require("../json/citys_list.json");
      this.citys_list = citys_list[0];
      let taiwan_weatger;

      //獲取天氣axios
      try {
        const data = await this.axios
          .get(this.api_url + "/city/taiwan")
          .then((response) => {
            taiwan_weatger = response["data"];
            this.taiwan_weatger = response["data"];
          });
      } catch (err) {
        console.log(err);
      }
      //寫入預設天氣
      this.list_now = now_weather("臺北市");
      this.list_full = full_weather("臺北市");



      if (window.innerWidth < 1550)
        return
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
          .attr("id", function (i) {
            return "block_" + i.properties["COUNTYCODE"];
          })
          .on("mouseover", (i) => {
            d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
              "class",
              "active"
            );
          })
          .on("mouseleave", function () {
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




      () => console.log(this.taiwan_weatger)

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
        full_weather.splice(0, 1);
        return full_weather;
      }

      //路由地區轉跳
      const router_link = (COUNTYNAME) => {
        this.$router.push({
          path: "/weather/" + citys_list[1][0][COUNTYNAME],
        });
      };
    },
  };
</script>

<style lang="scss">
  .b-icon.bi {
    float: right;
    right: 0rem;
  }

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

  #main_box {
    padding: 0px 10px 100px 10px;
    position: absolute;
    width: 100%;
  }

  #tw_box {
    float: right;

  }

  #info_box {
    width: auto;
    padding: 15px 10px;
    position: absolute;
    width: 900px;

    .row {
      margin: 0;
    }

    #list_now_container {
      padding: 0;
      max-width: none;
    }
  }

  #taiwan_box {
    text-align: right;
    right: 100px;
    font-size: 1.5em;
    padding: 25px;

  }

  .other_box {
    color: rgb(255, 255, 255);
    background: rgba(82, 82, 82, 0.835);
    border-radius: 50px;
    margin: 5px 5px;
    padding: 40px 10px;
    font-size: 1.5em;
    line-height: 4rem;
    flex: 1
  }

  .citys_list_title {
    font-size: 2rem;
    background: rgba(26, 25, 25, 0.63);
  }

  .citys_list {
    display: flex;
    list-style: none;
    width: 100%;
    align-items: flex-start;
    -webkit-flex-flow: row wrap;
    justify-content: space-around;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
  }

  .citys_list_child {
    width: auto;
    padding: 20px;
    margin: 10px;
    font-size: 1.5rem;
    padding: 20px;
    background: rgba(32, 32, 32, 0.459);
    color: #fff;
    border-radius: 10px;
  }

  /* 地區標題區塊 */
  #title_box {
    display: flex;
    justify-content: space-between;
    text-align: none !important;
    max-height: 70px;
  }


  #local_icon {
    background: #ffffff30;
    padding: 20px 0px;
    width: 70px;
    cursor: pointer;
    height: 100%;
  }

  #pin_icon {
    background: #ffffff30;
    padding: 20px 0px;
    width: 70px;
    cursor: pointer;
  }

  #title_box_title {
    font-size: 3rem;
  }

  @media screen and (min-width: 1370px) {
    .b-icon.bi {
      display: none;
    }

    .flex_box1 {
      display: flex
    }

    .flex_box1_child {
      width: 300px;
      display: block;
    }



  }

  @media screen and (max-width: 1370px) {

    /* 地區標題區塊 */
    #title_box_title {
      font-size: 2.5rem;
      padding-top: 5px;

    }

    #pin_icon {}

    #local_icon {}

    #left_icon {
      background: #2424248a;
    }

    .flex_box1 {
      display: block
    }

    .flex_box1_child {
      display: flex;
      align-content: flex-start;
      width: 100%;
    }

    .box_1 {
      flex: 2
    }





    /*  SVG */
    svg {
      padding: none;
    }

    svg path {
      fill: #ffffff;
      stroke-width: 0.5;
      cursor: pointer;
    }

    #info_box {
      width: 100%;
      position: relative;

      .col {
        padding: 06;
      }
    }

    #taiwan_box {
      display: none;
    }
  }
</style>