<template>
  <div id="login">
    <h1>{{ $route.params.dist }}</h1>
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
          <td>{{ item.cityname }}</td>
          <td>{{ item.time }}</td>
          <td>{{ item.WeatherDescription }}</td>
          <td>{{ item.temp }}</td>
          <td>{{ item.rain }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: null,
      dist_title: "",
    };
  },

  methods: {},
  mounted() {
    const route_dist = this.$route.params.dist;
    const route_city = this.$route.params.city;

    this.axios.get("http://127.0.0.1:5000/city/" + route_city).then(
      (response) =>
        (this.info = response["data"].filter(function(item) {
          return item.cityname == route_dist;
        }))
    );
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
