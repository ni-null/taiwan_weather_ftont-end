<template>
  <div id="login">
    <city_list></city_list>
    <table class="table">
      <thead>
        <tr>
          <td>名稱</td>
          <td>時間</td>
          <td>天氣狀態</td>
          <td>溫度</td>
          <td>降雨機率</td>
        </tr>
      </thead>

      <tbody v-for="item in info" :key="item.id">
        <tr>
          <th>{{ item.cityname }}</th>
          <th>{{ item.time_1 + item.time_2 }}</th>
          <th>{{ item.WD }}</th>
          <th>{{ item.temp }}</th>
          <th>{{ item.rain }}</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import city_list from "./city_list.vue";

export default {
  data() {
    return {
      info: null,
      child_dist: null,
    };
  },
  inject: ["api_url"],
  components: {
    city_list,
  },

  mounted() {
    const route_dist = this.$route.params.dist;
    const route_city = this.$route.params.city;

    this.axios.get(this.api_url + "/city/taiwan").then((response) => {
      this.info = response["data"].filter((x) => x.cityname_eng === route_city);
      console.log(this.info + "啊哈");
    });
  },
};
</script>

<style lang="scss" scoped>
#login {
  text-align: center;
  background-color: #0000005d;
  padding: 50px;

  h1 {
    text-align: center;
  }
  color: aqua;
}

table {
  color: #fff;
  font-size: 1.5rem;
}
</style>
