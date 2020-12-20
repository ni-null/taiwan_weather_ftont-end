<template>
  <div>
    <nav>
      <div class="nav_box ">
        <div class="website_title_box">
          <router-link :to="{ path: '/'}">
            <h1> Ninull天氣預報 </h1>
          </router-link>
        </div>


        <router-link :to="{ path: '/account/user'}">
          <span> 用戶中心 </span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
  const dist_json = require("../json/dist_list.json");


  export default {


    data() {
      return {
        //路由名稱
        route_city: null,
        route_dist: null,
        sub_show: false,
        //
        login_user: null,
        login_check_result: null,
        //訂閱
        show_sub_button: null,

      };
    },
    inject: ["api_url"],
    methods: {


    },
    mounted() {



      //馬上寫入防止用戶修改網址
      this.route_dist = this.$route.params.dist;
      this.route_city = this.$route.params.city;

      if (this.$router.currentRoute.fullPath.split("/")[1] == "weather") this.sub_show = true

      //判斷cookie使否有使用者
      if ($cookies.get('user')) this.login_user = $cookies.get('user').split(":")[1]


    }
  };
</script>