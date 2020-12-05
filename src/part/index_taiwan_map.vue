<template>
  <div>
    <div id="main_box">
      <div id="weatger_box">
        <div class="cityname">{{ list_now.cityname }}</div>
        <div class="WD display_half">{{ list_now.WD }}</div>
        <div class="WD display_half">溫度 : {{ list_now.temp }}</div>
      </div>

      <div v-for="item in list_full" :key="item.id">
        <div id="weatger_box">
          <div class="">{{ item.time_1 + item.time_2 }}</div>
          <div class="WD display_half">{{ item.WD }}</div>
          <div class="WD display_half">溫度 : {{ item.temp }}</div>
        </div>
      </div>
    </div>

    <div id="map_box">
      <svg viewBox="0 0 600 600">
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
      list_now: [],
      list_full: [],
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

    const projection = d3
      .geoMercator()
      .center([121.4, 23.7])
      .scale(8000);

    const map = require("../json/taiwan_map_mod.json");

    var path = d3.geoPath().projection(projection);

    const svg = d3
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
        this.list_now = now_weather(i.properties["COUNTYNAME"]);
        this.list_full = full_weather(i.properties["COUNTYNAME"]);

        d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
          "class",
          "active"
        );
      })
      .on("mouseleave", function() {
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
      return now_weather[0];
    }

    //從資料取得選取地區天氣
    function full_weather(COUNTYNAME) {
      const full_weather = taiwan_weatger.filter(
        (x) => x.cityname === COUNTYNAME
      );
      return full_weather;
    }

    //路由地區轉跳
    const router_link = (COUNTYNAME) => {
      this.$router.push({ path: "/weather/" + citys_list[1][0][COUNTYNAME] });
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
    stroke-width: 2;
    cursor: pointer;
  }

  path.active {
    fill: pink;
    transform: translateY(-5px);
    transition: all 0.5s ease;
  }

  text {
    fill: rgb(12, 65, 109);
    font-size: 1rem;
    font-weight: bold;
    -webkit-user-select: none;
    cursor: pointer;
  }
}

#main_box {
  position: absolute;
}
#map_box {
  text-align: right;
}

#weatger_box {
  position: relative;
  color: rgb(255, 255, 255);
  background: rgba(82, 82, 82, 0.835);
  border-radius: 50px;
  margin: 10px 10px;
  padding: 30px 10px;
  width: 600px;
  max-width: 600px;
  text-align: center;
  font-size: 2em;
  height: auto;

  .display_half {
    width: 50%-1;
    text-align: center;
    display: inline-block;
  }
  .cityname {
    padding: 5px;
    font-weight: bold;
  }
  .WD {
    text-align: center;
  }
}
</style>
