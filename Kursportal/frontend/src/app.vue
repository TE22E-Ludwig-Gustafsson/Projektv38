<template>
  <NavBar 
    :user="user" 
    :isAdmin="isAdmin" 
    :isLoggedIn="isLoggedIn" 
    @logout="handleLogout" 
  />
  <router-view v-slot="{ Component }">
    <component :is="Component" :isAdmin="isAdmin" :user="user" />
  </router-view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from './components/NavBar.vue'
import api from './services/api'

const router = useRouter()
const user = ref(null)
const isAdmin = ref(false)

const isLoggedIn = computed(() => !!user.value)

const fetchMe = async () => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')

  try {
    const res = await api.get('/auth/me')
    user.value = res.data
    isAdmin.value = res.data.isAdmin
    localStorage.setItem('isAdmin', res.data.isAdmin)

    const path = res.data.isAdmin ? '/dashboard' : '/courseList'
    if (router.currentRoute.value.path !== path && router.currentRoute.value.path !== '/') {
      router.push(path)
    }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
    user.value = null
    isAdmin.value = false
    router.push('/login')
  }
}

function handleLogout() {
  user.value = null
  isAdmin.value = false
}

onMounted(fetchMe)
defineExpose({ fetchMe })
</script>
