import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const subscriptions = ref([])
  const isLoading     = ref(false)
  const isSubmitting  = ref(false)
  const error         = ref(null)

  function authHeaders() {
    const authStore = useAuthStore()
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${authStore.token}`
    }
  }

  async function fetchSubscriptions(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/subscriptions/list`, {
        customer_id: filters.customer_id || null,
        place_id:    filters.place_id    || null,
        status:      filters.status      || null,
      }, { headers: authHeaders() })
      subscriptions.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading subscriptions.'
    } finally {
      isLoading.value = false
    }
  }

  async function createSubscription(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/subscriptions/create`, data, { headers: authHeaders() })
      await fetchSubscriptions()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating subscription.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateSubscription(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/subscriptions/update`, data, { headers: authHeaders() })
      await fetchSubscriptions()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating subscription.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return { subscriptions, isLoading, isSubmitting, error, fetchSubscriptions, createSubscription, updateSubscription }
})
