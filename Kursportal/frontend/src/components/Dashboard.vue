<template>
  <div>
    <h2>Dashboard</h2>
    <CourseList :isAdmin="isAdmin" />
  </div>
</template>

<script setup>
import CourseList from './CourseList.vue'
const isAdmin = localStorage.getItem('isAdmin') === 'true'
</script>
