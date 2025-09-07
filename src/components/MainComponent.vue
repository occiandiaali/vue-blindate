<template>
  <Navbar :session="session" />
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import { supabase } from "../utils/supabase.js";
import { onMounted, ref, toRefs } from "vue";

import Navbar from "../components/Navbar.vue";

const props = defineProps(["session"]);
const { session } = toRefs(props);

async function signOut() {
  try {
    loading.value = true;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}
</script>
