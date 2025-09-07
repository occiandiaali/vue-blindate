<template>
  <nav class="navbar fixed-top navbar-expand-md navbar-light bg-light">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <img
          src="../assets/app-logo-no-bg.png"
          alt="blindate"
          width="124"
          height="42"
        />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item">
            <!-- <a class="nav-link active" aria-current="page" href="#">History</a> -->
            <router-link to="/experiences" class="nav-link"
              >Experiences</router-link
            >
          </li>
          <li class="nav-item">
            <!-- <a class="nav-link" href="#">About</a> -->
            <router-link to="/about" class="nav-link">About</router-link>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              More
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <!-- <li><a class="dropdown-item" href="#">Account</a></li> -->
              <li>
                <router-link to="/account" class="nav-link"
                  >Account</router-link
                >
              </li>
              <!-- <li><a class="dropdown-item" href="#">Settings</a></li> -->
              <li>
                <router-link to="/settings" class="nav-link"
                  >Settings</router-link
                >
              </li>
              <li class="dropdown-item fs-6 fst-italic">@{{ thisUser }}</li>
              <li><hr class="dropdown-divider" /></li>
              <li class="dropdown-item" role="button" @click="signOut">
                Sign out
              </li>
              <!-- <button class="btn btn-danger btn-sm m-2" @click="test">
                Sign out
              </button> -->
            </ul>
          </li>

          <!-- <li class="nav-item">
            <a
              class="nav-link disabled"
              href="#"
              tabindex="-1"
              aria-disabled="true"
              >Disabled</a
            >
          </li> -->
        </ul>
        <div class="ms-auto">
          <img
            src="https://ionicframework.com/docs/img/demos/avatar.svg"
            alt="User"
            width="34"
            height="34"
            style="border-radius: 50%"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref, toRefs } from "vue";
import { supabase } from "../utils/supabase.js";

//const loading = ref(true);
const props = defineProps(["session"]);
const { session } = toRefs(props);

const thisUser = ref("");

// const test = () => {
//   alert("Logged out?");
//   console.log(supabase.auth.user);
// };

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    console.log("Logged out user..");
  } catch (error) {
    alert(error.message);
  }
}
onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  thisUser.value = user?.user_metadata.username;
});
</script>
