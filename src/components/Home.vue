<template>
  <main class="container text-white">
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
import { ref } from "vue";

const mapBoxAPIKey =
  "pk.eyJ1IjoiYXJ1bmppdGhzdXJlbmRyYW4iLCJhIjoiY2x0a2J2OXQ3MHVrbzJqbzE0MW1semZmNCJ9.HvCIQ_P6rIKrSmqe5b3b9A";

const searchQuery = ref("");
const queryTimeout = ref(null);
const mapboxSearchResults = ref(null);
const searchError = ref(false); // Initialize error state to false

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

// Function to handle city preview
const previewCity = (searchResult) => {
  const [city, state] = searchResult.place_name.split(",");
  searchQuery.value = city.trim();
  const APIkey = "fc0f79a144e9415ca3f70223241003";
  let day = 10;
  console.log(city);
  getWeatherData(city, APIkey); // Pass the selected city to getWeatherData
  getTenDaysData(city, day, APIkey); // Pass the selected city to getTenDaysData
  mapboxSearchResults.value = null; // Clear the dropdown results
};

const getWeatherData = async (city, APIkey) => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${city}&aqi=no`
    );
    // Assign response to weatherData
    weatherData.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const getTenDaysData = async (city, day, APIkey) => {
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/forecast.json?key=${APIkey}&q=${city}&days=${day}&aqi=no&alerts=no`
    );
    // Assign response to weatherDataTen
    weatherDataTen.value = response.data;
  } catch (error) {
    console.log(error);
  }
};

const weatherData = ref(null); // Initialize weatherData ref
const weatherDataTen = ref(null); // Initialize weatherDataTen ref

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
</script>
