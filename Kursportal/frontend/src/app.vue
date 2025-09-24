<template>
    <div>
        <header style="display:flex;justify-content:space-between;align-items:center">
            <h1>Kursportal</h1>
            <div>
                <button v-if="!user" @click="go('/login')">Login</button>
                <button v-if="!user" @click="go('/register')">Registrera</button>
                <button v-if="user" @click="logout">Logout</button>
            </div>
        </header>
        <router-view @login="onLogin" />
    </div>
</template>

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
