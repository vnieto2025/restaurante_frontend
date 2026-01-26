<template>
  <div class="dashboard-container">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <a class="navbar-brand" href="#">Restaurante</a>
      <div class="ms-auto d-flex align-items-center gap-3">
        <span class="text-white">Welcome, </span>
        <button @click="logout" class="btn btn-light btn-sm">Logout</button>
      </div>
    </nav>
    <div class="container mt-5">
      <h1>Dashboard</h1>
      <p>Welcome to the restaurant management system.</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue' 

const router = useRouter()

const token = ref('')
const username = ref('')


const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/')
}

onMounted(() => {
  token.value = localStorage.getItem('token')
  username.value = localStorage.getItem('username')

  if (!token.value) {
    router.push('/')
  }
})
</script>



<style scoped>
.bg-primary {
  background-color: #2b2d6e !important;
}
</style>
