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
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import api from '../services/api';
import jwt_decode from 'jwt-decode';

export default {
    data() {
        return { email: '', password: '', role: 'user' };
    },
    methods: {
        async submit() {
            try {
                const res = await api.post('/auth/login', {
                    email: this.email,
                    password: this.password,
                    role: this.role // Skicka med rollen till backend
                });
                localStorage.setItem('token', res.data.token);
                const decoded = jwt_decode(res.data.token);
                localStorage.setItem('isAdmin', decoded.isAdmin); // Spara admin-status
                this.$router.push('/dashboard');
            } catch (err) {
                alert('Login failed');
            }
        }
    }
}
</script>