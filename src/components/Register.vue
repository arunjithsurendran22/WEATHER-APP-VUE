<template>
  <div class="bg-gray-400 min-h-screen flex items-center justify-center">
    <div class="max-w-md mx-auto p-10 rounded-lg shadow-lg bg-white w-96">
      <h1 class="text-center text-3xl font-bold mb-6">REGISTER</h1>
      <form @submit.prevent="registerUser" class="space-y-6">
        <div>
          <input
            type="text"
            v-model="name"
            placeholder="Name"
            required
            class="block w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <input
            type="text"
            v-model="mobile"
            placeholder="Phone"
            required
            @input="validateMobile"
            class="block w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-500"
          />
          <p v-if="mobileError" class="text-red-500">{{ mobileError }}</p>
        </div>
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
            @input="validatePassword"
            class="block w-full px-4 py-2 rounded-md border focus:outline-none focus:border-blue-500"
          />
          <p v-if="passwordError" class="text-red-500">{{ passwordError }}</p>
        </div>
        <p v-if="error" class="text-red-500">{{ error }}</p>
        <button
          type="submit"
          class="block w-full px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700 transition-all duration-300"
        >
          REGISTER
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosInstance from "../authorization/api";

const name = ref("");
const mobile = ref("");
const email = ref("");
const password = ref("");
const router = useRouter();
const error = ref(null);
const mobileError = ref(null);
const emailError = ref(null);
const passwordError = ref(null);

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
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data.message);
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
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
