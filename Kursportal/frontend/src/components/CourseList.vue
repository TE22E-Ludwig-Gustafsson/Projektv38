<template>
    <div>
        <h2>Courses</h2>
        <ul>
            <li v-for="course in courses" :key="course._id">
                {{ course.name }} – {{ course.date }} {{ course.time }} – {{ course.teacher }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const props = defineProps({
    user: { type: Object, default: null }
})

const courses = ref([])

const fetchCourses = async () => {
    const res = await api.get('/items')
    courses.value = res.data.map(course => {
        let datePart = ''
        let timePart = ''
        if (course.date) {
            const [date, time] = course.date.split('T')
            datePart = date
            timePart = time ? time.slice(0, 5) : ''
        }
        return { ...course, date: datePart, time: timePart, teacher: course.teacher || '' }
    })
}

onMounted(fetchCourses)
// valfritt: auto-refresh
setInterval(fetchCourses, 5000)
</script>
