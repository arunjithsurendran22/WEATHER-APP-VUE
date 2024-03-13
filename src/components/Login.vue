<template>
  <div class="flex justify-center items-center h-screen bg-gradient-to-b from-purple-900 to-blue-900 ">
    <div class="bg-gray-300 rounded-lg shadow-xl px-8 py-16 max-w-md w-full transform transition-transform duration-300 hover:scale-105 ">
      <h1 class="text-center text-4xl font-bold mb-8 text-gray-900 font-serif">Login</h1>
      <form @submit.prevent="loginUser" class="space-y-8">
        <div>
          <input
            type="email"
            v-model="email"
            placeholder="Email"
            required
            @input="validateEmail"
            class="block w-full px-4 py-3 rounded-md border focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-900 text-lg shadow-md transition-shadow duration-300"
          />
          <p v-if="emailError" class="text-red-500 text-lg mt-2">{{ emailError }}</p>
        </div>
        <div>
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            required
            class="block w-full px-4 py-3 rounded-md border focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-900 text-lg shadow-md transition-shadow duration-300"
          />
        </div>
        <p v-if="error" class="text-red-500 text-lg">{{ error }}</p>
        <button
          @click="rotateButton"
          type="submit"
          class="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:bg-gradient-to-r focus:from-purple-700 focus:to-blue-700 transition-all duration-300 text-lg shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          <span v-if="!isRotated">LOGIN</span>
          <span v-else>⟳</span>
        </button>
      </form>
      <RouterLink
        to="/register"
        class="block text-center mt-4 text-gray-600 hover:underline italic"
      >
        <span>Don't have an Account ?</span> Register
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import axiosInstance from "../authorization/api";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const email = ref("");
const password = ref("");
const error = ref(null);
const emailError = ref(null);
const accessToken = ref(localStorage.getItem("accessToken"));
const userName = ref(localStorage.getItem("userName") || "");

// Get router instance
const router = useRouter();
const toast = useToast();

// Define loginUser function
const loginUser = async () => {
  try {
    const response = await axiosInstance.post("/profile/login", {
      email: email.value,
      password: password.value,
    });
    toast.success(response.data.message);
    console.log(response.data);
    if (response.data.message === "User Login successful") {
      localStorage.setItem("accessToken", response.data.accessTokenUser);
      localStorage.setItem("userName", response.data.name);
      userName.value = response.data.name;
      toast.success(response.data.message);
      router.push("/home");
    }
  } catch (error) {
    toast.error(error.message);
    console.error(error.response.data.message);
    error.value = error.response.data.message;
  }
};


const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.value)) {
    emailError.value = "Invalid email address";
  } else {
    emailError.value = null;
  }
};

const rotateButton = () => {
  isRotated.value = true;
  setTimeout(() => {
    isRotated.value = false;
  }, 1000);
};
</script>

<style scoped>
button {
  transition: transform 0.3s ease-in-out;
}
</style>
