import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useReportsStore = defineStore('reports', () => {
  const summary   = ref(null)
  const isLoading = ref(false)
  const error     = ref(null)

  function authHeaders() {
    const authStore = useAuthStore()
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }

  async function fetchSummary() {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/reports/summary`, {}, { headers: authHeaders() })
      summary.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading report.'
    } finally {
      isLoading.value = false
    }
  }

  return { summary, isLoading, error, fetchSummary }
})
