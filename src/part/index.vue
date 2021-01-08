<template>
  <div>


    <transition name="fade_PC">

      <div class="index" v-show="ani_show">
        <div class="info_box index_child">
          <!--  標題/縣市列表 -->

          <div class="info_box_title_box">
            <router-link :to="{ path: '/weather/' + list_now.cityname_eng }">
              <div class="h4 hover">
                <img id="local_icon" :src="require('../img/svg/more.svg')" />
                <span>詳細天氣</span>
              </div>
            </router-link>
            <div class="title_box_title">

              <div class="city_block" @click="switch_block">
                <p> {{ city_block_title [city_block ]  }} </p>
              </div>

              <div class="title_city" @click="switch_list()">
                <p>{{ list_now.cityname }} </p>
              </div>

              <div class="next_city" @click="next_city">
                <img :src="require('../img/svg/next.svg')" />
              </div>

            </div>
          </div>
          <!--  標題/縣市列表 -->

          <!--  縣市列表 -->
          <transition name="fade">
            <div v-if="show_list" class="location_show">
              <div v-for="(item, index) in citys_list" :key="item.id" class="citys_list_title_box">

                <div v-if="index!=0" @click="switch_city_list(index)" class="citys_list_title">
                  {{ item.name }}
                </div>


                <div v-if="index==0" @click="switch_city_list(index)" class="citys_list_title no_border">
                  {{ item.name }}
                </div>
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

              <!--  天氣狀態 -->
              <transition name="bob_long_mobile">

                <div class="now_weather_flex_box_child " v-show="block_show">

                  <img :src="
                  require
                  ('../img/svg/weather_svg/' + list_now.WD_code + '.svg')
                " />
                  <div class="WD">{{ list_now.WD }}</div>

                </div>

              </transition>

              <span class="now_weather_flex_box_child_line"> </span>

              <!--  溫度 -->
              <transition name="bob_long_mobile">
                <div class="now_weather_flex_box_child" v-show="block_show">
                  <img :src="require('../img/svg/temp_now.svg')" />
                  <div class="temp">{{ list_now.temp }}</div>
                </div>
              </transition>





            </div>

            <transition name="bob_long_mobile">
              <div class="other_box" v-show="block_show">
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

                </div>
              </div>

            </transition>
          </div>
          <!--  天氣描述 -->
        </div>

        <!--  D3 -->


        <component @map_click="map_click" :select_city="list_now.cityname" :is=" index_map" />


      </div>
    </transition>

  </div>
</template>

<script>
  import "../css/index.scss";

  export default {
    data() {
      return {
        //天氣
        taiwan_weather: null,

        //當前顯示
        list_now: {
          WD_code: "14",
        },

        //區域

        citys_in_block: [],
        //選單
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


        city_block: 1,
        city_block_title: ['北', '中', '南', '東', '外'],
        city_block_list_index: 1,
        city_block_list: [],

        //地圖
        index_map: null,
        //特效
        ani_show: false,
        block_show: false

      };
    },

    //api_url = api網址
    //remove_loading  = vue 首次在入動畫
    inject: ["api_url", "remove_loading"],

    methods: {


      /* 區域切換(北中南外) */

      switch_block: function () {

        //切換區域
        if (this.city_block < 4) this.city_block++
        else this.city_block = 0


        //設置天資料為區域第一個城市
        const first_city = this.citys_in_block[this.city_block][0]

        this.full_weather(first_city)

        //動畫
        this.switch_ani()

      },


      /* 區域切換(北中南外) - 切換下一個城市 */

      next_city: function () {


        //計算長度，切換索引
        const citys_in_block_length = this.citys_in_block[this.city_block].length

        if (this.city_block_list_index < citys_in_block_length - 1) this.city_block_list_index++

        else this.city_block_list_index = 0


        //切換天氣
        this.full_weather(this.citys_in_block[this.city_block][this.city_block_list_index])


        //動畫
        this.switch_ani()

      },

      //選單 -  顯示切換 - 北中南東
      switch_list: function () {
        this.show_list = !this.show_list;
        if (!this.show_list) {

          for (let i = 0; i < 5; i++) {
            this.citys_list_child[i] = false
          }

        }
      },

      //選單 -  顯示切換 - 北中南東 個別
      switch_city_list: function (a) {


        for (let index in this.citys_list_child) {
          if (index != a) this.citys_list_child[index] = false
        }
        this.citys_list_child[a] = !this.citys_list_child[a];

      },
      //選單 - 切換城市
      switch_now: function (data) {


        const now_weather = this.full_weather(data)

        //當前顯示
        this.list_now = now_weather[0];


        //   this.show_list = !this.show_list;


        //動畫
        this.switch_ani()
      },

      /* 設置天氣資料 */
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

        //天氣代碼處理
        full_weather.forEach(e => {
          if (parseInt(e.WD_code) > 18) e.WD_code = "04";
        });

        //全部天氣
        this.list_full = full_weather

        //最近的天氣
        this.list_now = full_weather[0]

        //localStorage 
        localStorage.weather_select = COUNTYNAME


        //索引


        this.citys_in_block.forEach((e, i) => {

          e.forEach((n, m) => {
            if (n == COUNTYNAME) {

              this.city_block = i
              this.city_block_list_index = m

            }

          })
        })

        //




        //添加判斷顯示
        return full_weather;

      },



      /*  地圖 */
      map_click: function (map_click) {
        // index_map傳值處理
        this.full_weather(map_click)


      },

      /*  動畫切換 */
      switch_ani: function () {


        if (window.innerWidth < 1527) {
          this.block_show = false
          setTimeout(() => {
            this.ani_show = true
            this.block_show = true
          }, 100);
        }


      }

    },

    async mounted() {



      //地區列表
      const citys_list = require("../json/citys_list.json");
      this.citys_list = citys_list[0];
      let taiwan_weather;

      //地區縣市 - 中文
      this.citys_list.forEach(e => {
        let arr = []
        e.child.forEach(n => {
          arr.push(n.che)
        })
        this.citys_in_block.push(arr)
      });






      //獲取資料
      const response = await this.axios.get(this.api_url + "/city/taiwan")
      this.taiwan_weather = response["data"];



      if (!localStorage.weather_select)
        this.list_full = this.full_weather("臺北市");
      else {
        this.list_full = this.full_weather(localStorage.weather_select);
      }

    },
    created() {


      /* 首次在入動畫移除 */
      this.remove_loading()


      /*  首次載入動畫 */

      setTimeout(() => {
        this.ani_show = true
        this.block_show = true
      }, 100);





      /*  動態引入 */

      //首次載入窗口檢測
      if (window.innerWidth > 1530) {
        this.index_map = () => import( /* webpackChunkName: 'index_map' */ './index_map.vue')
      }

      //監聽視窗變動
      window.onresize = () => {

        if (window.innerWidth > 1530) {
          this.index_map = () => import( /* webpackChunkName: 'index_map' */ './index_map.vue')
        }

      }




    }

  };
</script>