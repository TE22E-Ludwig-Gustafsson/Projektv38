<template>
    <div>
        <h2>Register</h2>
        <form @submit.prevent="submit">
            <input v-model="name" placeholder="Name" />
            <input v-model="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <button type="submit">Registrera</button>
        </form>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return { name: '', email: '', password: '' };
    },
    methods: {
        async submit() {
            try {
                await api.post('/auth/register', { name: this.name, email: this.email, password: this.password });
                alert('Registered successfully! You can now log in.');
            } catch (err) {
                alert('Registration failed');
            }
        }
    }
}
</script>
