// frontend/src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Dashboard from "./components/DashBoard.vue";
import KursList from "./components/KursList.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, adminOnly: true },
  },
  { path: "/KursList", component: KursList, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Admin behöver bara isAdmin, vanliga användare behöver token
  if (to.meta.requiresAuth && !isAdmin && !token) return next("/login");
  if (to.meta.adminOnly && !isAdmin) return next("/KursList");
  if ((to.path === "/login" || to.path === "/register") && (token || isAdmin)) {
    return isAdmin ? next("/dashboard") : next("/KursList");
  }
  next();
});

export default router;
