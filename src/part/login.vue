<template>
  <div id="login">
    <h1>登入組件</h1>
    <input type="text" v-model="name" />
    <input type="button" v-on:keyup.enter="submit" value="按鈕" @click="add" />
    <p>{{ msg }}</p>
    <p>{{ age }}</p>

    <li v-for="item in info" :key="item.id" class="">
      <p>{{ item }}</p>
    </li>
    <ul>
      <transition-group
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
      >
        <li v-for="item in list" :key="item.id" class="">
          <p>編號: {{ item.id }} 名子:{{ item.name }}</p>
        </li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "這是登入組建中的訊息",
      age: "今年24歲",
      id: "",
      name: "",
      info: null,

      list: [
        {
          id: 1,
          name: "胖虎",
        },
        {
          id: 2,
          name: "小夫",
        },
        {
          id: 3,
          name: "靜香",
        },
        {
          id: 4,
          name: "大熊",
        },
      ],
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
</style>
