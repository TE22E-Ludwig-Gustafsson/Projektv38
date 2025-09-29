<!-- filepath: c:\Users\ludwig.gustafsson4\.vscode\Java\Projektv38\Kursportal\frontend\src\components\Register.vue -->
<template>
    <div>
        <h2>Register</h2>
        <form @submit.prevent="submit">
            <input v-model="name" placeholder="Name" />
            <input v-model="email" placeholder="Email" />
            <input v-model="password" type="password" placeholder="Password" />
            <select v-model="role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <input v-if="role === 'admin'" v-model="jwtSecret" placeholder="JWT Secret" />
            <button type="submit">Registrera</button>
        </form>
    </div>
</template>

<script>
import api from '../services/api';

export default {
    data() {
        return { name: '', email: '', password: '', role: 'user', jwtSecret: '' };
    },
    methods: {
        async submit() {
            try {
                console.log(this.jwtSecret);

                await api.post('/auth/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    role: this.role,
                    jwtSecret: this.jwtSecret
                });
                alert('Registered successfully! You can now log in.');
            } catch (err) {
                alert('Registration failed');
            }
        }
    }
}
</script>
