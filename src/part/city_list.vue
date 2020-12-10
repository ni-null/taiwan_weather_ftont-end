<template>
  <div>
    <div class="info_box_title_box">
      <div class="h4 hover" @click="switch_dist_list">
        <img id="local_icon" :src="require('../img/svg/city.svg')" />
        <span>鄉鎮天氣</span>
      </div>

      <div class="title_box_title" @click="switch_list()">
        {{ list_now_title }}

        <img id="pin_icon" :src="require('../img/svg/pin.svg')" />
      </div>
    </div>

    <!--  標題/縣市列表 -->
    <transition name="fade">
      <div v-if="show_list" class="location_show">
        <div
          @click="switch_city_list(index)"
          v-for="(item, index) in citys_list"
          :key="item.id"
        >
          <div class="citys_list_title">{{ item.name }}</div>

          <transition name="fade">
            <div v-if="show_dist_child[index]" class="citys_list">
              <div
                @click="switch_router(child.eng)"
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
    <!--  標題/縣市列表 -->

    <!--  鄉鎮列表 -->
    <transition name="fade">
      <div class="dist_list" v-if="show_dist_list">
        <div v-for="item in dist_list" :key="item.id" id="city_button">
          <router-link
            :to="{ path: item.city + '/' + item.dist }"
            class="btn btn-primary"
          >
            {{ item.dist }}
          </router-link>
        </div>
      </div>
    </transition>
    <!--  鄉鎮列表 -->
  </div>
</template>

<script>
const citys_list = require("../json/citys_list.json");

export default {
  data() {
    return {
      //標題
      list_now_title: null,
      //地區
      dist_list: null,
      citys_list: [],

      //列表切換
      show_dist_child: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
      },
      show_list: false,
      show_dist_list: true,
    };
  },
  inject: ["api_url"],

  methods: {
    //顯示切換 - 北中南東
    switch_list: function() {
      this.show_list = !this.show_list;
      if (this.show_list) this.show_dist_list = false;
    },

    //顯示切換 - 北中南東 個別
    switch_city_list: function(a) {
      this.show_dist_child[a] = !this.show_dist_child[a];
    },

    //顯示切換 - 鄉鎮列表
    switch_dist_list: function() {
      this.show_dist_list = !this.show_dist_list;
      if (this.show_dist_list) this.show_list = false;
    },

    //切換城市路由
    switch_router: function(city_eng) {
      console.log("dssd");
      this.$router.push("/weather/" + city_eng);
    },
  },

  mounted() {
    const route_city = this.$route.params.city;

    this.citys_list = citys_list[0];

    //透過路由獲取地名
    this.list_now_title = Object.keys(citys_list[1][0]).find(
      (key) => citys_list[1][0][key] === route_city
    );

    //獲取資料
    this.axios.get(this.api_url + "/city/" + route_city).then((response) => {
      //鄉鎮列表處理
      this.dist_list = Object.keys(groupByKey(response["data"], "cityname"));
      this.dist_list.forEach((e, i) => {
        this.dist_list[i] = {
          city: route_city,
          dist: e,
        };
      });
    });
  },
};

//鄉鎮列表處理
function groupByKey(array, key) {
  return array.reduce((hash, obj) => {
    if (obj[key] === undefined) return hash;
    return Object.assign(hash, {
      [obj[key]]: (hash[obj[key]] || []).concat(obj),
    });
  }, {});
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 560px) {
  .dist_list {
    height: 140px;
    overflow: scroll;
    overflow-y: auto;
    overflow-x: auto;
    display: flex;
  }
}
</style>
