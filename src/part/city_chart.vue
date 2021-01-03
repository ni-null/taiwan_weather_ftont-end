<template>
  <div>
    <div class="chart_body">
      <div class="chart_box">
        <div class="chart_box_title">降雨機率</div>
        <canvas ref="myChart2" id="myChart2" height="400"></canvas>
        <div class="chart_buttom"></div>
      </div>
      <div class="chart_line"></div>
      <div class="chart_box">
        <div class="chart_box_title">溫度變化</div>
        <canvas ref="myChart" id="myChart" height="400"></canvas>
        <div class="chart_buttom"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from 'chart.js';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  export default {
    data() {
      return {
        day: [],
        mobile_day: [],
        rain: [],
        max_temp: [],
        min_temp: []
      };
    },
    inject: ["api_url"],
    props: {
      city_weather: Array,
    },
    async mounted() {



      //監聽螢幕寬度
      this.$nextTick(() => {
        window.addEventListener("resize", this.onResize);
      });

      //降雨機率整理

      this.city_weather.forEach((e) => {
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
      let yAxes_padding = 10
      let datalabels_offset = 10
      let labels_size = 20
      let temp_offset = 10

      if (window.innerWidth < 560) {
        //替換日期格式
        this.day = this.mobile_day;
        //圖表左方刻度
        scales_yAxes_fontSize = 0;
        yAxes_padding = 0
        datalabels_offset = 0
        labels_size = 15
        temp_offset = 5
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


      let rain_day = [...this.day]

      if (this.rain[6] == 'null') {
        rain_day.splice(6, 1)
      } else if (this.rain[5] == 'null') {
        rain_day.splice(5, 2)
      } else if (this.rain[4] == 'null') {
        rain_day.splice(4, 3)
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
            datalabels: {

              labels: {
                title: {
                  font: {
                    weight: 'bold',
                    size: 20
                  },
                  align: 'top',
                  color: 'white',
                  offset: datalabels_offset,
                }
              }
            }
          }, ],
        },
        options: {
          layout: {
            padding: {
              top: 15,
              right: 15
            }
          },
          tooltips: {
            titleFontSize: 30,
            bodyFontSize: 30,
            position: "custom",
          }

          ,


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
                padding: yAxes_padding
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
                padding: datalabels_offset
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
              datalabels: {
                labels: {
                  title: {
                    font: {
                      weight: 'bold',
                      size: labels_size
                    },
                    align: 'top',
                    color: 'white',
                    offset: temp_offset
                  }
                }
              }

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
              type: "line",
              datalabels: {
                labels: {
                  title: {
                    font: {
                      weight: 'bold',
                      size: labels_size
                    },
                    align: 'bottom',
                    color: 'white',
                    offset: temp_offset
                  }
                }
              }

            },
          ],
          labels: this.day,
        },
        hover: {
          animationDuration: 0
        },
        options: {
          tooltips: {
            titleFontSize: 30,
            bodyFontSize: 30,
            position: "custom",

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
                padding: yAxes_padding
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

    },
    methods: {

    },
  };
</script>