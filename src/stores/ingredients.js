import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useIngredientsStore = defineStore('ingredients', () => {
  const ingredients  = ref([])
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

  async function fetchIngredients(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/ingredients/list`, { name: filters.name || null }, { headers: authHeaders() })
      ingredients.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading ingredients.'
    } finally {
      isLoading.value = false
    }
  }

  async function createIngredient(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/ingredients/create`, data, { headers: authHeaders() })
      await fetchIngredients()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating ingredient.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateIngredient(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/ingredients/update`, data, { headers: authHeaders() })
      await fetchIngredients()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating ingredient.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return { ingredients, isLoading, isSubmitting, error, fetchIngredients, createIngredient, updateIngredient }
})
