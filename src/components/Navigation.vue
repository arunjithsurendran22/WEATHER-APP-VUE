<template>
  <nav class="bg-gray-800 shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 text-white items-center">
        <p>home</p>
        <div class="w-40 flex justify-between items-center">
          <RouterLink to="/">LOGIN</RouterLink>
          <RouterLink to="/register">REGISTER</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
/* Add custom styles here */
</style>
