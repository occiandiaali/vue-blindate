<template>
  <section class="breweries">
    <ul>
      <li v-for="user in concatUsers" :key="user.id">
        <div v-if="user.status === 'online'" class="pulse"></div>
        <img
          :src="user.avatar_url"
          :alt="user.username"
          width="120"
          height="120"
          loading="lazy"
          @loadstart="setAltImg"
          @error="setAltImg"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          style="cursor: pointer"
          @click="setTarget(user.id, user.username, user.avatar_url)"
        />
      </li>
    </ul>
    <UserModal
      :userid="theTargetId"
      :username="theTarget"
      :avatar="theTargetPic"
    />
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import fakeUsers from "../fake-data/fake-users.js";
import UserModal from "./UserModal.vue";
import placeholder from "../assets/user_placeholder_pic.jpg";
import { supabase } from "../utils/supabase.js";

// const alertClicked = (data) => {
//   window.alert(`Show ${data}`);
// };
//  @click="alertClicked(user.username)"
const dbUsers = ref([]);
const concatUsers = ref([]);
const setAltImg = (event) => {
  event.target.src = placeholder;
};

let theTarget = ref("");
let theTargetPic = ref("");
let theTargetId = ref("");
const setTarget = (useridValue, usernameValue, avatarValue) => {
  theTarget.value = usernameValue;
  console.log("usernameValue", usernameValue);
  theTargetPic.value = avatarValue;
  theTargetId.value = useridValue;
};

// const DBUsers = async () => {
//   const { data, error } = await supabase.from("profiles").select();
//   if (error) console.error(error);
//   //  dbUsers.value = data;
//   console.log("DBUsers", dbUsers.value);
//   return data;
// };
// onMounted(() => {
//   DBUsers().then((r) => {
//     dbUsers.value = r;
//     console.debug(dbUsers);
//     concatUsers.value = fakeUsers.concat(dbUsers.value);
//     console.log("onMounted concatUsers ", concatUsers.value);
//   });
// });

onMounted(async () => {
  const { data, error } = await supabase.from("profiles").select();
  if (error) console.error(error);
  if (data) {
    dbUsers.value = data;
    console.log("onMounted dbUsers ", dbUsers.value);
    concatUsers.value = fakeUsers.concat(dbUsers.value);
    console.log("onMounted concatUsers ", concatUsers.value);
  }
});
</script>

<style lang="css" scoped>
/* breweries styles */
.breweries {
  padding: 2rem;
  margin-top: 8%;
}

.breweries > ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 1rem;
}

.breweries > ul > li {
  border: 1px solid #e2e2e2;
  list-style-type: none;
  position: relative;
}

.pulse {
  background-color: #1fe01f; /* Color of the pulse */
  border-radius: 50%; /* Makes it circular */
  height: 10px; /* Height of the pulse */
  width: 10px; /* Width of the pulse */
  animation: pulse 2s infinite; /* Animation properties */
  position: absolute;
  top: 5px;
  left: 5px;
}

@keyframes pulse {
  0% {
    transform: scale(1); /* Original size */
  }
  50% {
    transform: scale(1.5); /* Slightly larger */
  }
  100% {
    transform: scale(1); /* Back to original size */
  }
}
</style>
