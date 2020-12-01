<template>
  <div id="read">
    <input type="button" value="按一下" @click="change" />

    <h1>表格資料</h1>

    <p>表格資料的顯示</p>

    <transition
      enter-active-class="animate__animated animate__bounce"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <table v-show="check">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
            <td>@twitter</td>
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
      msg: "小祕密密",
      check: true,
    };
  },
  methods: {
    change() {
      this.check = !this.check;
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  color: #fff;
  font-style: italic;
  font-size: 2rem;
}

td:hover {
  background: black;
  transition: ease 0.5s;
  transform: translate(12px);
}

#read {
  height: 500px;
}
</style>
