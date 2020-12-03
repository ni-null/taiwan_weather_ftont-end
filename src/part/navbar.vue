<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand :to="{ path: '/' }">Ninull天氣預報</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right v-for="item in nav_list" :key="item.id">
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em> {{ item.name }}</em>
              </template>
              <b-dropdown-item
                :to="{ path: '/weather/' + child.eng }"
                v-for="child in item.child"
                :key="child.id"
              >
                {{ child.che }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav_list: "",
    };
  },
  mounted() {
    const citys_list = require("../json/citys_list.json");
    console.log(citys_list);
    this.nav_list = citys_list;
  },
};
</script>

<style lang="stylus" scoped></style>
