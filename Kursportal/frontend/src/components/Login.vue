<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="submit">
            <input v-model="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <select v-model="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <input v-if="role === 'admin'" v-model="jwtSecret" placeholder="JWT Secret" />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

export default {
    data() {
        return { email: '', password: '', role: 'user', jwtSecret: '' };

    },
    methods: {
        // ...existing code...
        async submit() {
            try {
                const res = await api.post('/auth/login', {
                    email: this.email,
                    password: this.password,
                    role: this.role,
                    jwtSecret: this.jwtSecret // Skickas bara om admin
                });
                localStorage.setItem('token', res.data.token);
                const decoded = jwtDecode(res.data.token);
                localStorage.setItem('isAdmin', decoded.isAdmin);
                this.$router.push('/dashboard');
            } catch (err) {
                alert('Login failed');
            }
        }
        // ...existing code...
    }
}
</script>