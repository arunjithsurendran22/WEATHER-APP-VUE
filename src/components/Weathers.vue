<template>
  <div>
    <!-- Display multiple places here -->
    <ul v-if="multiplePlaces.length">
      <li v-for="(place, index) in multiplePlaces" :key="index">{{ place }}</li>
    </ul>
    <p v-else>No multiple places found</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "../authorization/api";

const multiplePlaces = ref([]);

onMounted(() => {
  const getMultiplePlaces = async () => {
    try {
      const response = await axiosInstance.get("/weather/multiple-weather/get");
      console.log("Response:", response.data);
      multiplePlaces.value = response.data.multiplePlaces;
    } catch (error) {
      console.error("Failed to fetch multiple places:", error);
    }
  };
  getMultiplePlaces();
});


</script>
