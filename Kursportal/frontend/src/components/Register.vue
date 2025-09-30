<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="submit">
      <input v-model="name" placeholder="Name" required />
      <input v-model="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <select v-model="role">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <input v-if="role === 'admin'" v-model="jwtSecret" placeholder="JWT Secret" required />
      <button type="submit">Register</button>
    </form>
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

const submit = async () => {
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
      jwtSecret: jwtSecret.value
    })
    alert('Registration successful')
    router.push('/login')
  } catch (err) {
    alert(err.response?.data?.msg || 'Registration failed')
  }
}
</script>
