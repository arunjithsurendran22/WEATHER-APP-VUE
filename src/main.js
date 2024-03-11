import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import "./style.css";
import Home from "./components/Home.vue";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Weathers from "./components/Weathers.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/weathers",
      name: "Weathers",
      component: Weathers,
    },
  ],
});

const app = createApp(App);

app.use(router);

app.mount("#app");
