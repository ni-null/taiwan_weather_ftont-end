<template>
  <div id="login">
    <ul v-for="item in child_dist" :key="item.id">
      <li>{{ item }}</li>
    </ul>
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
          <th>{{ item.time }}</th>
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

  methods: {
    add() {
      this.list.push({
        id: Date.now(),
        name: this.name,
      });
    },
  },

  mounted() {
    const route_dist = this.$route.params.dist;
    const route_city = this.$route.params.city;

    this.axios
      .get("http://127.0.0.1:5000/city/" + route_city)
      .then((response) => {
        this.info = response["data"];
        this.child_dist = Object.keys(groupByKey(this.info, "cityname"));
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
