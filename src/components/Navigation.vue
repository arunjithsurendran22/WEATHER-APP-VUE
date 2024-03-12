<template>
  <nav class="bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 text-white items-center">
        <RouterLink to="/home">
          <i class="fa-solid fa-house"></i>
        </RouterLink>
        <div class="flex w-72 justify-between">
          <p class="text-white">{{ profile ? profile.name : "" }}</p>
          <RouterLink to="/weathers">
            <i class="fa-solid fa-map"></i>
          </RouterLink>
          <div>
            <button @click="logout">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import axiosInstance from "../authorization/api";
const route = useRouter();
const isAuthenticated = ref(!!localStorage.getItem("accessToken"));
const profile = ref(null);

const logout = async () => {
  try {
    await axiosInstance.post("/profile/logout-user");
    localStorage.removeItem("accessToken");
    isAuthenticated.value = false;
    route.push("/");
  } catch (error) {
    console.error("Failed to logout:", error);
  }
};

const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/profile/get-profile");
    profile.value = response.data;
  } catch (error) {
    console.error("Failed to get profile:", error);
  }
};

onMounted(() => {
  getUserProfile();
});
</script>
