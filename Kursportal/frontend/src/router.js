// frontend/src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import Dashboard from "./components/Dashboard.vue";
import CourseList from "./components/CourseList.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true, adminOnly: true },
  },
  { path: "/courseList", component: CourseList, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (to.meta.requiresAuth && !token) return next("/login");
  if (to.meta.adminOnly && !isAdmin) return next("/courseList");
  if ((to.path === "/login" || to.path === "/register") && token) {
    return isAdmin ? next("/dashboard") : next("/courseList");
  }
  next();
});

export default router;
