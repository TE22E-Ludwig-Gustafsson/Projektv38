<template>
  <div>
    <h2>Admin Dashboard</h2>
    <CourseManager :user="props.user" />
  </div>
</template>

<script setup>
import CourseManager from './CourseManager.vue'

const props = defineProps({
  isAdmin: { type: Boolean, default: false },
  user: { type: Object, default: null }
})
</script>
