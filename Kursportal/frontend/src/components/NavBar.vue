<template>
    <nav class="navbar">
        <div class="logo" @click="goToHome">Kursportal</div>
        <div class="nav-links">
            <button v-if="!isLoggedIn" @click="goToLogin" class="btn">Logga in</button>
            <button v-if="!isLoggedIn" @click="goToRegister" class="btn">Registrera</button>
            <button v-if="isLoggedIn" @click="handleLogout" class="btn btn-danger">Logga ut</button>
        </div>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({ isLoggedIn: Boolean })
const emit = defineEmits(['logout'])

function handleLogout() {
    emit('logout')
    router.push('/')
}

function goToLogin() { router.push('/login') }
function goToRegister() { router.push('/register') }
function goToHome() { router.push('/') }
</script>
