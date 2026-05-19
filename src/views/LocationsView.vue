<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Locations</h3>
      <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addLocModal">Add Location</button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="locsStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
        <table v-else class="table table-hover mb-0">
          <thead class="table-light">
            <tr><th>#</th><th>Name</th><th>Place</th><th>Address</th><th>Phone</th><th>Manager</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-if="locsStore.locations.length === 0"><td colspan="8" class="text-center py-4 text-muted">No locations found.</td></tr>
            <tr v-for="(l, i) in locsStore.locations" :key="l.id">
              <td>{{ i + 1 }}</td>
              <td>{{ l.name }}</td>
              <td>{{ l.place || '—' }}</td>
              <td>{{ l.address || '—' }}</td>
              <td>{{ l.phone || '—' }}</td>
              <td>{{ l.manager_name || '—' }}</td>
              <td><span :class="l.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">{{ l.status == 1 ? 'Active' : 'Inactive' }}</span></td>
              <td><button class="btn btn-sm btn-outline-primary" @click="openEdit(l)"><i class="fas fa-edit"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal fade" id="addLocModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Add Location</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="addForm.name" /></div>
          <div class="mb-3"><label class="form-label">Address</label><input type="text" class="form-control" v-model="addForm.address" /></div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Phone</label><input type="text" class="form-control" v-model="addForm.phone" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">Manager</label><input type="text" class="form-control" v-model="addForm.manager_name" /></div>
          </div>
          <div v-if="addError" class="alert alert-danger">{{ addError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitAdd" :disabled="locsStore.isSubmitting">Save</button>
        </div>
      </div></div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editLocModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Edit Location</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="editForm.name" /></div>
          <div class="mb-3"><label class="form-label">Address</label><input type="text" class="form-control" v-model="editForm.address" /></div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Phone</label><input type="text" class="form-control" v-model="editForm.phone" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">Manager</label><input type="text" class="form-control" v-model="editForm.manager_name" /></div>
          </div>
          <div class="mb-3"><label class="form-label">Status</label><select class="form-select" v-model="editForm.status"><option :value="1">Active</option><option :value="0">Inactive</option></select></div>
          <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitEdit" :disabled="locsStore.isSubmitting">Update</button>
        </div>
      </div></div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useLocationsStore } from '../stores/locations.js'
import { Modal } from 'bootstrap'

const locsStore = useLocationsStore()

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

const addForm  = ref({ name: '', address: '', phone: '', manager_name: '' })
const addError = ref('')

async function submitAdd() {
  addError.value = ''
  if (!addForm.value.name.trim()) { addError.value = 'Name is required.'; return }
  const res = await locsStore.createLocation({ ...addForm.value })
  if (res.success) { addForm.value = { name: '', address: '', phone: '', manager_name: '' }; closeModal('addLocModal') }
  else addError.value = res.message
}

const editForm  = ref({})
const editError = ref('')

function openEdit(l) {
  editForm.value = { id: l.id, name: l.name, address: l.address || '', phone: l.phone || '', manager_name: l.manager_name || '', status: l.status }
  editError.value = ''
  new Modal(document.getElementById('editLocModal')).show()
}

async function submitEdit() {
  editError.value = ''
  if (!editForm.value.name?.trim()) { editError.value = 'Name is required.'; return }
  const res = await locsStore.updateLocation({ ...editForm.value })
  if (res.success) closeModal('editLocModal')
  else editError.value = res.message
}

onMounted(() => locsStore.fetchLocations())
</script>
