<template>
  <div >
    <Navigation />

    <!-- Loading message -->
    <!-- <div
      v-if="loading"
      class="flex flex-col items-center text-white py-12 bg-gray-800 rounded-lg shadow-md"
    >
      <p>Loading weather data...</p>
    </div> -->

    <!-- Error message -->
    <!-- <div
      v-if="error"
      class="flex flex-col items-center text-red-600 py-12 bg-gray-800 rounded-lg shadow-md"
    >
      <p>Failed to fetch weather data. Please try again later.</p>
    </div> -->
    <!-- Display multiple places here -->
    <ul
      v-if="multiplePlaces && multiplePlaces.length"
      class="grid grid-cols-1 gap-4  container"
    >
      <li
        v-for="(place, index) in multiplePlaces"
        :key="index"
        class="rounded-lg shadow-md p-4 bg-gray-400"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ place.name }}</h3>
          <div v-if="weatherData[place.name]" class="flex items-center space-x-4">
            <img
              :src="weatherData[place.name].current.condition.icon"
              alt="Weather Icon"
              class="w-10 h-10"
            />
            <p class="text-xl">{{ weatherData[place.name].current.temp_c }}°C</p>
            <button
              @click="deletePlace(place)"
              class="mt-2 hover:text-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else class="text-center mt-4">No multiple places found</p>
  </div>
</template>
<script setup>
import { ref, onMounted, watchEffect } from "vue";
import Navigation from "./Navigation.vue";
import axiosInstance from "../authorization/api";
import axios from "axios";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
const toast = useToast();

const multiplePlaces = ref([]);
const weatherData = ref({});
const APIkey = "fc0f79a144e9415ca3f70223241003";
const loading = ref(false);
const error = ref(false); // Added error ref

const getMultiplePlaces = async () => {
  loading.value = true;
  try {
    const response = await axiosInstance.get("/weather/multiple-weather/get");
    console.log("Response:", response.data);
    multiplePlaces.value = response.data.multiplePlaces;
    // Iterate over each place and fetch weather data
    multiplePlaces.value.forEach((place) => {
      fetchWeatherData(place);
    });
    loading.value = false;
  } catch (error) {
    console.error("Failed to fetch multiple places:", error);
    loading.value = false; // Turn off loading state in case of error
    error.value = true;
  }
};

const fetchWeatherData = async (place) => {
  loading.value = true;
  try {
    if (place && place.name) {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${place.name}&aqi=no`
      );
      console.log("Weather data for", place.name, ":", response.data);
      weatherData.value[place.name] = response.data;
    }
    loading.value = false;
  } catch (error) {
    console.error("Failed to fetch weather data for", place.name, ":", error);
    loading.value = false; // Turn off loading state in case of error
    error.value = true;
  }
};

const deletePlace = async (place) => {
  const placeId = place._id;
  console.log(placeId);
  try {
    const response = await axiosInstance.delete(
      `/weather/multiple-weather/delete/${placeId}`
    );
    multiplePlaces.value = response.data.multiplePlaces;
    toast.success("deleted Successfully");
    // Remove weather data for the deleted place
    delete weatherData.value[place.name];
    await getMultiplePlaces();
  } catch (error) {
    console.error("Failed to delete place:", error);
  }
};

// Fetch weather data for each place when multiplePlaces changes
onMounted(() => {
  getMultiplePlaces();
});

watchEffect(() => {
  getMultiplePlaces();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
