import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const usePlacesStore = defineStore('places', () => {
  const places = ref([])
  const venues = ref([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref(null)

  function authHeaders() {
    const authStore = useAuthStore()
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }

  async function fetchPlaces(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const body = {
        name:    filters.name    || null,
        address: filters.address || null,
        phone:   filters.phone   || null,
        email:   filters.email   || null,
      }
      const response = await axios.post(`${apiUrl}/places/list`, body, {
        headers: authHeaders()
      })
      places.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading places.'
      console.error('fetchPlaces error:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchVenues() {
    try {
      const response = await axios.post(`${apiUrl}/places/venues`, {}, {
        headers: authHeaders()
      })
      venues.value = response.data.data
    } catch (e) {
      console.error('fetchVenues error:', e)
    }
  }

  async function createPlace(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/places/create`, data, {
        headers: authHeaders()
      })
      await fetchPlaces()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating place.'
      console.error('createPlace error:', e)
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updatePlace(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/places/update`, data, {
        headers: authHeaders()
      })
      await fetchPlaces()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating place.'
      console.error('updatePlace error:', e)
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    places,
    venues,
    isLoading,
    isSubmitting,
    error,
    fetchPlaces,
    fetchVenues,
    createPlace,
    updatePlace
  }
})
