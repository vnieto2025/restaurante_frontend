<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Customers</h3>
      <button
        class="btn btn-primary bg-custom-blue"
        data-bs-toggle="modal"
        data-bs-target="#addCustomerModal"
      >
        Add New Customer
      </button>
    </div>

    <!-- Filter Section -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <input type="text" class="form-control" placeholder="Search by name" v-model="filterName" />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control" placeholder="Search by email" v-model="filterEmail" />
          </div>
          <div class="col-md-2">
            <input type="text" class="form-control" placeholder="Search by phone" v-model="filterPhone" />
          </div>
          <div class="col-md-2">
            <select class="form-select text-muted" v-model="filterPlaceId">
              <option value="">All restaurants</option>
              <option v-for="place in places" :key="place.id" :value="place.id">
                {{ place.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button class="btn btn-search text-white flex-grow-1" @click="search">Search</button>
            <button class="btn btn-light flex-grow-1" @click="reset">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 py-3 border-0">Created</th>
                <th class="py-3 border-0">ID</th>
                <th class="py-3 border-0">Full Name</th>
                <th class="py-3 border-0">Email</th>
                <th class="py-3 border-0">Phone</th>
                <th class="py-3 border-0">Restaurant</th>
                <th class="py-3 border-0">Status</th>
                <th class="py-3 border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="customersStore.isLoading">
                <td colspan="8" class="text-center py-4 text-muted">
                  <span class="spinner-border spinner-border-sm me-2"></span>Loading...
                </td>
              </tr>
              <tr v-else-if="customersStore.error">
                <td colspan="8" class="text-center py-4 text-danger">{{ customersStore.error }}</td>
              </tr>
              <tr v-else-if="customersStore.customers.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">No customers found.</td>
              </tr>
              <tr v-for="customer in customersStore.customers" :key="customer.id" v-else>
                <td class="ps-4">{{ formatDate(customer.created_at) }}</td>
                <td>{{ customer.id }}</td>
                <td>{{ customer.full_name }}</td>
                <td>{{ customer.email || '—' }}</td>
                <td>{{ customer.phone || '—' }}</td>
                <td>{{ customer.place || '—' }}</td>
                <td>
                  <span :class="customer.status === 1 ? 'badge bg-success' : 'badge bg-secondary'">
                    {{ customer.status === 1 ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" @click="openEdit(customer)">
                    <i class="fas fa-pen me-1"></i>Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Customer Modal -->
    <div class="modal fade" id="addCustomerModal" tabindex="-1" aria-labelledby="addCustomerModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="addCustomerModalLabel">Add New Customer</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger py-2 small">{{ formError }}</div>
            <form @submit.prevent="submitCreate">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">First Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="First Name" v-model="form.first_name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Last Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Last Name" v-model="form.last_name" required>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Email</label>
                  <input type="email" class="form-control" placeholder="Email" v-model="form.email">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Phone</label>
                  <input type="text" class="form-control" placeholder="Phone" v-model="form.phone">
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Birth Date</label>
                  <input type="date" class="form-control" v-model="form.birth_date">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Restaurant</label>
                  <select class="form-select text-muted" v-model="form.place_id">
                    <option value="">Select Restaurant</option>
                    <option v-for="place in places" :key="place.id" :value="place.id">
                      {{ place.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">Notes</label>
                <textarea class="form-control" rows="2" placeholder="Additional notes..." v-model="form.notes"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-link text-decoration-none text-secondary fw-bold" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary bg-custom-blue px-4"
              :disabled="customersStore.isSubmitting"
              @click="submitCreate"
            >
              <span v-if="customersStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ customersStore.isSubmitting ? 'Saving...' : 'Add' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Customer Modal -->
    <div class="modal fade" id="editCustomerModal" tabindex="-1" aria-labelledby="editCustomerModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="editCustomerModalLabel">Edit Customer</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="editFormError" class="alert alert-danger py-2 small">{{ editFormError }}</div>
            <form @submit.prevent="submitEdit">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">First Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="First Name" v-model="editForm.first_name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Last Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Last Name" v-model="editForm.last_name" required>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Email</label>
                  <input type="email" class="form-control" placeholder="Email" v-model="editForm.email">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Phone</label>
                  <input type="text" class="form-control" placeholder="Phone" v-model="editForm.phone">
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Birth Date</label>
                  <input type="date" class="form-control" v-model="editForm.birth_date">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Restaurant</label>
                  <select class="form-select text-muted" v-model="editForm.place_id">
                    <option value="">Select Restaurant</option>
                    <option v-for="place in places" :key="place.id" :value="place.id">
                      {{ place.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Status</label>
                  <select class="form-select" v-model="editForm.status">
                    <option :value="1">Active</option>
                    <option :value="0">Inactive</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">Notes</label>
                <textarea class="form-control" rows="2" placeholder="Additional notes..." v-model="editForm.notes"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-link text-decoration-none text-secondary fw-bold" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary bg-custom-blue px-4"
              :disabled="customersStore.isSubmitting"
              @click="submitEdit"
            >
              <span v-if="customersStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ customersStore.isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useCustomersStore } from '../stores/customers.js'
import { usePlacesStore } from '../stores/places.js'

const customersStore = useCustomersStore()
const placesStore    = usePlacesStore()

// Re-use places list (already fetched by placesStore) for the selects
const places = ref([])

// ── Filters ───────────────────────────────────────────────────────────────────
const filterName    = ref('')
const filterEmail   = ref('')
const filterPhone   = ref('')
const filterPlaceId = ref('')

function search() {
  customersStore.fetchCustomers({
    name:     filterName.value,
    email:    filterEmail.value,
    phone:    filterPhone.value,
    place_id: filterPlaceId.value || null,
  })
}

function reset() {
  filterName.value    = ''
  filterEmail.value   = ''
  filterPhone.value   = ''
  filterPlaceId.value = ''
  customersStore.fetchCustomers()
}

// ── Bootstrap modal helper ──────────────────────────────────────────────────
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

// ── Add form ──────────────────────────────────────────────────────────────────
const emptyForm = () => ({
  first_name: '', last_name: '', email: '', phone: '',
  birth_date: '', place_id: '', notes: ''
})
const form      = ref(emptyForm())
const formError = ref('')

async function submitCreate() {
  formError.value = ''
  const payload = {
    ...form.value,
    place_id: form.value.place_id ? parseInt(form.value.place_id) : null,
    birth_date: form.value.birth_date || null,
  }
  const result = await customersStore.createCustomer(payload)
  if (result.success) {
    closeModal('addCustomerModal')
    form.value = emptyForm()
  } else {
    formError.value = result.message
  }
}

// ── Edit form ─────────────────────────────────────────────────────────────────
const editForm      = ref({ id: null, first_name: '', last_name: '', email: '', phone: '', birth_date: '', place_id: '', notes: '', status: 1 })
const editFormError = ref('')
let editModalInstance = null

function openEdit(customer) {
  editFormError.value = ''
  editForm.value = {
    id:         customer.id,
    first_name: customer.first_name  || '',
    last_name:  customer.last_name   || '',
    email:      customer.email       || '',
    phone:      customer.phone       || '',
    birth_date: customer.birth_date  || '',
    place_id:   customer.place_id    || '',
    notes:      customer.notes       || '',
    status:     customer.status,
  }
  const modalEl = document.getElementById('editCustomerModal')
  editModalInstance = editModalInstance || new Modal(modalEl)
  editModalInstance.show()
}

async function submitEdit() {
  editFormError.value = ''
  const payload = {
    ...editForm.value,
    place_id: editForm.value.place_id ? parseInt(editForm.value.place_id) : null,
    birth_date: editForm.value.birth_date || null,
  }
  const result = await customersStore.updateCustomer(payload)
  if (result.success) {
    closeModal('editCustomerModal')
  } else {
    editFormError.value = result.message
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

onMounted(async () => {
  customersStore.fetchCustomers()
  // Load places for the selects; reuse the store if already loaded
  await placesStore.fetchPlaces()
  places.value = placesStore.places
})
</script>

<style scoped>
.bg-custom-blue {
  background-color: #1a237e;
  border-color: #1a237e;
}

.btn-search {
  background-color: #1a237e;
  border-color: #1a237e;
}

.form-control::placeholder {
  color: #adb5bd;
  font-size: 0.9rem;
}

.table thead th {
  font-weight: 600;
  color: #495057;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table tbody td {
  font-size: 0.9rem;
  color: #212529;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.card {
  border-radius: 8px;
}

.modal-content {
  border-radius: 12px;
}

.form-label {
  margin-bottom: 0.2rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #1a237e;
  box-shadow: 0 0 0 0.25rem rgba(26, 35, 126, 0.25);
}
</style>
