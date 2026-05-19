import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import apiUrl from '../../config.js'
import { useAuthStore } from './auth.js'

export const useRolesStore = defineStore('roles', () => {
  const roles       = ref([])
  const users       = ref([])
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

  async function fetchRoles(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/roles/list`, { name: filters.name || null }, { headers: authHeaders() })
      roles.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading roles.'
    } finally {
      isLoading.value = false
    }
  }

  async function createRole(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/roles/create`, data, { headers: authHeaders() })
      await fetchRoles()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating role.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateRole(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/roles/update`, data, { headers: authHeaders() })
      await fetchRoles()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating role.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function fetchUsers(filters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/roles/users/list`, {
        username: filters.username || null,
        role_id:  filters.role_id  || null,
      }, { headers: authHeaders() })
      users.value = response.data.data
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error loading users.'
    } finally {
      isLoading.value = false
    }
  }

  async function createUser(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/roles/users/create`, data, { headers: authHeaders() })
      await fetchUsers()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error creating user.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  async function updateUser(data) {
    isSubmitting.value = true
    error.value = null
    try {
      const response = await axios.post(`${apiUrl}/roles/users/update`, data, { headers: authHeaders() })
      await fetchUsers()
      return { success: true, data: response.data }
    } catch (e) {
      error.value = e?.response?.data?.message || 'Error updating user.'
      return { success: false, message: error.value }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    roles, users, isLoading, isSubmitting, error,
    fetchRoles, createRole, updateRole,
    fetchUsers, createUser, updateUser,
  }
})
