import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useMenusStore = defineStore('menus', () => {
  const categories  = ref([])
  const items       = ref([])
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

  async function fetchCategories(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/menus/categories/list`, {
        name:     filters.name     || null,
        place_id: filters.place_id || null,
      }, { headers: authHeaders() })
      categories.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading categories.'
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/menus/categories/create`, data, { headers: authHeaders() })
      await fetchCategories()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating category.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateCategory(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/menus/categories/update`, data, { headers: authHeaders() })
      await fetchCategories()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating category.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function fetchItems(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/menus/items/list`, {
        name:        filters.name        || null,
        category_id: filters.category_id || null,
        place_id:    filters.place_id    || null,
      }, { headers: authHeaders() })
      items.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading menu items.'
    } finally {
      isLoading.value = false
    }
  }

  async function createItem(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/menus/items/create`, data, { headers: authHeaders() })
      await fetchItems()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating menu item.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateItem(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/menus/items/update`, data, { headers: authHeaders() })
      await fetchItems()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating menu item.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    categories, items, isLoading, isSubmitting, error,
    fetchCategories, createCategory, updateCategory,
    fetchItems, createItem, updateItem,
  }
})
