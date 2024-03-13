<template>
  <div
    class="bg-gradient-to-b from-purple-900 to-blue-900 min-h-screen flex items-center justify-center "
  >
    <div
      class="bg-gray-300 rounded-lg shadow-xl p-8 max-w-md w-80 md:w-96 transform transition-transform duration-300 hover:scale-105"
    >
      <h1 class="text-center text-4xl font-bold mb-8 text-gray-900 font-serif">
        Register
      </h1>
      <form @submit.prevent="registerUser" class="space-y-8">
        <div>
          <input
            type="text"
            v-model="name"
            placeholder="Name"
            required
            class="block w-full px-4 py-3 rounded-md border focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-900 text-lg shadow-md transition-shadow duration-300"
          />
        </div>
        <div>
          <input
            type="text"
            v-model="mobile"
            placeholder="Phone"
            required
            @input="validateMobile"
            class="block w-full px-4 py-3 rounded-md border focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-900 text-lg shadow-md transition-shadow duration-300"
          />
          <p v-if="mobileError" class="text-red-500 text-lg mt-2">{{ mobileError }}</p>
        </div>
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
            @input="validatePassword"
            class="block w-full px-4 py-3 rounded-md border focus:outline-none focus:border-blue-500 bg-gray-100 text-gray-900 text-lg shadow-md transition-shadow duration-300"
          />
          <p v-if="passwordError" class="text-red-500 text-lg mt-2">
            {{ passwordError }}
          </p>
        </div>
        <p v-if="error" class="text-red-500 text-lg">{{ error }}</p>
        <button
          type="submit"
          @click="rotateButton"
          class="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:bg-gradient-to-r hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:bg-gradient-to-r focus:from-purple-700 focus:to-blue-700 transition-all duration-300 text-lg shadow-lg transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105"
        >
          <span v-if="!isRotated">REGISTER</span>
          <span v-else>⟳</span>
        </button>
      </form>
      <RouterLink
        to="/"
        class="block text-center mt-4 text-gray-600 hover:underline italic"
      >
        <span class="text-sm">Already have an account?</span> Login
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "../authorization/api";
import { useToast } from "vue-toast-notification";

const name = ref("");
const mobile = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();
const error = ref(null);
const mobileError = ref(null);
const emailError = ref(null);
const passwordError = ref(null);
const toast = useToast();
const isRotated = ref(false);

const registerUser = async () => {
  try {
    const response = await axiosInstance.post("/profile/register", {
      name: name.value,
      mobile: mobile.value,
      email: email.value,
      password: password.value,
    });
    if (response.data.message === "user registered successfully") {
      router.push("/");
    }
    toast.success(response.data.message);
  } catch (error) {
    console.error(error.response.data.message);
    toast.error(error.data.message);
    error.value = error.response.data.message;
  }
};

const validateMobile = () => {
  const regex = /^[0-9]{10}$/;
  if (!regex.test(mobile.value)) {
    mobileError.value = "Mobile number must be 10 digits";
  } else {
    mobileError.value = null;
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

const validatePassword = () => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
  if (!regex.test(password.value)) {
    passwordError.value =
      "Password should contain at least 6 characters, including upper and lower case letters, digits, and special characters";
  } else {
    passwordError.value = null;
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
