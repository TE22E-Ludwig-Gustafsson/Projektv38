<template>
    <div class="page-container">
        <h2 class="title-lg">Kurs lista</h2>

        <!-- Formulär för att lägga till kurs -->
        <form @submit.prevent="addKurs" class="form-add-kurs">
            <input v-model="newName" placeholder="Kurs namn" class="input" />
            <input type="date" v-model="newDate" class="input" />
            <input type="time" v-model="newTime" class="input" />
            <input v-model="newTeacher" placeholder="Lärare" class="input" />
            <button type="submit" class="btn">Lägg till</button>
        </form>

        <p v-if="addKursError" class="error-message">{{ addKursError }}</p>

        <!-- Lista över kurser -->
        <div class="kurs-grid">
            <div v-for="kurs in kurser" :key="kurs._id" class="kurs-card">
                <input v-model="kurs.name" @change="updateKurs(kurs)" class="input" />
                <input type="date" v-model="kurs.date" @change="updateKurs(kurs)" class="input" />
                <input type="time" v-model="kurs.time" @change="updateKurs(kurs)" class="input" />
                <input v-model="kurs.teacher" @change="updateKurs(kurs)" class="input" />
                <button @click="deleteKurs(kurs._id)" class="btn btn-danger">Radera</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const kurser = ref([])
const newName = ref('')
const newDate = ref('')
const newTime = ref('')
const newTeacher = ref('')
const addKursError = ref('')

async function fetchKurser() {
    try {
        const res = await api.get('/items')
        kurser.value = res.data.map(c => {
            const [date, time] = (c.date || '').split('T')
            return { ...c, date, time: time?.slice(0, 5) || '', teacher: c.teacher || '' }
        })
    } catch (err) {
        console.error('Kunde inte hämta kurser:', err)
    }
}

onMounted(fetchKurser)

async function addKurs() {
    addKursError.value = ''
    if (!newName.value || !newDate.value || !newTime.value || !newTeacher.value) {
        addKursError.value = 'Alla fält måste fyllas i.'
        return
    }
    const isoDate = new Date(`${newDate.value}T${newTime.value}`).toISOString()

    try {
        const res = await api.post('/items', { name: newName.value, date: isoDate, teacher: newTeacher.value }
            //{ headers: { Authorization: `Bearer ${token}` } }
        )
        kurser.value.push(res.data)
        newName.value = newDate.value = newTime.value = newTeacher.value = ''
    } catch (err) {
        addKursError.value = err.response?.data?.msg || 'Misslyckades att lägga till kurs.'
        console.error(err)
    }
}

async function updateKurs(kurs) {
    const isoDate = new Date(`${kurs.date}T${kurs.time}`).toISOString()

    /*const token = localStorage.getItem('token')
    if (!token) return*/

    try {
        await api.put(`/items/${kurs._id}`, { name: kurs.name, date: isoDate, teacher: kurs.teacher }
            //, { headers: { Authorization: `Bearer ${token}` } }
        )
    } catch (err) {
        console.error('Kunde inte uppdatera kurs:', err)
    }
}

async function deleteKurs(id) {
    /*const token = localStorage.getItem('token')
    if (!token) return*/

    try {
        await api.delete(`/items/${id}`,
            //{ headers: { Authorization: `Bearer ${token}` } }
        )
        kurser.value = kurser.value.filter(c => c._id !== id)
    } catch (err) {
        console.error('Kunde inte radera kurs:', err)
        alert('Kunde inte radera kursen. Kontrollera dina behörigheter.')
    }
}
</script>