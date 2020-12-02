<template>
  <div id="login">
    <div v-for="item in child_dist" :key="item.id" id="city_button">
      <router-link
        :to="{ path: item.city + '/' + item.dist }"
        class="btn btn-primary"
      >
        {{ item.dist }}
      </router-link>
    </div>
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
          <th>{{ item.WeatherDescription }}</th>
          <th>{{ item.temp }}</th>
          <th>{{ item.rain }}</th>
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
      child_dist: null,
    };
  },
  inject: ["api_url"],

  mounted() {
    const route_dist = this.$route.params.dist;
    const route_city = this.$route.params.city;

    this.axios.get(this.api_url + "/city/" + route_city).then((response) => {
      this.info = response["data"];
      this.child_dist = Object.keys(groupByKey(this.info, "cityname"));

      this.child_dist.forEach((e, i) => {
        this.child_dist[i] = { city: route_city, dist: e };
      });
      console.log("第一筆" + this.info[0].cityname);
      console.log(this.child_dist);
    });
  },
};

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
