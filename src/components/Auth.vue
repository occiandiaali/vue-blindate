<template>
  <div class="p-2">
    <img :src="logo" alt="logo" width="200px" height="80px" />
  </div>
  <form
    @submit.prevent="
      selectedOption === 'oldMember' ? handleLogin() : handleSignUp()
    "
    class="border border-light mt-2 p-4 align-items-center justify-content-center"
  >
    <div class="mb-3">
      <label for="inputEmail" class="mb-2">Please enter your email</label>
      <input
        type="email"
        v-model="email"
        class="form-control"
        id="inputEmail"
        placeholder="Your email address"
        aria-describedby="emailHelp"
      />
      <div id="emailHelp" class="form-text">
        We'll never share your email with anyone else.
      </div>
    </div>
    <div class="border border-info p-3 rounded">
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          value="newMember"
          name="newMember"
          id="newMember"
          v-model="selectedOption"
        />
        <label class="form-check-label" for="newMember">
          I don't have an account
        </label>
      </div>
      <div class="form-check">
        <input
          class="form-check-input"
          type="radio"
          value="oldMember"
          name="oldMember"
          id="oldMember"
          v-model="selectedOption"
        />
        <label class="form-check-label" for="oldMember">
          I have a /ˈblaɪndeɪt/. account
        </label>
      </div>
    </div>
    <div class="mb-3 mt-3" v-show="selectedOption === 'oldMember'">
      <input
        type="password"
        v-model="password"
        class="form-control"
        id="inputPassword"
        placeholder="Password"
      />
    </div>
    <div class="mb-3 hidden-signup" v-show="selectedOption === 'newMember'">
      <label class="mt-4"
        >Please enter your full name and set a username and password:</label
      >
      <div class="mb-3 mt-3">
        <label for="newFullname">Full name</label>
        <input
          type="text"
          v-model="fullName"
          class="form-control"
          id="newFullname"
          placeholder="First name Last name"
        />
      </div>
      <div class="mb-3">
        <label for="username">Username</label>
        <input
          type="text"
          v-model="userName"
          class="form-control"
          id="username"
          placeholder="Username"
          aria-describedby="usernameHelp"
        />
        <div id="usernameHelp" class="form-text">
          &bull; Between 3 and 32 characters long. &bull; Allowed: lowercase
          letters, numbers and hyphens. &bull; NOT allowed: CAPITAL letters,
          special characters. &bull; NOT allowed: only numbers or consecutive
          hyphens.
        </div>
      </div>

      <div class="mb-3">
        <label for="newPassword">Set password</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="newPassword"
          placeholder="Password (8 - 512 characters)"
        />
      </div>
      <div class="mb-3">
        <label for="confirmPassword">Re-enter password</label>
        <input
          type="password"
          v-model="confirmPassword"
          class="form-control"
          id="confirmPassword"
          placeholder="Retype password to confirm"
        />
      </div>
    </div>
    <!-- <button type="submit" class="btn btn-primary">Login</button> -->
    <div class="m-4">
      <input
        type="submit"
        class="btn btn-success"
        :value="
          loading
            ? 'Loading'
            : selectedOption === 'oldMember'
            ? 'Login'
            : 'Register'
        "
        :disabled="loading || (email.length < 6 && password.length < 8)"
      />
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../utils/supabase.js";

import logo from "../assets/app-logo-no-bg.png";

const loading = ref(false);
const email = ref("");
const password = ref("");
//const newPassword = ref("");
const confirmPassword = ref("");
const userName = ref("");
const fullName = ref("");
const gender = ref("");
const selectedOption = ref("");

const handleSignUp = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          username: userName.value,
          full_name: fullName.value,
          avatar_url: "https://api.samplefaces.com/face?width=200",
          // gender: gender.value,
        },
      },
      // access options object contents by
      // const {data: {user}} = await supabase.auth.getUser();
      // let metadata = user?.user_metadata;
    });
    if (error) throw error;
    if (data) {
      console.log("Registered ", data);
      console.log("Registered userName ", userName.value);
      alert("Success! welcome..");
      email.value = "";
      password.value = "";
      userName.value = "";
      fullName.value = "";
      //  gender.value = "";
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message); // [TODO: set error msg]
    }
  } finally {
    loading.value = false;
  }
};

// const logLogin = () => {
//   console.log(`Values: ${email.value} and ${password.value}`);
//   email.value = "";
//   password.value = "";
// };

const handleLogin = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="css" scoped></style>
