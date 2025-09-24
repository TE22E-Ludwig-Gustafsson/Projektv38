import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Dashboard from "./components/Dashboard.vue"; // Ändrad sökväg

const routes = [
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/dashboard", component: Dashboard },
  // ...andra routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
