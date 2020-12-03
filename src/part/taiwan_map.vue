<template>
  <div>
    <div id="map_box">
      <svg viewBox="0 0 800 600">
        <g class="counties"></g>
        <path class="county-borders"></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    const projection = d3
      .geoMercator()
      .center([121, 24])
      .scale(9000);

    const map = require("../json/taiwan_map.json");

    var path = d3.geoPath().projection(projection);

    const svg = d3
      .select("g")
      .selectAll("path")
      .data(map.features)
      .enter();

    svg
      .append("path")
      .attr("d", path)
      .attr("class", "none")
      .on("mouseover", function(i, d) {
        d3.select(this).attr("class", "active");
      })
      .attr("id", function(i) {
        return "block_" + i.properties["COUNTYCODE"];
      })
      .on("mouseleave", function(d) {
        d3.select(this).attr("class", "none");
      });

    svg
      .append("text")
      .attr("x", function(i) {
        return path.centroid(i)[0] + postionX(i.properties["COUNTYNAME"]);
      })
      .attr("y", function(i) {
        return path.centroid(i)[1] + postionY(i.properties["COUNTYNAME"]);
      })
      .text(function(i) {
        return i.properties["COUNTYNAME"];
      })
      .on("mouseover", function(i) {
        d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
          "class",
          "active"
        );
      })
      .on("mouseleave", function(i) {
        d3.selectAll("#block_" + i.properties["COUNTYCODE"]).attr(
          "class",
          "none"
        );
      });

    function postionX(p) {
      switch (p) {
        case "嘉義縣":
          return 15;
          break;
        case "基隆市":
          return 10;
          break;
        default:
          return -20;
      }
    }

    function postionY(p) {
      switch (p) {
        case "嘉義市":
          return -10;
          break;
        case "新北市":
          return 20;
          break;
        case "基隆市":
          return -10;
          break;
        default:
          return 5;
      }
    }
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
  }
}

#map_box {
  text-align: center;
}
</style>
