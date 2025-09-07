<!-- <script setup lang="ts">
//import HelloWorld from "./components/HelloWorld.vue";
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <h1>Bootstrap works!</h1>
  <button type="button" class="btn btn-danger">Danger</button>
  <h3>
    Check again <small class="text-muted">With faded secondary text</small>
  </h3>
  <HelloWorld msg="Vite + Vue" />
  <Navbar />
  <div class="container">
    <router-view />
  </div>
</template>

<style scoped></style> -->
<template>
  <div class="container-fluid">
    <MainComponent v-if="session" :session="session" />
    <Auth v-else />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Auth from "./components/Auth.vue";
//import Navbar from "./components/Navbar.vue";
import MainComponent from "./components/MainComponent.vue";
import { supabase } from "./utils/supabase.js";

const session = ref();
onMounted(() => {
  supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
  });
  supabase.auth.onAuthStateChange((_, _session) => {
    session.value = _session;
  });
});
</script>
