<template>
  <nav class="bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 text-white items-center">
        <RouterLink to="/home" v-if="accessToken">
          <i class="fa-solid fa-house"></i>
        </RouterLink>
        <div class="flex w-20 justify-between" v-if="accessToken">
          <RouterLink to="/weathers">
            <i class="fa-solid fa-map"></i>
          </RouterLink>
          <div>
            <button @click="logout">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
        <div class="w-40 flex justify-between" v-if="!accessToken">
          <RouterLink to="/register" v-if="!accessToken">
            <button>SignUp</button>
          </RouterLink>
          <RouterLink to="/" v-if="!accessToken">
            <button>SignIn</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import axiosInstance from "../authorization/api";

const route = useRouter();
const accessToken = ref(localStorage.getItem("accessToken"));

const logout = async () => {
  try {
    await axiosInstance.post("/profile/logout-user");
    localStorage.removeItem("accessToken");
    accessToken.value = null;
    route.push("/");
  } catch (error) {
    console.log("failed to logout");
  }
};

</script>

<style scoped>
/* Add custom styles here */
</style>
