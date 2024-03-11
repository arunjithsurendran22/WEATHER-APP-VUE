<template>
  <div class="mt-10">
    <!-- Display multiple places here -->
    <ul v-if="multiplePlaces.length" class="grid grid-cols-1 gap-4 mt-10 container">
      <li
        v-for="(place, index) in multiplePlaces"
        :key="index"
        :class="getBackgroundColor(place)"
        class="rounded-lg shadow-md p-4"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">{{ place }}</h3>
          <div v-if="weatherData[place]" class="flex items-center space-x-4">
            <img
              :src="weatherData[place].current.condition.icon"
              alt="Weather Icon"
              class="w-10 h-10"
            />
            <p class="text-xl">{{ weatherData[place].current.temp_c }}°C</p>
          </div>
        </div>
        <button @click="deletePlace(place)" class="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Delete
        </button>
      </li>
    </ul>
    <p v-else class="text-center mt-4">No multiple places found</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosInstance from "../authorization/api";
import axios from "axios";

const multiplePlaces = ref([]);
const weatherData = ref({});
const APIkey = "fc0f79a144e9415ca3f70223241003";

onMounted(() => {
  const getMultiplePlaces = async () => {
    try {
      const response = await axiosInstance.get("/weather/multiple-weather/get");
      console.log("Response:", response.data);
      multiplePlaces.value = response.data.multiplePlaces;
      // Iterate over each place and fetch weather data
      multiplePlaces.value.forEach((place) => {
        fetchWeatherData(place);
      });
    } catch (error) {
      console.error("Failed to fetch multiple places:", error);
    }
  };
  getMultiplePlaces();
});

const fetchWeatherData = async (place) => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${place}&aqi=no`
    );
    console.log("Weather data for", place, ":", response.data);
    weatherData.value[place] = response.data;
  } catch (error) {
    console.error("Failed to fetch weather data for", place, ":", error);
  }
};

const getBackgroundColor = (place) => {
  if (weatherData.value[place]) {
    const visibility = weatherData.value[place].current.vis_km;
    if (visibility <= 2) {
      return "bg-gray-900";
    } else if (visibility <= 3) {
      return "bg-gray-800";
    } else if (visibility <= 4) {
      return "bg-gray-700";
    } else if (visibility <= 5) {
      return "bg-gray-600";
    } else if (visibility <= 6) {
      return "bg-gray-500";
    } else if (visibility <= 7) {
      return "bg-gray-400";
    } else if (visibility <= 8) {
      return "bg-gray-300";
    } else if (visibility <= 9) {
      return "bg-gray-200";
    } else {
      return "bg-gray-100";
    }
  }
};

const deletePlace = async (placeToDelete) => {
  try {
    const response = await axiosInstance.delete(`/places/${placeToDelete}`);
    console.log("Response:", response.data);
    // Assuming the response contains updated multiple places
    multiplePlaces.value = response.data.multiplePlaces;
  } catch (error) {
    console.error("Failed to delete place:", error);
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
