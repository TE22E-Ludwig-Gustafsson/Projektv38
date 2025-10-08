<template>
    <div class="Kursbackground">
        
    <div class="kurs-container">
        <!-- Kurskort -->
        <div v-for="kurs in kurserState" :key="kurs._id" class="kurs-card">
            <h3 class="kurs-title">{{ kurs.name }}</h3>
            <p class="kurs-detail">{{ kurs.date }} {{ kurs.time }}</p>
            <p class="kurs-detail">Lärare: {{ kurs.teacher }}</p>
            <button @click="openKurs(kurs)">Gå till kurs</button>
        </div>

        <!-- Modal -->
        <div v-if="selectedKurs" class="modal-overlay" @click.self="closeKurs">
            <div class="modal-content">
                <button class="close-btn" @click="closeKurs">&times;</button>
                <h2>{{ selectedKurs.name }}</h2>
                <p><strong>Datum:</strong> {{ selectedKurs.date }} {{ selectedKurs.time }}</p>
                <p><strong>Lärare:</strong> {{ selectedKurs.teacher }}</p>
                <p><strong>Beskrivning:</strong> {{ selectedKurs.description }}</p>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { kurserState } from '../state/kurser'
import { ref, onMounted } from 'vue'
import api from '../services/api'

const kurser = kurserState
const selectedKurs = ref(null)

function showDesciption(kurs) {
    selectedKurs.value = kurs
}
const fetchKurser = async () => {
    try {
        const res = await api.get('/items')
        kurser.value = res.data.map(c => {
            const dateObj = new Date(c.date)
            dateObj.setHours(dateObj.getHours() - 1)
            const date = dateObj.toLocaleDateString('sv-SE')
            const time = dateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
            return { ...c, date, time, teacher: c.teacher || '' }
        })
    } catch (err) {
        console.error('Kunde inte hämta kurser:', err)
    }
}

onMounted(fetchKurser)

const openKurs = (kurs) => { selectedKurs.value = kurs }
const closeKurs = () => { selectedKurs.value = null }
</script>