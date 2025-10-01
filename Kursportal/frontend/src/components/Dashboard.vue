<template>
    <div class="page-container">
        <h2 class="title-lg">Admin Dashboard</h2>
        <KursManager :isAdmin="isAdmin" :user="user" />
    </div>
</template>

<script setup>
import KursManager from './KursManager.vue'

const props = defineProps({ isAdmin: Boolean, user: Object })

</script>
