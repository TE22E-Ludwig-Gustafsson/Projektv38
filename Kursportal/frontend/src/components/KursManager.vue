<template>
    <div class="page-container">
        <h2 class="title-lg">Kurs lista</h2>

        <!-- Administrera kurser formulär (endast för admin) -->
        <form v-if="isAdmin" @submit.prevent="addKurs" class="form-add-kurs">
            <input v-model="newName" placeholder="Kurs namn" class="input" />
            <input type="date" v-model="newDate" class="input" />
            <input type="time" v-model="newTime" class="input" />
            <input v-model="newTeacher" placeholder="Lärare" class="input" />

            <select v-model="newClass" class="input" required>
                <option value="" disabled selected>Välj Klass</option>
                <option value="1A">Klass A</option>
                <option value="1B">Klass B</option>
                <option value="1C">Klass C</option>
            </select>

            <textarea v-model="newDescription" placeholder="Beskrivning" class="input"></textarea>
            <button type="submit" class="btn">Lägg till</button>
        </form>

        <p v-if="addKursError" class="error-message">{{ addKursError }}</p>

        <!-- Visa alla kurser i rutnät -->
        <div class="kurs-grid">
            <div v-for="kurs in kurserState" :key="kurs._id" class="kurs-card">
                <input v-model="kurs.name" @change="updateKurs(kurs)" class="input" :readonly="!isAdmin" />
                <input type="date" v-model="kurs.date" @change="updateKurs(kurs)" class="input" :readonly="!isAdmin" />
                <input type="time" v-model="kurs.time" @change="updateKurs(kurs)" class="input" :readonly="!isAdmin" />
                <input v-model="kurs.teacher" @change="updateKurs(kurs)" class="input" :readonly="!isAdmin" />
                <select v-model="kurs.class" @change="updateKurs(kurs)" class="input" :disabled="!isAdmin">
                    <option value="1A">Klass A</option>
                    <option value="1B">Klass B</option>
                    <option value="1C">Klass C</option>
                </select>
                <input v-model="kurs.description" @change="updateKurs(kurs)" class="input" placeholder="Beskrivning"
                    :readonly="!isAdmin" />
                <button v-if="isAdmin" @click="deleteKurs(kurs._id)" class="btn btn-danger">Radera</button>
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
const newClass = ref('')
const addKursError = ref('')
const isAdmin = ref(false)

// Kontrollera användarens behörighet och hämta relevanta kurser
onMounted(() => {
    const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
    const regularUser = JSON.parse(localStorage.getItem("regularUser") || "{}");
    
    console.log("AdminUser från localStorage:", adminUser);
    console.log("RegularUser från localStorage:", regularUser);
    
    // Bestäm användartyp och behörighet
    const user = adminUser.isAdmin ? adminUser : regularUser;
    console.log("Vald användare:", user);
    
    // Aktivera admin-läge om behörig
    isAdmin.value = !!user.isAdmin;
    console.log("Admin-behörighet:", isAdmin.value);
    
    // Hantera klasstillhörighet för kurshämtning
    let userClass = null;
    if (!isAdmin.value && user.class) {
        userClass = user.class;
        console.log("Vanlig användare, hämtar kurser för klass:", userClass);
    } else if (isAdmin.value) {
        console.log("Administratör, hämtar alla kurser");
    } else {
        console.log("Varning: Användaren saknar klasstillhörighet");
    }
    
    // Loggning av användarkontext
    console.log("Användarinformation:", {
        isAdmin: isAdmin.value,
        userClass: userClass,
        userObject: user
    });
    
    fetchKurser(userClass);
})

// Hämta kurser från servern
async function fetchKurser(userClass) {
    try {
        console.log("\n=== Hämtar Kurser ===");
        console.log("Nuvarande tillstånd:", {
            isAdmin: isAdmin.value,
            userClass: userClass,
            userFromStorage: JSON.parse(localStorage.getItem("regularUser") || "{}")
        });
        
        let url;
        if (isAdmin.value) {
            url = '/items';
            console.log("Admin-vy - hämtar alla kurser");
        } else if (userClass) {
            url = `/items?class=${userClass}`;
            console.log("Användar-vy - hämtar kurser för klass:", userClass);
        } else {
            console.error("Ingen klass angiven för vanlig användare");
            return;
        }
        
        console.log("Skickar förfrågan till:", url);
        const res = await api.get(url);
        
        console.log("Mottagna kurser:", res.data.length);
        res.data.forEach(course => {
            console.log(`- ${course.name} (Klass: ${course.class})`);
        });
        
        kurserState.value = res.data;
    } catch (err) {
        console.error('Kunde inte hämta kurser:', err);
    }
}

// Skapa ny kurs (endast för admin)
async function addKurs() {
    addKursError.value = ''
    if (!newName.value || !newDate.value || !newTime.value || !newTeacher.value || !newClass.value) {
        addKursError.value = 'Alla fält måste fyllas i.'
        return
    }

    const isoDate = new Date(`${newDate.value}T${newTime.value}`).toISOString()

    try {
        const res = await api.post('/items',
            { name: newName.value, date: isoDate, teacher: newTeacher.value, description: newDescription.value, class: newClass.value }
        )
        const [date, time] = res.data.date.split('T')
        kurserState.value.push({ ...res.data, date, time: time?.slice(0, 5) || '', teacher: res.data.teacher, description: res.data.description || '' })
        newName.value = newDate.value = newTime.value = newTeacher.value = newDescription.value = ''
    } catch (err) {
        addKursError.value = err.response?.data?.msg || 'Misslyckades att lägga till kurs.'
        console.error(err)
    }
}

// Uppdatera befintlig kurs (endast för admin)
async function updateKurs(kurs) {
    try {
        const isoDate = new Date(`${kurs.date}T${kurs.time}`).toISOString()
        const res = await api.put(`/items/${kurs._id}`,
            { name: kurs.name, date: isoDate, teacher: kurs.teacher, description: kurs.description, class: kurs.class }
        )

        const index = kurserState.value.findIndex(k => k._id === kurs._id)
        if (index !== -1) {
            const dateObj = new Date(res.data.date)
            const date = dateObj.toLocaleDateString('sv-SE')
            const time = dateObj.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
            kurserState.value[index] = { ...res.data, date, time, teacher: res.data.teacher || '', description: res.data.description || '' }
        }
    } catch (err) {
        console.error('Kunde inte uppdatera kurs:', err)
    }
}

// Ta bort kurs (endast för admin)
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
