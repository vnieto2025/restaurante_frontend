<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Restaurants</h3>
      <button 
        class="btn btn-primary bg-custom-blue" 
        data-bs-toggle="modal" 
        data-bs-target="#addRestaurantModal"
      >
        Add New Restaurant
      </button>
    </div>

    <!-- Filter Section -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              placeholder="Search by name"
              v-model="filterName"
            />
          </div>
          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              placeholder="Search by address"
              v-model="filterAddress"
            />
          </div>
          <div class="col-md-2">
            <input
              type="text"
              class="form-control"
              placeholder="Search by phone"
              v-model="filterPhone"
            />
          </div>
          <div class="col-md-2">
            <input
              type="text"
              class="form-control"
              placeholder="Search by email"
              v-model="filterEmail"
            />
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
                <th class="py-3 border-0">Place ID</th>
                <th class="py-3 border-0">Place Hash</th>
                <th class="py-3 border-0">Name</th>
                <th class="py-3 border-0">Address</th>
                <th class="py-3 border-0">Phone</th>
                <th class="py-3 border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="placesStore.isLoading">
                <td colspan="7" class="text-center py-4 text-muted">
                  <span class="spinner-border spinner-border-sm me-2"></span>Loading...
                </td>
              </tr>
              <tr v-else-if="placesStore.error">
                <td colspan="7" class="text-center py-4 text-danger">{{ placesStore.error }}</td>
              </tr>
              <tr v-else-if="placesStore.places.length === 0">
                <td colspan="7" class="text-center py-4 text-muted">No restaurants found.</td>
              </tr>
              <tr v-for="place in placesStore.places" :key="place.id" v-else>
                <td class="ps-4">{{ formatDate(place.created_at) }}</td>
                <td>{{ place.id }}</td>
                <td><code>{{ place.place_hash }}</code></td>
                <td>{{ place.name }}</td>
                <td>{{ place.address }}</td>
                <td>{{ place.phone }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-outline-primary"
                    @click="openEdit(place)"
                  >
                    <i class="fas fa-pen me-1"></i>Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add New Restaurant Modal -->
    <div class="modal fade" id="addRestaurantModal" tabindex="-1" aria-labelledby="addRestaurantModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="addRestaurantModalLabel">Add New Restaurant</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger py-2 small">{{ formError }}</div>
            <form @submit.prevent="submitCreate">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Restaurant Name" v-model="form.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Address <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Address" v-model="form.address" required>
                </div>
              </div>
              
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Phone <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Phone" v-model="form.phone" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Email <span class="text-danger">*</span></label>
                  <input type="email" class="form-control" placeholder="Email" v-model="form.email" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">Website</label>
                <input type="text" class="form-control" placeholder="Website" v-model="form.website">
              </div>

              <div class="row g-3">
                <!-- Columna Izquierda: Venue -->
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Venue</label>
                  <select class="form-select text-muted" v-model="form.venue_id">
                    <option value="">Select Venue</option>
                    <option v-for="venue in placesStore.venues" :key="venue.id" :value="venue.id">
                      {{ venue.name }}
                    </option>
                  </select>
                </div>

                <!-- Columna Derecha: Opening Hours (Grid) -->
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted d-block">Opening Hours</label>
                  
                  <div class="row g-2">
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Monday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="openingHours.monday">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Tuesday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="openingHours.tuesday">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Wednesday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="openingHours.wednesday">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Thursday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="openingHours.thursday">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Friday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="openingHours.friday">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Saturday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="openingHours.saturday">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Sunday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="openingHours.sunday">
                     </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
          <div class="modal-footer border-0 pt-0">
             <button type="button" class="btn btn-link text-decoration-none text-secondary fw-bold" data-bs-dismiss="modal">Cancel</button>
             <button
               type="button"
               class="btn btn-primary bg-custom-blue px-4"
               :disabled="placesStore.isSubmitting"
               @click="submitCreate"
             >
               <span v-if="placesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
               {{ placesStore.isSubmitting ? 'Saving...' : 'Add' }}
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Restaurant Modal -->
    <div class="modal fade" id="editRestaurantModal" tabindex="-1" aria-labelledby="editRestaurantModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold" id="editRestaurantModalLabel">Edit Restaurant</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="editFormError" class="alert alert-danger py-2 small">{{ editFormError }}</div>
            <form @submit.prevent="submitEdit">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Restaurant Name" v-model="editForm.name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Address <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Address" v-model="editForm.address" required>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Phone <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Phone" v-model="editForm.phone" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Email <span class="text-danger">*</span></label>
                  <input type="email" class="form-control" placeholder="Email" v-model="editForm.email" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">Website</label>
                <input type="text" class="form-control" placeholder="Website" v-model="editForm.website">
              </div>

              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Venue</label>
                  <select class="form-select text-muted" v-model="editForm.venue_id">
                    <option value="">Select Venue</option>
                    <option v-for="venue in placesStore.venues" :key="venue.id" :value="venue.id">
                      {{ venue.name }}
                    </option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted d-block">Opening Hours</label>
                  <div class="row g-2">
                    <div class="col-4" v-for="day in ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']" :key="day">
                      <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">{{ day }}</label>
                      <input type="text" class="form-control form-control-sm" placeholder="e.g. 09:00-22:00" v-model="editOpeningHours[day]">
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-link text-decoration-none text-secondary fw-bold" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary bg-custom-blue px-4"
              :disabled="placesStore.isSubmitting"
              @click="submitEdit"
            >
              <span v-if="placesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ placesStore.isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup>
import MainLayout from "../layouts/MainLayout.vue";
import { ref, onMounted } from "vue";
import { usePlacesStore } from "../stores/places.js";
import { Modal } from "bootstrap";

const placesStore = usePlacesStore();

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

// ── Filters ──────────────────────────────────────────────────────────────────
const filterName    = ref('')
const filterAddress = ref('')
const filterPhone   = ref('')
const filterEmail   = ref('')

function search() {
  placesStore.fetchPlaces({
    name:    filterName.value,
    address: filterAddress.value,
    phone:   filterPhone.value,
    email:   filterEmail.value
  })
}

function reset() {
  filterName.value    = ''
  filterAddress.value = ''
  filterPhone.value   = ''
  filterEmail.value   = ''
  placesStore.fetchPlaces()
}

// ── New restaurant form ───────────────────────────────────────────────────────
const form = ref({
  name: '', address: '', phone: '', email: '', website: '', venue_id: ''
})
const openingHours = ref({
  monday: '', tuesday: '', wednesday: '', thursday: '',
  friday: '', saturday: '', sunday: ''
})
const formError = ref('')

async function submitCreate() {
  formError.value = ''
  const payload = {
    ...form.value,
    venue_id: form.value.venue_id ? parseInt(form.value.venue_id) : null,
    opening_hours: { ...openingHours.value }
  }
  const result = await placesStore.createPlace(payload)
  if (result.success) {
    closeModal('addRestaurantModal')
    form.value = { name: '', address: '', phone: '', email: '', website: '', venue_id: '' }
    openingHours.value = { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' }
  } else {
    formError.value = result.message
  }
}

// ── Edit restaurant ───────────────────────────────────────────────────────────
const editForm = ref({ id: null, name: '', address: '', phone: '', email: '', website: '', venue_id: '' })
const editOpeningHours = ref({
  monday: '', tuesday: '', wednesday: '', thursday: '',
  friday: '', saturday: '', sunday: ''
})
const editFormError = ref('')
let editModalInstance = null

function openEdit(place) {
  editFormError.value = ''
  editForm.value = {
    id:       place.id,
    name:     place.name     || '',
    address:  place.address  || '',
    phone:    place.phone    || '',
    email:    place.email    || '',
    website:  place.website  || '',
    venue_id: place.venue_id || ''
  }
  // Pre-fill opening hours from existing data
  const hours = { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' }
  if (Array.isArray(place.opening_hours)) {
    place.opening_hours.forEach(oh => {
      if (oh.day in hours) hours[oh.day] = oh.hours || ''
    })
  }
  editOpeningHours.value = hours

  const modalEl = document.getElementById('editRestaurantModal')
  editModalInstance = editModalInstance || new Modal(modalEl)
  editModalInstance.show()
}

async function submitEdit() {
  editFormError.value = ''
  const payload = {
    ...editForm.value,
    venue_id: editForm.value.venue_id ? parseInt(editForm.value.venue_id) : null,
    opening_hours: { ...editOpeningHours.value }
  }
  const result = await placesStore.updatePlace(payload)
  if (result.success) {
    closeModal('editRestaurantModal')
  } else {
    editFormError.value = result.message
  }
}

// ── Format date helper ────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

onMounted(() => {
  placesStore.fetchPlaces()
  placesStore.fetchVenues()
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

/* Modal specific styles to match the clean look */
.modal-content {
  border-radius: 12px;
}
.form-label {
  margin-bottom: 0.2rem;
}
.form-control:focus, .form-select:focus {
  border-color: #1a237e;
  box-shadow: 0 0 0 0.25rem rgba(26, 35, 126, 0.25);
}
</style>
