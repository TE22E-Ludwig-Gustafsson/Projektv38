<template>
    <div class="form-container">
        <div class="form-box">
            <h2>Logga in</h2>
            <form @submit.prevent="submit">
                <input v-model="email" placeholder="Email" />
                <p v-if="emailError" style="color:red"> {{ emailError }}</p>

                <input v-model="password" type="password" placeholder="Password" />
                <p v-if="passwordError" style="color:red"> {{ passwordError }}</p>


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
const emailError = ref('')
const passwordError = ref('')


const submit = async () => {
    errorMessage.value = ''
    emailError.value = ''
    passwordError.value = ''

    if (!email.value.includes('@')) {
        emailError.value = "E-post måste innehålla '@'."
    }

    if (password.value.length < 6) {
        passwordError.value = "Lösenord måste vara minst 6 tecken."
    }

    if (emailError.value || passwordError.value) return

    // Admin måste ange jwtSecret
    if (role.value === 'admin' && !jwtSecret.value) {
        errorMessage.value = 'Admin måste ange JWT Secret.'
        return
    }

    try {
        const loginData = {
            email: email.value,
            password: password.value,
            role: role.value,
            ...(role.value === 'admin' && { jwtSecret: jwtSecret.value }),
            ...(role.value === 'user' && { userClass: userClass.value })
        }

        const res = await api.post("/auth/login", loginData)

        // Om login lyckas sparar vi token och användardata
        const user = res.data.user
        localStorage.setItem("token", JSON.stringify(res.data.token))
        localStorage.setItem("isAdmin", role.value === "admin" ? "true" : "false")

        if (role.value === 'admin') {
            localStorage.setItem("adminUser", JSON.stringify(user))
            router.push("/dashboard")
        } else {
            localStorage.setItem("regularUser", JSON.stringify({ isAdmin: false, class: userClass.value }))
            switch (userClass.value) {
                case "1A": router.push("/KursListA"); break;
                case "1B": router.push("/KursListB"); break;
                case "1C": router.push("/KursListC"); break;
            }
        }

    } catch (err) {
        // Visa fel från backend
        errorMessage.value = err.response?.data?.msg || "Inloggning misslyckades"
    }
}
</script>
