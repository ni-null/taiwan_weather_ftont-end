<template>
  <div>
    <nav>
      <router-link :to="{ path: '/'}">
        <span> Ninull天氣預報 </span>
      </router-link>
    </nav>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    mounted() {

    },
  };
</script>

<style lang="scss" scoped>
  nav {
    height: 50px;
    padding: 10px;

    span {
      font-size: 1.5rem;
      color: white;

    }
  }
</style>