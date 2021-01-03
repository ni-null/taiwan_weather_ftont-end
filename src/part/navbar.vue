<template>
  <div>
    <nav>
      <router-link :to="{ path: '/'}">
        <div class="nav_box ">
          <div class="website_title_box">

            <h1> Ninull天氣預報 </h1>

          </div>


          <div class="nav_button">
            <router-link v-if="login_user" :to="{ path: '/account/user'}">
              <img :src="require('../img/svg/nav_user_login.svg')" />
              <span> 我的帳號 </span>
            </router-link>

            <router-link v-if="!login_user" :to="{ path: '/account'}">
              <img :src="require('../img/svg/nav_user.svg')" />
              <span> 登入/註冊 </span>
            </router-link>
          </div>

        </div>
      </router-link>
    </nav>
  </div>
</template>

<script>
  const dist_json = require("../json/dist_list.json");
  import bus from '../js/bus'


  export default {


    data() {
      return {
        //路由名稱
        route_city: null,
        route_dist: null,
        sub_show: false,
        //
        login_user: false,
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
      if (this.$cookies.get('user') != null) this.login_user = true
      else this.$cookies.remove('user')


      bus.$on('login', (data) => {

        if (!data) this.login_user = false

        else this.login_user = true


      })

      //



    }


  };
</script>