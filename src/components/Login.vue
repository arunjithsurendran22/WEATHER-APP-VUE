<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <h1 class="text-center text-3xl font-bold mb-6">LOGIN</h1>
    <form @submit.prevent="loginUser" class="space-y-4">
      <div>
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          required
          @input="validateEmail"
          class="block w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-500"
        />
        <p v-if="emailError" class="text-red-500">{{ emailError }}</p>
      </div>
      <div>
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="block w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-500"
        />
      </div>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <button
        type="submit"
        class="block w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-all duration-300"
      >
        LOGIN
      </button>
    </form>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "../authorization/api";

// Define reactive properties
const email = ref("");
const password = ref("");
const error = ref(null);
const emailError = ref(null);

// Get router instance
const router = useRouter();

// Define loginUser function
const loginUser = async () => {
  try {
    const response = await axiosInstance.post("/profile/login", {
      email: email.value,
      password: password.value,
    });
    if (response.data.message === "User Login successful") {
      // Redirect to home page
      localStorage.setItem("accessToken", response.data.accessTokenUser);
      router.push("/home");
    }
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data.message);
    error.value = error.response.data.message;
  }
};

// Define validateEmail function
const validateEmail = () => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email.value)) {
    emailError.value = "Invalid email address";
  } else {
    emailError.value = null;
  }
};
</script>../authorization/api
