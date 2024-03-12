<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const isLoginPage = router.currentRoute.value.name === "Login";
</script>

<template>
  <div class="flex flex-col min-h-screen bg-weather-primary">
    <Navigation v-if="!isLoginPage" />
    <router-view />
  </div>
</template>
