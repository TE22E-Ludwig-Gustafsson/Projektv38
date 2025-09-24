<template>
    <NavBar />
    <router-view />
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from './services/api';

export default {
    setup() {
        const user = ref(null);
        const router = useRouter();

        const fetchMe = async () => {
            try {
                const res = await api.get('/auth/me');
                user.value = res.data;
            } catch {
                user.value = null;
            }
        };

        if (localStorage.getItem('token')) fetchMe();

        const logout = () => {
            localStorage.removeItem('token');
            user.value = null;
            router.push('/login');
        };

        const go = (path) => router.push(path);

        const onLogin = (loggedInUser) => {
            user.value = loggedInUser;
            router.push('/');
        };

        return { user, logout, go, onLogin };
    }
};
</script>
