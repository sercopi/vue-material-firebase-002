<template>
  <div id="app">
    <Navbar></Navbar>
    <!-- <div class="container"> -->
    <router-view />
    <!-- </div> -->
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import ViewList from "@/components/ViewList";
export default {
  name: "App",
  components: {
    Navbar,
    ViewList
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
