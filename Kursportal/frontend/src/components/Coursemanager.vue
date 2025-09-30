<template>
  <div>
    <h2>Manage Courses</h2>
 
    <form @submit.prevent="addCourse">
      <input v-model="newName" placeholder="Course name" />
      <input type="date" v-model="newDate" />
      <input type="time" v-model="newTime" />
      <input v-model="newTeacher" placeholder="Teacher" />
      <button type="submit">Add</button>
    </form>

    <ul>
      <li v-for="course in courses" :key="course._id">
        <input v-model="course.name" @change="updateCourse(course)" />
        <input type="date" v-model="course.date" @change="updateCourse(course)" />
        <input type="time" v-model="course.time" @change="updateCourse(course)" />
        <input v-model="course.teacher" @change="updateCourse(course)" />
        <button @click="deleteCourse(course._id)">❌</button>
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
const newName = ref('')
const newDate = ref('')
const newTime = ref('')
const newTeacher = ref('')

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

const addCourse = async () => {
  if (!newName.value || !newDate.value || !newTime.value || !newTeacher.value) {
    return alert('Fill all fields')
  }
  const isoDate = new Date(`${newDate.value}T${newTime.value}`).toISOString()
  try {
    const res = await api.post('/items', { name: newName.value, date: isoDate, teacher: newTeacher.value })
    courses.value.push(res.data)
    newName.value = ''
    newDate.value = ''
    newTime.value = ''
    newTeacher.value = ''
  } catch (err) {
    alert(err.response?.data?.msg || 'Could not add course')
  }
}

const updateCourse = async (course) => {
  const isoDate = new Date(`${course.date}T${course.time}`).toISOString()
  try {
    await api.put(`/items/${course._id}`, {
      name: course.name,
      date: isoDate,
      teacher: course.teacher
    })
  } catch (err) {
    alert(err.response?.data?.msg || 'Could not update course')
  }
}

const deleteCourse = async (id) => {
  try {
    await api.delete(`/items/${id}`)
    courses.value = courses.value.filter(c => c._id !== id)
  } catch (err) {
    alert(err.response?.data?.msg || 'Could not delete course')
  }
}

onMounted(fetchCourses)
setInterval(fetchCourses, 5000)
</script>
