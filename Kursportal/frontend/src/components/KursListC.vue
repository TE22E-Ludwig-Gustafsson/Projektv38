<template>
    <div class="Kursbackground">
        <h1 style="text-align: center; color: #333; margin: 20px 0; font-size: 24px;">Klass C - Kurslista</h1>
        <div class="kurs-container">
            <!-- Kurskort -->
            <div v-for="kurs in filteredKurser" :key="kurs._id" class="kurs-card">
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
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import { kurserState } from '../state/kurser'

const selectedKurs = ref(null)

// Filtrera kurser för klass C
const filteredKurser = computed(() => {
    return kurserState.value.filter(kurs => kurs.class === "1C").map(kurs => {
        const dateObj = new Date(kurs.date)
        dateObj.setHours(dateObj.getHours() - 1)
        const date = dateObj.toLocaleDateString('sv-SE')
        const time = dateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
        return { ...kurs, date, time, teacher: kurs.teacher || '' }
    });
});

// Hämta kurser
async function fetchKurser() {
    try {
        const res = await api.get('/items');
        kurserState.value = res.data;
    } catch (err) {
        console.error('Kunde inte hämta kurser:', err);
    }
}

onMounted(() => {
    fetchKurser();
})

const openKurs = (kurs) => { selectedKurs.value = kurs }
const closeKurs = () => { selectedKurs.value = null }
</script>