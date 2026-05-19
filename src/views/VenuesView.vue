<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Venues</h3>
      <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addVenueModal">
        Add Venue
      </button>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Search by name" v-model="filterName" />
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="filterStatus">
              <option value="">All statuses</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button class="btn btn-primary bg-custom-blue flex-fill" @click="search">Search</button>
            <button class="btn btn-secondary flex-fill" @click="clearFilters">Clear</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="venuesStore.isLoading" class="text-center p-4">
          <div class="spinner-border text-primary"></div>
        </div>
        <table v-else class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="venuesStore.venues.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">No venues found.</td>
            </tr>
            <tr v-for="(v, i) in venuesStore.venues" :key="v.id">
              <td>{{ i + 1 }}</td>
              <td>{{ v.name }}</td>
              <td>{{ v.description || '—' }}</td>
              <td>
                <span :class="v.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">
                  {{ v.status == 1 ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button class="btn btn-sm btn-outline-primary" @click="openEdit(v)">
                  <i class="fas fa-edit"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal fade" id="addVenueModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add Venue</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="addForm.name" />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="addForm.description" rows="3"></textarea>
            </div>
            <div v-if="addError" class="alert alert-danger">{{ addError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary bg-custom-blue" @click="submitAdd" :disabled="venuesStore.isSubmitting">
              <span v-if="venuesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editVenueModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Venue</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Name <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="editForm.name" />
            </div>
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" v-model="editForm.description" rows="3"></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="editForm.status">
                <option :value="1">Active</option>
                <option :value="0">Inactive</option>
              </select>
            </div>
            <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary bg-custom-blue" @click="submitEdit" :disabled="venuesStore.isSubmitting">
              <span v-if="venuesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useVenuesStore } from '../stores/venues.js'
import { Modal } from 'bootstrap'

const venuesStore = useVenuesStore()

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

const filterName   = ref('')
const filterStatus = ref('')

function search() {
  venuesStore.fetchVenues({ name: filterName.value, status: filterStatus.value !== '' ? Number(filterStatus.value) : null })
}

function clearFilters() {
  filterName.value = ''
  filterStatus.value = ''
  venuesStore.fetchVenues()
}

const addForm  = ref({ name: '', description: '' })
const addError = ref('')

async function submitAdd() {
  addError.value = ''
  if (!addForm.value.name.trim()) { addError.value = 'Name is required.'; return }
  const res = await venuesStore.createVenue({ ...addForm.value })
  if (res.success) {
    addForm.value = { name: '', description: '' }
    closeModal('addVenueModal')
  } else {
    addError.value = res.message
  }
}

const editForm  = ref({})
const editError = ref('')

function openEdit(v) {
  editForm.value = { id: v.id, name: v.name, description: v.description || '', status: v.status }
  editError.value = ''
  new Modal(document.getElementById('editVenueModal')).show()
}

async function submitEdit() {
  editError.value = ''
  if (!editForm.value.name?.trim()) { editError.value = 'Name is required.'; return }
  const res = await venuesStore.updateVenue({ ...editForm.value })
  if (res.success) {
    closeModal('editVenueModal')
  } else {
    editError.value = res.message
  }
}

onMounted(() => venuesStore.fetchVenues())
</script>
