import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useVenuesStore = defineStore('venues', () => {
  const venues      = ref([])
  const isLoading   = ref(false)
  const isSubmitting = ref(false)
  const error       = ref(null)

  function authHeaders() {
    const authStore = useAuthStore()
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }

  async function fetchVenues(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/venues/list`, {
        name:   filters.name   || null,
        status: filters.status ?? null,
      }, { headers: authHeaders() })
      venues.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading venues.'
    } finally {
      isLoading.value = false
    }
  }

  async function createVenue(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/venues/create`, data, { headers: authHeaders() })
      await fetchVenues()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating venue.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateVenue(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/venues/update`, data, { headers: authHeaders() })
      await fetchVenues()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating venue.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return { venues, isLoading, isSubmitting, error, fetchVenues, createVenue, updateVenue }
})
