<template>
    <nav style="display: flex; gap: 1rem; padding: 1rem; background: #222; color: #fff;">
        <button v-if="!isLoggedIn" @click="goToLogin">Login</button>
        <button v-if="!isLoggedIn" @click="goToRegister">Register</button>
        <button v-if="isLoggedIn" @click="handleLogout">Logout</button>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    user: { type: Object, default: null },
    isAdmin: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false }
})

const emit = defineEmits(['logout'])
const router = useRouter()

function goToLogin() { router.push('/login') }
function goToRegister() { router.push('/register') }
function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    emit('logout')
    router.push('/login')
}
</script>
