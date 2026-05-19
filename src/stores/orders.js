import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useOrdersStore = defineStore('orders', () => {
  const orders       = ref([])
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

  async function fetchOrders(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const body = {
        customer_id: filters.customer_id || null,
        place_id:    filters.place_id    || null,
        status:      filters.status      || null,
      }
      const response = await axios.post(`${apiUrl}/orders/list`, body, {
        headers: authHeaders()
      })
      orders.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading orders.'
      console.error('fetchOrders error:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function createOrder(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/orders/create`, data, {
        headers: authHeaders()
      })
      await fetchOrders()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating order.'
      console.error('createOrder error:', e)
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateOrder(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/orders/update`, data, {
        headers: authHeaders()
      })
      await fetchOrders()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating order.'
      console.error('updateOrder error:', e)
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    orders,
    isLoading,
    isSubmitting,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
  }
})
