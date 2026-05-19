<template>
  <MainLayout>
    <h3 class="fw-bold mb-4">Settings</h3>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="settingsStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
        <table v-else class="table table-hover mb-0">
          <thead class="table-light">
            <tr><th>#</th><th>Key</th><th>Value</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-if="settingsStore.settings.length === 0"><td colspan="5" class="text-center py-4 text-muted">No settings found.</td></tr>
            <tr v-for="(s, i) in settingsStore.settings" :key="s.id">
              <td>{{ i + 1 }}</td>
              <td><code>{{ s.setting_key }}</code></td>
              <td>{{ s.setting_value || '—' }}</td>
              <td>{{ s.description || '—' }}</td>
              <td><button class="btn btn-sm btn-outline-primary" @click="openEdit(s)"><i class="fas fa-edit"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editSettingModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Edit Setting</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Key</label>
            <input type="text" class="form-control" :value="editForm.setting_key" disabled />
          </div>
          <div class="mb-3">
            <label class="form-label">Value</label>
            <textarea class="form-control" v-model="editForm.setting_value" rows="3"></textarea>
          </div>
          <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitEdit" :disabled="settingsStore.isSubmitting">Update</button>
        </div>
      </div></div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useSettingsStore } from '../stores/settings.js'
import { Modal } from 'bootstrap'

const settingsStore = useSettingsStore()

function closeModal(id) {
  const el = document.getElementById(id)
  if (!el) return
  Modal.getOrCreateInstance(el).hide()
  el.addEventListener('hidden.bs.modal', () => {
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove())
    document.body.classList.remove('modal-open')
    document.body.style.removeProperty('overflow')
    document.body.style.removeProperty('padding-right')
  }, { once: true })
}

const editForm  = ref({})
const editError = ref('')

function openEdit(s) {
  editForm.value = { setting_key: s.setting_key, setting_value: s.setting_value || '' }
  editError.value = ''
  new Modal(document.getElementById('editSettingModal')).show()
}

async function submitEdit() {
  editError.value = ''
  const res = await settingsStore.updateSetting({ ...editForm.value })
  if (res.success) closeModal('editSettingModal')
  else editError.value = res.message
}

onMounted(() => settingsStore.fetchSettings())
</script>
