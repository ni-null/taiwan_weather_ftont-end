<template>
  <div>
    <transition fade>
      <div v-for="item in child_dist" :key="item.id" id="city_button">
        <router-link
          :to="{ path: 'weather/' + item.eng }"
          class="btn btn-primary"
        >
          {{ item.chs }}
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
    </transition>
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

  methods: {},

  mounted() {
    const citys_name = require("../json/citys_name.json");
    console.log();

    this.axios
      .get("http://127.0.0.1:5000/city/" + "taiwan")
      .then((response) => {
        this.info = response["data"];
        this.child_dist = Object.keys(groupByKey(this.info, "cityname"));
        this.child_dist.forEach((e, i) => {
          this.child_dist[i] = { chs: e, eng: citys_name[e] };
        });

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
table {
  color: #fff;
  font-size: 1.5rem;
}
</style>
