<template>
    <!-- NavBar hanterar inloggningsstatus via prop -->
    <NavBar :isLoggedIn="isLoggedIn" @logout="handleLogout" />

    <div class="app-container">
        <router-view v-slot="{ Component }">
            <component :is="Component" :user="user" :isAdmin="isAdmin" />
        </router-view>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import api from './services/api'

const user = ref(null)
const isAdmin = ref(false)
const route = useRoute()

const isLoggedIn = computed(() => !!user.value)

// Hämtar användarinformation från backend baserat på token
async function fetchMe() {
    const token = localStorage.getItem('token')
    if (!token) {
        user.value = null
        isAdmin.value = false
        return
    }

    try {
        const res = await api.get('/auth/me')
        user.value = res.data
        isAdmin.value = res.data.isAdmin
        localStorage.setItem('isAdmin', res.data.isAdmin)
    } catch {
        user.value = null
        isAdmin.value = false
        localStorage.removeItem('token')
        localStorage.removeItem('isAdmin')
    }
}

// Logga ut-funktion
function handleLogout() {
    user.value = null
    isAdmin.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
}

// Kör fetchMe när appen startar och vid route-ändring
onMounted(fetchMe)
watch(() => route.path, () => { fetchMe() })
</script>

<style>
@import './assets/style.css';
</style>
