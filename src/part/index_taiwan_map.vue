<template>
  <div>
    <div id="main_box">
      <div id="info_box">

        <div id="now_box">
          <div class="now_weather_show "> {{list_now.cityname}}</div>

          <b-container class="text-center" id="list_now_container">
            <div class="now_weather_show "> {{list_now.WD}}</div>

            <b-row>
              <b-col class="now_weather_show half_show ">
                <img :src="require('../img/weather_svg/' + list_now.WD_code + '.svg')" />
              </b-col>

              <b-col class="now_weather_show half_show ">溫度 : {{ list_now.temp }}</b-col>
            </b-row>
          </b-container>
        </div>


        <div id="other_box">

          <b-container class="bv-example-row text-center">

            <b-row v-for="item in list_full" :key="item.id">

              <b-col> {{ item.time_1 + item.time_2 }}</b-col>

              <b-col>

                <b-row>
                  <b-col cols="1"> <img id="icon_svg" :src="require('../img/weather_svg/' + item.WD_code + '.svg')" />
                  </b-col>
                  <b-col> <span> {{ item.WD }}</span></b-col>
                </b-row>
              </b-col>

              <b-row>

                <b-col cols="1"> <img id="icon_svg" :src="require('../img/weather_svg/temp.svg')" /></b-col>
                <b-col> <span> {{ item.temp }}</span></b-col>

              </b-row>




            </b-row>
          </b-container>
        </div>




      </div>
    </div>

    <div id="taiwan_box">
      <svg viewBox="0 0 600 600">
        <g class="counties"></g>
        <path class="county-borders"></path>
      </svg>
    </div>
  </div>
  </div>
</template>

<script>
  import * as d3 from "d3";

  export default {
    data() {
      return {
        list_now: {
          WD_code: '02'
        },
        list_full: []
      };
    },
    inject: ["api_url"],
    async mounted() {
      const citys_list = require("../json/citys_list.json");
      let taiwan_weatger;

      try {
        const data = await this.axios
          .get(this.api_url + "/city/taiwan")
          .then((response) => {
            taiwan_weatger = response["data"];
          });
      } catch (err) {
        console.log(err);
      }
      //預設天氣
      this.list_now = now_weather("臺北市");
      this.list_full = full_weather("臺北市");


      console.log(this.list_full);
      //D3

      const projection = d3.geoMercator().center([121.2, 23.7]).scale(8000);

      const map = require("../json/taiwan_map_mod.json");

      var path = d3.geoPath().projection(projection);

      const svg = d3.select("g").selectAll("path").data(map.features).enter();

      //地圖
      svg
        .append("path")
        .attr("d", path)
        .attr("class", "none")
        .attr("id", function (i) {
          return "block_" + i.properties["COUNTYCODE"];
        })
        .on("mouseover", (i) => {
          this.list_now = now_weather(i.properties["COUNTYNAME"]);
          this.list_full = full_weather(i.properties["COUNTYNAME"]);

          d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
            "class",
            "active"
          );
        })
        .on("mouseleave", function () {
          d3.select(this).attr("class", "none");
        })
        .on("click", (i) => {
          router_link(i.properties["COUNTYNAME"]);
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
          this.list_now = now_weather(i.properties["COUNTYNAME"]);
          this.list_full = full_weather(i.properties["COUNTYNAME"]);

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
          router_link(i.properties["COUNTYNAME"]);
        });

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
        full_weather.splice(0, 1)
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
  svg {

    max-width: 1000px;

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
    margin: 50px 50px50px 50px;
  }

  #info_box {
    position: absolute;
    width: 50%;
    padding: 15px 10px;



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
  }

  #other_box {
    position: relative;
    color: rgb(255, 255, 255);
    background: rgba(82, 82, 82, 0.835);
    border-radius: 50px;
    margin: 5px 5px;
    padding: 40px 10px;
    width: auto;
    text-align: center;
    font-size: 1.5em;
    line-height: 64px;
    height: auto;
  }

  #now_box {}

  @media screen and (max-width: 1370px) {
    #info_box {
      width: 100%;

      .col {
        padding: 06;
      }
    }

    #taiwan_box {
      display: none;
    }
  }
</style>