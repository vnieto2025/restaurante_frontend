import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useSettingsStore = defineStore('settings', () => {
  const settings     = ref([])
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

  async function fetchSettings() {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/settings/list`, {}, { headers: authHeaders() })
      settings.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading settings.'
    } finally {
      isLoading.value = false
    }
  }

  async function updateSetting(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/settings/update`, data, { headers: authHeaders() })
      await fetchSettings()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating setting.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return { settings, isLoading, isSubmitting, error, fetchSettings, updateSetting }
})
