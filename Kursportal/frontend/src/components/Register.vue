<template>
    <div class="form-container">
        <div class="form-box">
            <h2 class="title">Registrera</h2>
            <form @submit.prevent="submit" class="form-spacing">
                <input v-model="name" placeholder="Namn" class="input" required />
                <input v-model="email" type="text" placeholder="E-post" class="input" required />
                <input v-model="password" type="password" placeholder="Lösenord" class="input" required />

                <!-- Role Selection -->
                <div class="select-wrapper">
                    <select v-model="role" class="input select-styled">
                        <option value="user">Användare</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div v-if="role === 'user'" class="select-wrapper">

                    <select v-model="userClass" class="input select-styled" required>
                        <option value="" disabled>Välj Klass</option>
                        <option value="klass-a">Klass A</option>
                        <option value="klass-b">Klass B</option>
                        <option value="klass-c">Klass C</option>
                    </select>

                </div>
                <!-- Admin Secret Field -->
                <input v-if="role === 'admin'" v-model="jwtSecret" type="password" placeholder="Hemlig Nyckel"
                    class="input" required />

                <button type="submit" class="btn w-full">Registrera</button>

                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>

                <p v-if="successMessage" class="success-message">
                    {{ successMessage }}
                </p>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('user')
const jwtSecret = ref('')
const userClass = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const submit = async () => {
    // Rensa meddelanden vid nytt försök
    errorMessage.value = ''
    successMessage.value = ''

    try {
        const res = await api.post('/auth/register', {
            name: name.value,
            email: email.value,
            password: password.value,
            role: role.value,
            userClass: userClass.value,
            jwtSecret: jwtSecret.value,
        })

        // Hantera framgång
        successMessage.value = 'Registrering lyckades! Omdirigerar...'

        setTimeout(() => {
            router.push('/login')
        }, 1500) // Ger användaren 1.5 sekunder att se framgångsmeddelandet

    } catch (err) {
        console.error('Registration error:', err)
        errorMessage.value = err.response?.data?.msg || 'Registreringen misslyckades. Kontrollera nätverket eller försök igen.'
    }
}
</script>
