import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes      = ref([])
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

  async function fetchRecipes(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/recipes/list`, { name: filters.name || null }, { headers: authHeaders() })
      recipes.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading recipes.'
    } finally {
      isLoading.value = false
    }
  }

  async function createRecipe(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/recipes/create`, data, { headers: authHeaders() })
      await fetchRecipes()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating recipe.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateRecipe(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/recipes/update`, data, { headers: authHeaders() })
      await fetchRecipes()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating recipe.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return { recipes, isLoading, isSubmitting, error, fetchRecipes, createRecipe, updateRecipe }
})
