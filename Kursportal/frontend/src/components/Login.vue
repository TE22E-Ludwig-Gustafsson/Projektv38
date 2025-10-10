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

                <select v-if="role === 'user'" v-model="userClass" required>
                    <option value="" disabled selected>Välj klass</option>
                    <option value="1A">Klass A</option>
                    <option value="1B">Klass B</option>
                    <option value="1C">Klass C</option>
                </select>

                <input v-if="role === 'admin'" v-model="jwtSecret" type="password" placeholder="Hemlig nyckel" />

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
const userClass = ref('')
const errorMessage = ref('')

const submit = async () => {
    errorMessage.value = ''

    // Validering
    if (role.value === 'admin' && !jwtSecret.value) {
        errorMessage.value = 'Admin måste ange JWT Secret.'
        return
    }

    if (role.value === 'user' && (!email.value || !password.value || !userClass.value)) {
        errorMessage.value = 'Fyll i både e-post, lösenord och klass.'
        return
    }

    try {
        // Skicka login-request
        const res = await api.post("/auth/login", {
            email: email.value,
            password: password.value,
            role: role.value,
            jwtSecret: jwtSecret.value,
            userClass: userClass.value,
        })

        const user = res.data.user
        console.log("token:" + res.data.token);
        // Spara token och user info
        localStorage.setItem("token", JSON.stringify(res.data.token))

        localStorage.setItem("isAdmin", role.value === "admin" ? "true" : "false")

        localStorage.setItem("admin", JSON.stringify(user))

        // Navigera baserat på role
        if (role.value === "admin") {
            // Spara token och user info
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("admin", JSON.stringify({ isAdmin: true, class: "admin" }))
            router.push("/dashboard")
        } else {
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify({ isAdmin: false, class: userClass.value }))
            router.push("/KursList")
        }

    } catch (err) {
        errorMessage.value = err.response?.data?.msg || "Inloggning misslyckades"
    }
}
</script>
