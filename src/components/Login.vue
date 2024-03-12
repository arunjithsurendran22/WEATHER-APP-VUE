<template>
  <div class="mx-auto mt-32">
    <div class="bg-white rounded-lg shadow-lg p-8 w-96 h-96">
      <h1 class="text-center text-4xl font-bold mb-8">Login</h1>
      <form @submit.prevent="loginUser" class="space-y-6">
        <div>
          <input
            type="email"
            v-model="email"
            placeholder="Email"
            required
            @input="validateEmail"
            class="block w-full px-4 py-3 rounded-md border focus:outline-none focus:border-blue-500"
          />
          <p v-if="emailError" class="text-red-500">{{ emailError }}</p>
        </div>
        <div>
          <input
            type="password"
            v-model="password"
            placeholder="Password"
            required
            class="block w-full px-4 py-3 rounded-md border focus:outline-none focus:border-blue-500"
          />
        </div>
        <p v-if="error" class="text-red-500">{{ error }}</p>
        <button
          type="submit"
          class="block w-full px-4 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-all duration-300"
        >
          LOGIN
        </button>
      </form>
      <RouterLink
        to="/register"
        class="block text-center mt-4 text-blue-600 hover:underline"
      >
        Register
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import axiosInstance from "../authorization/api";

// Define reactive properties
const email = ref("");
const password = ref("");
const error = ref(null);
const emailError = ref(null);
const accessToken = ref(localStorage.getItem("accessToken"));

// Get router instance
const router = useRouter();

// Define loginUser function
const loginUser = async () => {
  try {
    const response = await axiosInstance.post("/profile/login", {
      email: email.value,
      password: password.value,
    });
    console.log(response.data);
    if (response.data.message === "User Login successful") {
      // Redirect to home page
      localStorage.setItem("accessToken", response.data.accessTokenUser);
      accessToken.value = response.data.accessTokenUser;
      router.push("/home");
    }
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
</script>
