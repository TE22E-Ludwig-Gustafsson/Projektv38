<!-- filepath: c:\Users\ludwig.gustafsson4\.vscode\Java\Projektv38\Kursportal\frontend\src\components\NavBar.vue -->
<template>
    <nav style="display: flex; gap: 1rem; padding: 1rem; background: #222; color: #fff;">
        <button v-if="!isLoggedIn" @click="goToLogin">Login</button>
        <button v-if="!isLoggedIn" @click="goToRegister">Registrera</button>
        <button v-if="isLoggedIn" @click="addCourse">Lägg till kurs</button>
        <button v-if="isLoggedIn" @click="removeCourse">Ta bort kurs</button>
        <button v-if="isLoggedIn" @click="logout">Gå tillbaka</button>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(localStorage.getItem('token') ? true : false)

function goToLogin() {
    router.push('/login')
}
function goToRegister() {
    router.push('/register')
}
function addCourse() {
    router.push('/add-course')
}
function removeCourse() {
    router.push('/remove-course')
}
function logout() {
    localStorage.removeItem('token')
    isLoggedIn.value = false
    router.push('/login')
}

// Lyssna på token-ändringar (om du loggar in någon annanstans)
window.addEventListener('storage', () => {
    isLoggedIn.value = localStorage.getItem('token') ? true : false
})
</script>