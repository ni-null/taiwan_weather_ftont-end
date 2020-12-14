<template>
  <div>
    <div class="info_box_title_box">
      <router-link :to="{ path: './' }">
        <div class="h4 hover">
          <img id="local_icon" :src="require('../img/svg/back.svg')" />
          <span>返回</span>
        </div>
      </router-link>

      <div class="title_box_title" @click="switch_dist_list">
        {{ list_now_title }}
        <img id="pin_icon" :src="require('../img/svg/pin.svg')" />
      </div>
    </div>

    <!--  標題/縣市列表 -->

    <!--  標題/縣市列表 -->

    <!--  鄉鎮列表 -->
    <transition name="fade">
      <div class="dist_list" v-if="show_dist_list">
        <div v-for="item in dist_list" :key="item.id" id="city_button">
          <router-link :to="{ path: item.dist }" class="btn btn-primary">
            {{ item.dist }}
          </router-link>
        </div>
      </div>
    </transition>
    <!--  鄉鎮列表 -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //標題
        list_now_title: null,

        //地區列表
        dist_list: null,

        show_list: false,
        show_dist_list: true,
      };
    },
    inject: ["api_url"],
    props: {
      city_data: null,
      required: true,
    },

    methods: {
      //顯示切換 - 北中南東
      switch_list: function () {
        this.show_list = !this.show_list;
        if (this.show_list) this.show_dist_list = false;
      },

      //顯示切換 - 北中南東 個別
      switch_city_list: function (a) {
        this.show_dist_child[a] = !this.show_dist_child[a];
      },

      //顯示切換 - 鄉鎮列表
      switch_dist_list: function () {
        this.show_dist_list = !this.show_dist_list;
        if (this.show_dist_list) this.show_list = false;
      },
    },

    mounted() {
      const route_city = this.$route.params.city;
      const route_dist = this.$route.params.dist;

      //透過路由獲取地名
      this.list_now_title = route_dist;

      //獲取資料

      //鄉鎮列表處理
      this.dist_list = Object.keys(groupByKey(this.city_data, "cityname"));
      this.dist_list.forEach((e, i) => {
        this.dist_list[i] = {
          city: route_city,
          dist: e,
        };
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

</style>