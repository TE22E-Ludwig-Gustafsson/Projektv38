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
        // Skicka login-request med olika data beroende på roll
        const loginData = role.value === 'admin' ? {
            email: email.value,
            password: password.value,
            role: role.value,
            jwtSecret: jwtSecret.value
        } : {
            email: email.value,
            password: password.value,
            role: role.value,
            userClass: userClass.value
        };
        
        console.log("Sending login data:", { ...loginData, password: '***' });
        const res = await api.post("/auth/login", loginData)

        const user = res.data.user
        console.log("Backend response:", res.data);
        console.log("Token to save:", res.data.token);
        // Spara token och user info
        localStorage.setItem("token", JSON.stringify(res.data.token))

        // Add log to verify role before saving
        console.log("Role during login:", role.value);

        localStorage.setItem("isAdmin", role.value === "admin" ? "true" : "false")
        // Add log to verify isAdmin value
        console.log("isAdmin saved in localStorage:", localStorage.getItem("isAdmin"));

        localStorage.setItem("adminUser", JSON.stringify(user))

        // Navigera baserat på role och klass
        if (role.value === "admin") {
            console.log("Sparar admin info");
            const adminData = { isAdmin: true, class: "admin" };
            localStorage.setItem("adminUser", JSON.stringify(adminData));
            console.log("Sparad admin data:", adminData);
            router.push("/dashboard");
        } else {
            console.log("Sparar användarinfo med klass:", userClass.value);
            const userData = { 
                isAdmin: false, 
                class: userClass.value 
            };
            localStorage.setItem("regularUser", JSON.stringify(userData));
            console.log("Sparad användardata:", userData);
            
            // Dirigera till rätt kurslista baserat på klass
            switch(userClass.value) {
                case "1A":
                    router.push("/KursListA");
                    break;
                case "1B":
                    router.push("/KursListB");
                    break;
                case "1C":
                    router.push("/KursListC");
                    break;
                default:
                    console.error("Ogiltig klass:", userClass.value);
            }
        }

    } catch (err) {
        errorMessage.value = err.response?.data?.msg || "Inloggning misslyckades"
    }
}
</script>
