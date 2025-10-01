import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue'; // admin-sida
import KursList from '../components/KursList.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard, meta: { requiresAdmin: true } },
  { path: '/KursList', component: KursList },
  { path: '/', redirect: '/login' }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  //const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!token && to.path !== '/login') {
    return next('/login'); // ej inloggad → login
  }

  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/Kurser'); // user försöker gå till admin → redirect
  }

  next();
});

export default router;
