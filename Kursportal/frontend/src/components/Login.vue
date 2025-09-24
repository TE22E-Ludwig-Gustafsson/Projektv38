<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="submit">
            <input v-model="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return { email: '', password: '' };
    },
    methods: {
        async submit() {
            try {
                const res = await api.post('/auth/login', { email: this.email, password: this.password });
                localStorage.setItem('token', res.data.token);
                this.$emit('login', res.data.user);
            } catch (err) {
                alert('Login failed');
            }
        }
    }
}
</script>
