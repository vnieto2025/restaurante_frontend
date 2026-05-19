import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const username = ref(localStorage.getItem('username') || null)
  const role = ref(localStorage.getItem('role') || null)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) {
    const response = await axios.post(
      `${apiUrl}/auth/login`,
      {
        username: credentials.username,
        password: credentials.password
      },
      {
        headers: { 'Accept': 'application/json' }
      }
    )

    token.value = response.data.data.access_token
    username.value = response.data.data.username
    role.value = response.data.data.role

    localStorage.setItem('token', token.value)
    localStorage.setItem('username', username.value)
    localStorage.setItem('role', role.value)
  }

  function logout() {
    token.value = null
    username.value = null
    role.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('role')
  }

  return { token, username, role, isAuthenticated, login, logout }
})
