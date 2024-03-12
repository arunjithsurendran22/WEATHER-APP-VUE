<template>
  <nav class="bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 text-white items-center">
        <router-link to="/home">
          <i class="fas fa-home"></i>
          <!-- corrected icon class -->
        </router-link>
        <div class="flex w-72 justify-between">
          <router-link to="/weathers">
            <i class="fas fa-map"></i>
            <!-- corrected icon class -->
          </router-link>
          <div>
            <button @click="logout">
              <i class="fas fa-sign-out-alt"></i>
              <!-- corrected icon class -->
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
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
const route = useRouter();
const isLoggedIn = ref(true);
const toast = useToast();

const logout = async () => {
  try {
    await axiosInstance.post("/profile/logout-user");
    localStorage.removeItem("accessToken");
    isLoggedIn.value = false;
    toast.success(" Successfully Logout")
    route.push("/");
  } catch (error) {
    toast.error("Failed to logout")
    console.error("Failed to logout:", error);
  }
};

</script>
