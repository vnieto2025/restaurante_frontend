import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useLocationsStore = defineStore('locations', () => {
  const locations    = ref([])
  const isLoading    = ref(false)
  const isSubmitting = ref(false)
  const error        = ref(null)

  function authHeaders() {
    const authStore = useAuthStore()
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }

  async function fetchLocations(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/locations/list`, {
        name:     filters.name     || null,
        place_id: filters.place_id || null,
      }, { headers: authHeaders() })
      locations.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading locations.'
    } finally {
      isLoading.value = false
    }
  }

  async function createLocation(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/locations/create`, data, { headers: authHeaders() })
      await fetchLocations()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating location.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateLocation(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/locations/update`, data, { headers: authHeaders() })
      await fetchLocations()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating location.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return { locations, isLoading, isSubmitting, error, fetchLocations, createLocation, updateLocation }
})
