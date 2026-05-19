import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useCustomersStore = defineStore('customers', () => {
  const customers   = ref([])
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

  async function fetchCustomers(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const body = {
        name:     filters.name     || null,
        email:    filters.email    || null,
        phone:    filters.phone    || null,
        place_id: filters.place_id || null,
      }
      const response = await axios.post(`${apiUrl}/customers/list`, body, {
        headers: authHeaders()
      })
      customers.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading customers.'
      console.error('fetchCustomers error:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function createCustomer(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/customers/create`, data, {
        headers: authHeaders()
      })
      await fetchCustomers()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating customer.'
      console.error('createCustomer error:', e)
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateCustomer(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/customers/update`, data, {
        headers: authHeaders()
      })
      await fetchCustomers()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating customer.'
      console.error('updateCustomer error:', e)
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    customers,
    isLoading,
    isSubmitting,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
  }
})
