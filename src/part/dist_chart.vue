<template>
  <div class="chart_box">
    <div class="rain_title">降雨機率</div>
    <canvas ref="myChart2" id="myChart2" height="400"></canvas>
    <div class="chart_buttom"></div>
    <p></p>
    <div class="temp_title">溫度變化</div>
    <canvas ref="myChart" id="myChart" height="400"></canvas>
    <div class="chart_buttom"></div>
  </div>
</template>

<script>
  import Chart from "chart.js";
  export default {
    data() {
      return {
        window_width: window.innerWidth, //螢幕寬度
        day: [],
        mobile_day: [],
        rain: [],
        max_temp: [],
        min_temp: [],
      };
    },
    props: {
      dist_weathers: null,
      required: true,
    },

    inject: ["api_url"],

    mounted() {
      //監聽螢幕寬度

      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });

      //降雨機率整理

      this.dist_weathers.forEach((e) => {
        let origin_day = [];

        //降雨
        this.rain.push(e.rain);

        //日期
        origin_day.push(e.time_1);
        origin_day.push(e.time_2);
        this.day.push(origin_day);

        //手機日期

        let mobile_day = e.time_1.split("-");

        mobile_day.splice(1, 0, "/");

        mobile_day.push("：");

        const arr_1 = e.time_2.split("");
        mobile_day.push(arr_1[0]);
        mobile_day.push(arr_1[1]);

        this.mobile_day.push(mobile_day);

        //溫度處理
        const split_temp = e.temp.split("~");
        this.max_temp.push(split_temp[1]);
        this.min_temp.push(split_temp[0]);
      });
      //寬度檢測
      let scales_yAxes_fontSize = 18;
      if (this.window_width < 560) {
        //替換日期格式

        this.day = this.mobile_day;
        //圖表左方刻度
        scales_yAxes_fontSize = 0;
      }

      //自訂定提示位置
      Chart.Tooltip.positioners.custom = function (elements, position) {
        if (!elements.length) {
          return false;
        }
        var offset = 0;
        //adjust the offset left or right depending on the event position
        if (elements[0]._chart.width / 2 > position.x) {
          offset = 20;
        } else {
          offset = -20;
        }
        return {
          x: position.x + offset,
          y: position.y + 70,
        };
      };

      //處理降雨日為空
      let rain_day = [];
      if (this.rain[6] == null) {
        this.rain.splice(6, 1);
        this.day.splice(6, 1);
        rain_day = this.day;
      } else {
        rain_day = this.day;
      }

      //圖表降雨
      const ctx2 = this.$refs.myChart2;

      const myChart2 = new Chart(ctx2, {
        type: "line",
        data: {
          labels: rain_day,
          datasets: [{
            label: "降雨機率",
            data: this.rain,

            backgroundColor: ["rgba(0, 186, 236, 0.4)"],

            borderWidth: 1,
            pointRadius: 4,
            pointBorderWidth: 6,
            pointHoverBorderWidth: 6,
            pointStyle: "circle",
            pointBorderColor: "rgba(0, 186, 236)",
          }, ],
        },
        options: {
          tooltips: {
            titleFontSize: 30,
            bodyFontSize: 30,
            position: "custom",
          },
          animation: {
            onProgress: function (tooltip) {
              const ctx = this.chart.ctx;
              ctx.font = "16pt Arial";
              ctx.fillStyle = "white";
              ctx.textAlign = "left";
              ctx.textBaseline = "bottom";

              this.data.datasets.forEach(function (dataset) {
                dataset.data.forEach((e, i) => {
                  for (let key in dataset._meta) {
                    let model = dataset._meta[key].data[i]._model;
                    ctx.fillText(dataset.data[i], model.x - 10, model.y - 5);
                  }
                });
              });
            },
          },

          maintainAspectRatio: false,

          scales: {
            yAxes: [{
              ticks: {
                fontColor: "#fff",
                fontSize: scales_yAxes_fontSize,
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: 100,
              },
            }, ],
            xAxes: [{
              ticks: {
                fontColor: "#fff",
                fontSize: 18,
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: 100,
                padding: 10,
              },
            }, ],
          },
          legend: {
            labels: {
              fontColor: "#fff",
              fontSize: 0,
            },
          },
        },
      });

      /* 溫度圖表*/
      const ctx = this.$refs.myChart;
      const myChart = new Chart(ctx, {
        type: "line",

        plugins: [{
          beforeInit: function (chart, options) {
            chart.legend.afterFit = function () {
              this.height = this.height + 50;
            };
          },
        }, ],
        data: {
          datasets: [{
              label: "最高溫",
              data: this.max_temp,
              fill: false,
              borderColor: "#ff6666",
              pointBorderWidth: 8,
              pointHoverBorderWidth: 8,
              pointBackgroundColor: "#fff",
            },
            {
              label: "最低溫",
              data: this.min_temp,
              backgroundColor: ["blake"],
              fill: false,
              borderColor: "#5bc0ff",

              pointBorderWidth: 8,
              pointHoverBorderWidth: 8,
              pointBackgroundColor: "#fff",

              // Changes this dataset to become a line
              type: "line",
            },
          ],
          labels: this.day,
        },

        options: {
          tooltips: {
            titleFontSize: 30,
            bodyFontSize: 30,
            position: "custom",
          },
          animation: {
            onProgress: function () {
              var ctx = this.chart.ctx;
              ctx.font = "12pt Arial";
              ctx.fillStyle = "white";
              ctx.textAlign = "left";
              ctx.textBaseline = "bottom";

              this.data.datasets.forEach(function (dataset) {
                dataset.data.forEach((e, i) => {
                  for (let key in dataset._meta) {
                    let model = dataset._meta[key].data[i]._model;
                    ctx.fillText(dataset.data[i], model.x - 10, model.y - 5);
                  }
                });
              });
            },
          },
          responsive: true,
          maintainAspectRatio: false,

          scales: {
            yAxes: [{
              ticks: {
                fontColor: "#fff",
                fontSize: scales_yAxes_fontSize,
                steps: 2,
                stepSize: 1,
              },
            }, ],
            xAxes: [{
              ticks: {
                fontColor: "#fff",
                fontSize: 18,
                beginAtZero: true,
                padding: 20,
              },
            }, ],
          },
          legend: {
            labels: {
              fontColor: "#fff",
              fontSize: 20,
            },
          },
        },
      });
    },

    //監聽寬度

    beforeDestroy() {
      window.removeEventListener("resize", this.onResize);
    },
    methods: {
      onResize() {
        this.window_width = window.innerWidth;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chart_box {
    margin: 5px 10px;
  }

  #myChart,
  #myChart2 {
    max-height: 400px;
    background: #000000b0;
    padding: 0px 10px;
  }

  .rain_title {
    font-size: 2rem;
    text-align: center;
    padding: 30px;
    color: #fff;
    background: #000000b0;
    border-radius: 30px 30px 0px 0px;
  }

  .temp_title {
    font-size: 2rem;
    text-align: center;
    color: #fff;
    padding: 30px;
    background: #000000b0;
    border-radius: 30px 30px 0px 0px;
  }

  .chart_buttom {
    height: 50px;
    background: #000000b0;
    border-radius: 0px 0px 30px 30px;
  }

  @media screen and (max-width: 560px) {

    .city_box_item {
      margin-top: 20px;
    }

    .chart_box {
      margin: 0;
      margin-top: 20px
    }

  }
</style>