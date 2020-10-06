<template>
  <nav>
    <div class="nav-wrapper pink">
      <div class="container">
        <router-link to="/" class="brand-logo left">Sercopi COMPRA</router-link>
        <ul class="right">
          <li class="hide-on-small-only" v-if="isLoggedIn">
            <span class="black-text">{{ currentUser }}</span>
          </li>

          <li v-if="!isLoggedIn">
            <router-link to="/login">Login</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/register">Register</router-link>
          </li>
          <li v-if="isLoggedIn">
            <button v-on:click="logOut" class="btn black">Log Out</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import firebase from "firebase";
export default {
  name: "Navbar",
  data() {
    return {
      isLoggedIn: false,
      currentUser: false
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
    }
  },
  methods: {
    logOut() {
      const router = this.$router;
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log(firebase.auth().currentUser);
          router.push("/login");
        });
    }
  }
};
</script>

<style scoped>
ul li {
  margin-left: 20px;
}
</style>
