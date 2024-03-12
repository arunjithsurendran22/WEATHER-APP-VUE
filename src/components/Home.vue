<template>
  <main class="container text-white bg-gray-900">
    <div class="text-white flex justify-between mt-10">
      <button @click="getCurrentLocation">
        <i class="fa-solid fa-location-dot"></i>
      </button>
      <button @click="addToMaps">
        <i :class="isAddedToMaps ? 'fa-solid fa-check' : 'fa-solid fa-plus'"></i>
      </button>
    </div>
    <div class="pt-4 mb-8 relative">
      <!-- Search Input -->
      <input
        type="text"
        v-model="searchQuery"
        @input="getSearchResults"
        placeholder="Search for a city or State"
        class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-[0px_1px_0_0_#004E71]"
      />

      <!-- Search Results -->
      <ul
        class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]"
        v-if="mapboxSearchResults"
      >
        <p v-if="searchError">Sorry something went wrong, please try again</p>
        <p v-else-if="mapboxSearchResults && mapboxSearchResults.length === 0">
          No results match your query, try a different term
        </p>
        <template v-else>
          <li
            v-for="searchResult in mapboxSearchResults"
            :key="searchResult.id"
            class="py-2 cursor-pointer"
            @click="previewCity(searchResult)"
          >
            {{ searchResult.place_name }}
          </li>
        </template>
      </ul>
    </div>

    <!-- Loading message -->
    <div v-if="loading" class="flex flex-col items-center text-white py-12">
      <p>Loading weather data...</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="flex flex-col items-center text-red-600 py-12">
      <p>Failed to fetch weather data. Please try again later.</p>
    </div>

    <!-- Conditional Rendering for Weather Data -->
    <div
      v-if="weatherData && weatherDataTen"
      class="flex flex-col flex-1 items-center bg-gray-900 text-white py-12"
    >
      <!-- weather overview -->
      <div class="flex flex-col items-center">
        <!-- Location and Icon -->
        <h1 class="text-3xl md:text-5xl font-semibold mb-4">
          {{ weatherData.location.name }}, {{ weatherData.location.region }}
        </h1>
        <img
          :src="weatherData.current.condition.icon"
          alt="Weather Icon"
          class="w-20 h-20"
        />

        <!-- Last Updated Time -->
        <p class="text-sm mb-8">
          Updated:
          {{
            new Date(weatherData.current.last_updated).toLocaleString("en-IN", {
              hour: "numeric",
              minute: "numeric",
            })
          }}
        </p>

        <!-- Temperature and Condition -->
        <div class="text-center text-6xl mb-8">
          <p class="text-7xl">{{ Math.round(weatherData.current.temp_c) }}°C</p>
          <p class="text-2xl mt-5">{{ weatherData.current.condition.text }}</p>
        </div>

        <!-- Additional Weather Information -->
        <div
          class="grid grid-cols-3 gap-4 text-center w-full max-w-lg p-10 rounded-xl bg-gray-800 shadow-md"
        >
          <div class="text-gray-400">
            <p class="text-sm italic font-semibold">Wind Speed</p>
            <p class="text-xl">{{ weatherData.current.wind_kph }} km/h</p>
          </div>
          <div class="text-gray-400">
            <p class="text-sm italic font-semibold">Humidity</p>
            <p class="text-xl">{{ weatherData.current.humidity }}%</p>
          </div>
          <div class="text-gray-400">
            <p class="text-sm italic font-semibold">Visibility</p>
            <p class="text-xl">{{ weatherData.current.vis_km }} km</p>
          </div>
          <div class="text-gray-400">
            <p class="text-sm italic font-semibold">Cloudiness</p>
            <p class="text-xl">{{ weatherData.current.cloud }}%</p>
          </div>
          <div class="text-gray-400">
            <p class="text-sm italic font-semibold">Air Pressure</p>
            <p class="text-xl">{{ weatherData.current.pressure_mb }} hpa</p>
          </div>
          <div class="text-gray-400">
            <p class="text-sm italic font-semibold">UV</p>
            <p class="text-xl">{{ weatherData.current.uv }}</p>
          </div>
        </div>
      </div>

      <!-- Weather Forecast Table -->
      <div class="mt-10">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-800">
            <thead class="bg-gray-800">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Day
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Weather
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Min/Max Temp (°C)
                </th>
              </tr>
            </thead>
            <tbody class="bg-gray-900 divide-y divide-gray-800">
              <tr
                v-for="dayData in weatherDataTen.forecast.forecastday"
                :key="dayData.date"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ formatDate(dayData.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ getDayOfWeek(dayData.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <img
                    :src="dayData.day.condition.icon"
                    alt="Weather Icon"
                    class="w-8 h-8"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ Math.round(dayData.day.mintemp_c) }}°C ~
                  {{ Math.round(dayData.day.maxtemp_c) }}°C
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Show Loading Message when Weather Data is Loading -->
    <div v-else class="flex flex-col items-center text-white py-12">
      <p>Loading weather data...</p>
    </div>
  </main>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, watchEffect } from "vue";
import axiosInstance from "../authorization/api";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
const toast = useToast();

const mapBoxAPIKey =
  "pk.eyJ1IjoiYXJ1bmppdGhzdXJlbmRyYW4iLCJhIjoiY2x0a2J2OXQ3MHVrbzJqbzE0MW1semZmNCJ9.HvCIQ_P6rIKrSmqe5b3b9A";
const APIkey = "fc0f79a144e9415ca3f70223241003";
let day = 10;

const loading = ref(false);
const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(false); // Initialize error state to false
const newCity = ref("");
const weatherData = ref(null); // Initialize weatherData ref
const weatherDataTen = ref(null); // Initialize weatherDataTen ref
const isAddedToMaps = ref(false);
const currentLocation = ref(null);
const accessToken =
  "pk.eyJ1IjoiYXJ1bmppdGhzdXJlbmRyYW4iLCJhIjoiY2x0bndtODQ2MGFtYTJpcXBmcmdic3B3NSJ9.9nqnmlBgy-DAxDPWu4l3Gw";

const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        currentLocation.value = {
          latitude,
          longitude,
          placeName: await getPlaceName(latitude, longitude),
        };
        console.log(currentLocation.value.placeName);
        const placeNameParts = currentLocation.value.placeName.split(",");
        if (placeNameParts.length >= 3) {
          var thirdLastText = placeNameParts[placeNameParts.length - 3].trim();
          newCity.value = thirdLastText;
          console.log(newCity.value, "get current location");
          await getWeatherData();
          await getTenDaysData();
        } else {
          console.error("Place name does not contain enough parts.");
        }
      },
      (error) => {
        console.error("Error occurred while getting current location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

const getPlaceName = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`
    );
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      // Assuming the first feature is the most relevant one
      return data.features[0].place_name;
    } else {
      return "Unknown";
    }
  } catch (error) {
    console.error("Error occurred while fetching place name:", error);
    return "Unknown";
  }
};

const getSearchResults = () => {
  clearTimeout(queryTimeout.value);
  searchError.value = false; // Reset error state
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== "") {
      try {
        const result = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapBoxAPIKey}`
        );
        mapboxSearchResults.value = result.data.features;
      } catch (error) {
        searchError.value = true;
        console.log(error);
      }
    } else {
      mapboxSearchResults.value = null;
    }
  }, 300);
};

const getCurrentCity = async () => {
  try {
    const response = await axiosInstance.get("/weather/current-weather/get");
    newCity.value = response.data.currentCity;
    console.log(newCity.value, "initial city name");
  } catch (error) {
    console.error("Failed to get data:", error);
  }
};

const previewCity = (searchResult) => {
  const [city, state] = searchResult.place_name.split(",");
  const cityNameData = city.split(","); // Extracted city name
  const newCityName = cityNameData[0]; // Update searchQuery value
  console.log(newCityName, "searched city name");
  newCity.value = newCityName;
  mapboxSearchResults.value = null; // Clear search results
  searchQuery.value = "";
  getWeatherData();
  getTenDaysData();
  isAddedToMaps.value = false;
};

const getWeatherData = async () => {
  loading.value = true;
  isAddedToMaps.value = false;
  try {
    const responseData = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${newCity.value}&aqi=no`
    );
    weatherData.value = responseData.data;
    loading.value = false;
  } catch (error) {
    console.error("Weather API Error:", error);
    loading.value = false; // Turn off loading state in case of error
    error.value = true; // Set error state to true
  }
};

const getTenDaysData = async (placeName) => {
  loading.value = true;
  try {
    const responseTenData = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${newCity.value}&days=${day}&aqi=no&alerts=no`
    );
    weatherDataTen.value = responseTenData.data;
    loading.value = false;
  } catch (error) {
    console.error("Weather API Error:", error);
    loading.value = false; // Turn off loading state in case of error
    error.value = true; // Set error state to true
  }
};

const addNewCity = async () => {
  try {
    await axiosInstance.post("/weather/current-weather/add", {
      currentCity: newCity.value,
    });
    console.log("new city name posted");
  } catch (error) {
    console.log("failed to add city");
  }
};

const addToMaps = async () => {
  try {
    const response = await axiosInstance.post("/weather/multiple-weather/add", {
      newPlace: newCity.value,
    });
    isAddedToMaps.value = true;
    console.log(response.data);
    console.log("succesffulyy added mutiple places");
    toast.success(response.data.message);
  } catch (error) {
    console.log("failed to add");
    toast.error("existing weather data")
  }
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDayOfWeek = (dateString) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return daysOfWeek[date.getDay()];
};

onMounted(async () => {
  await getCurrentCity();
  getWeatherData();
  getTenDaysData();
});

watchEffect(() => {
  if (newCity.value.trim() !== "") {
    addNewCity();
  }
});
</script>
