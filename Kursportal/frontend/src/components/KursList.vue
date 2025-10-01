<template>
  <div class="kurs-container">
    <!-- Kurskort -->
    <div v-for="kurs in kurser" :key="kurs._id" class="kurs-card">
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
        <p><strong>Beskrivning:</strong> {{ selectedKurs.description || 'Ingen beskrivning' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const kurser = ref([])
const selectedKurs = ref(null)

const fetchKurser = async () => {
  try {
    const res = await api.get('/items')
    kurser.value = res.data.map(c => {
      const [date, time] = (c.date || '').split('T')
      return { ...c, date, time: time?.slice(0,5) || '', teacher: c.teacher || '' }
    })
  } catch (err) {
    console.error('Kunde inte hämta kurser:', err)
  }
}

const openKurs = (kurs) => {
  selectedKurs.value = kurs
}

const closeKurs = () => {
  selectedKurs.value = null
}

onMounted(fetchKurser)
</script>
