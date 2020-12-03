<template>
  <div>
    <b-button v-b-toggle.collapse-3 class="m-1">地區天氣</b-button>
    <b-collapse id="collapse-3">
      <div v-for="item in child_dist" :key="item.id" id="city_button">
        <router-link
          :to="{ path: item.city + '/' + item.dist }"
          class="btn btn-primary"
        >
          {{ item.dist }}
        </router-link>
      </div>
    </b-collapse>
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
    const route_city = this.$route.params.city;

    this.axios.get(this.api_url + "/city/" + route_city).then((response) => {
      this.info = response["data"];
      this.child_dist = Object.keys(groupByKey(this.info, "cityname"));

      this.child_dist.forEach((e, i) => {
        this.child_dist[i] = { city: route_city, dist: e };
      });
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
