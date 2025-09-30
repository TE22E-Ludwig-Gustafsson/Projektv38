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

            <p v-if="errorMessage" style="color:red">{{ errorMessage }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { jwtDecode } from 'jwt-decode'


const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('user')
const jwtSecret = ref('')
const errorMessage = ref('')

const submit = async () => {
    errorMessage.value = ''

    if (!email.value || !password.value) {
        errorMessage.value = 'Fyll i både e-post och lösenord.'
        return
    }

    if (role.value === 'admin' && !jwtSecret.value) {
        errorMessage.value = 'Admin måste ange JWT Secret.'
        return
    }

    try {
        const res = await api.post('/auth/login', {
            email: email.value,
            password: password.value,
            role: role.value,
            jwtSecret: jwtSecret.value
        })

        localStorage.setItem('token', res.data.token)
        const decoded = jwtDecode(res.data.token)
        localStorage.setItem('isAdmin', decoded.isAdmin)

        decoded.isAdmin ? router.push('/dashboard') : router.push('/courseList')
    } catch (err) {
        console.error('Login error:', err)
        if (err.response?.data?.msg) {
            errorMessage.value = `Fel: ${err.response.data.msg}`
        } else {
            errorMessage.value = 'Login misslyckades – kontrollera nätverk eller server.'
        }
    }
}
</script>
