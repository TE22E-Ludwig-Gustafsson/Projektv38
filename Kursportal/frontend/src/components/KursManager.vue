<template>
    <div class="page-container">
        <h2 class="title-lg">Kurs lista</h2>
        <button @click="openAddModal" class="btn">+ Skapa ny kurs</button>

    
        <!-- Skapa modal för popup ruta till skapa kurs-->
         
        <!-- Formulär för att lägga till kurs -->
        <form @submit.prevent="addKurs" class="form-add-kurs">
            <input v-model="newName" placeholder="Kurs namn" class="input" />
            <input type="date" v-model="newDate" class="input" />
            <input type="time" v-model="newTime" class="input" />
            <input v-model="newTeacher" placeholder="Lärare" class="input" />
            <textarea v-model="newDescription" placeholder="Beskrivning" class="input"></textarea>
            <button type="submit" class="btn">Lägg till</button>
        </form>

        <p v-if="addKursError" class="error-message">{{ addKursError }}</p>

        <!-- Lista över kurser -->
        <div class="kurs-grid">
            <div v-for="kurs in kurserState" :key="kurs._id" class="kurs-card">
                <input v-model="kurs.name" @change="updateKurs(kurs)" class="input" />
                <input type="date" v-model="kurs.date" @change="updateKurs(kurs)" class="input" />
                <input type="time" v-model="kurs.time" @change="updateKurs(kurs)" class="input" />
                <input v-model="kurs.teacher" @change="updateKurs(kurs)" class="input" />
                <input v-model="kurs.description" @change="updateKurs(kurs)" class="input" placeholder="Beskrivning" />
                <button @click="deleteKurs(kurs._id)" class="btn btn-danger">Radera</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { kurserState } from '../state/kurser'

const newDescription = ref('')
const newName = ref('')
const newDate = ref('')
const newTime = ref('')
const newTeacher = ref('')
const addKursError = ref('')

async function fetchKurser() {
    try {
        const res = await api.get('/items')
        kurserState.value = res.data.map(c => {
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
        const res = await api.post('/items', { name: newName.value, date: isoDate, teacher: newTeacher.value, description: newDescription.value })
        const [date, time] = res.data.date.split('T')
        kurserState.value.push({ ...res.data, date, time: time?.slice(0, 5) || '', teacher: res.data.teacher, description: res.data.description || '' })
        newName.value = newDate.value = newTime.value = newTeacher.value = newDescription.value = ''
    } catch (err) {
        addKursError.value = err.response?.data?.msg || 'Misslyckades att lägga till kurs.'
        console.error(err)
    }
}

async function updateKurs(kurs) {
    try {
        const isoDate = new Date(`${kurs.date}T${kurs.time}`).toISOString()

        const res = await api.put(`/items/${kurs._id}`, {
            name: kurs.name,
            date: isoDate,
            teacher: kurs.teacher,
            description: kurs.description
        })

        const index = kurser.value.findIndex(k => k._id === kurs._id)
        if (index !== -1) {
            const dateObj = new Date(res.data.date)
            const date = dateObj.toLocaleDateString('sv-SE')
            const time = dateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
            kurser.value[index] = { ...res.data, date, time, teacher: res.data.teacher || '' }
        }

    } catch (err) {
        console.error('Kunde inte uppdatera kurs:', err)
    }
}



async function deleteKurs(id) {
    try {
        await api.delete(`/items/${id}`)
        kurserState.value = kurserState.value.filter(c => c._id !== id)
    } catch (err) {
        console.error('Kunde inte radera kurs:', err)
        alert('Kunde inte radera kursen. Kontrollera dina behörigheter.')
    }
}
</script>