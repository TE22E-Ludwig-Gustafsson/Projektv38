<template>
    <div class="form-container">
        <div class="form-box">
            <h2>Logga in</h2>
            <form @submit.prevent="submit">
                <input v-model="email" placeholder="Email" />
                <input v-model="password" type="password" placeholder="Password" />

                <select v-model="role">
                    <option value="user">Användare</option>
                    <option value="admin">Admin</option>
                </select>

                <input v-if="role === 'admin'" v-model="jwtSecret" type="password" placeholder="Hemlig Nyckel" />

                <button type="submit">Logga in</button>

                <p v-if="errorMessage" style="color:red">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('user')
const jwtSecret = ref('')
const errorMessage = ref('')

const submit = async () => {
    errorMessage.value = ''

    if (role.value === 'admin' && !jwtSecret.value) {
        errorMessage.value = 'Admin måste ange JWT Secret.'
        return
    }

    if (role.value === 'user' && (!email.value || !password.value)) {
        errorMessage.value = 'Fyll i både e-post och lösenord.'
        return
    }

    try {
        const res = await api.post("/auth/login", {
            email: email.value,
            password: password.value,
            role: role.value,
            jwtSecret: jwtSecret.value,
        })

        // Spara token i localStorage
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("isAdmin", role.value === "admin" ? "true" : "false")

        // Navigera med router
        if (role.value === "admin") router.push("/dashboard") && isLoggedIn == true
        else router.push("/KursList") && isLoggedIn == true

    } catch (err) {
        errorMessage.value = err.response?.data?.msg || "Inloggning misslyckades"
    }
}
</script>
