<template>
    <div>
        <h2>Mina objekt</h2>

        <form @submit.prevent="addItem">
            <input v-model="newName" placeholder="Nytt objekt" />
            <button type="submit">Lägg till</button>
        </form>

        <ul>
            <li v-for="item in items" :key="item._id">
                <input v-model="item.name" @change="updateItem(item)" />
                <button @click="deleteItem(item._id)">❌</button>
            </li>
        </ul>
    </div>
</template>

<script>
import api from "../services/api";

export default {
    data() {
        return {
            items: [],
            newName: "",
        };
    },
    async created() {
        this.fetchItems();
    },
    methods: {
        async fetchItems() {
            const res = await api.get("/items");
            this.items = res.data;
        },
        async addItem() {
            if (!this.newName) return;
            const res = await api.post("/items", { name: this.newName });
            this.items.push(res.data);
            this.newName = "";
        },
        async updateItem(item) {
            await api.put(`/items/${item._id}`, { name: item.name });
        },
        async deleteItem(id) {
            await api.delete(`/items/${id}`);
            this.items = this.items.filter((i) => i._id !== id);
        },
    },
};
</script>
