<template>
    <div>
        <h2>Kurser</h2>

        <form v-if="isAdmin" @submit.prevent="addCourse">
            <input v-model="newName" placeholder="Ny kurs" />
            <button type="submit">Lägg till</button>
        </form>

        <ul>
            <li v-for="course in courses" :key="course._id">
                <template v-if="isAdmin">
                    <input v-model="course.name" @change="updateCourse(course)" />
                    <button @click="deleteCourse(course._id)">❌</button>
                </template>
                <template v-else>
                    {{ course.name }}
                </template>
            </li>
        </ul>
    </div>
</template>

<script>
import api from "../services/api";

export default {
    props: {
        isAdmin: { type: Boolean, default: false }
    },
    data() {
        return {
            courses: [],
            newName: "",
        };
    },
    async created() {
        this.fetchCourses();
    },
    methods: {
        async fetchCourses() {
            const res = await api.get("/items");
            this.courses = res.data;
        },
        async addCourse() {
            if (!this.newName) return;
            const res = await api.post("/items", { name: this.newName });
            this.courses.push(res.data);
            this.newName = "";
        },
        async updateCourse(course) {
            await api.put(`/items/${course._id}`, { name: course.name });
        },
        async deleteCourse(id) {
            await api.delete(`/items/${id}`);
            this.courses = this.courses.filter((c) => c._id !== id);
        },
    },
};
</script>