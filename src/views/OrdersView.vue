<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Orders</h3>
      <button
        class="btn btn-primary bg-custom-blue"
        @click="openAdd"
      >
        New Order
      </button>
    </div>

    <!-- Filters -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <select class="form-select text-muted" v-model="filterPlaceId">
              <option value="">All restaurants</option>
              <option v-for="place in places" :key="place.id" :value="place.id">{{ place.name }}</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select text-muted" v-model="filterStatus">
              <option value="">All statuses</option>
              <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-search text-white flex-grow-1" @click="search">Search</button>
            <button class="btn btn-light flex-grow-1" @click="reset">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 py-3 border-0">Created</th>
                <th class="py-3 border-0">Order #</th>
                <th class="py-3 border-0">Customer</th>
                <th class="py-3 border-0">Restaurant</th>
                <th class="py-3 border-0">Items</th>
                <th class="py-3 border-0">Total</th>
                <th class="py-3 border-0">Status</th>
                <th class="py-3 border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="ordersStore.isLoading">
                <td colspan="8" class="text-center py-4 text-muted">
                  <span class="spinner-border spinner-border-sm me-2"></span>Loading...
                </td>
              </tr>
              <tr v-else-if="ordersStore.error">
                <td colspan="8" class="text-center py-4 text-danger">{{ ordersStore.error }}</td>
              </tr>
              <tr v-else-if="ordersStore.orders.length === 0">
                <td colspan="8" class="text-center py-4 text-muted">No orders found.</td>
              </tr>
              <tr v-for="order in ordersStore.orders" :key="order.id" v-else>
                <td class="ps-4">{{ formatDate(order.created_at) }}</td>
                <td><span class="badge bg-secondary">{{ order.order_number }}</span></td>
                <td>{{ order.customer || '—' }}</td>
                <td>{{ order.place || '—' }}</td>
                <td>{{ order.items?.length ?? 0 }}</td>
                <td class="fw-bold">${{ formatAmount(order.total_amount) }}</td>
                <td>
                  <span :class="statusClass(order.status)">{{ statusLabel(order.status) }}</span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" @click="openEdit(order)">
                    <i class="fas fa-pen me-1"></i>Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Add Order Modal ──────────────────────────────────────────────── -->
    <div class="modal fade" id="addOrderModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">New Order</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="formError" class="alert alert-danger py-2 small">{{ formError }}</div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted">Restaurant <span class="text-danger">*</span></label>
                <select class="form-select text-muted" v-model="form.place_id" required>
                  <option value="">Select Restaurant</option>
                  <option v-for="place in places" :key="place.id" :value="place.id">{{ place.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold small text-muted">Customer</label>
                <select class="form-select text-muted" v-model="form.customer_id">
                  <option value="">Select Customer (optional)</option>
                  <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.full_name }}</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold small text-muted">Notes</label>
              <textarea class="form-control" rows="2" v-model="form.notes" placeholder="Order notes..."></textarea>
            </div>

            <!-- Items -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="form-label fw-bold small text-muted mb-0">Order Items</label>
              <button type="button" class="btn btn-sm btn-outline-secondary" @click="addFormItem">
                <i class="fas fa-plus me-1"></i>Add Item
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-sm align-middle mb-2">
                <thead class="bg-light">
                  <tr>
                    <th>Item Name</th>
                    <th style="width:90px">Qty</th>
                    <th style="width:120px">Unit Price</th>
                    <th style="width:110px">Subtotal</th>
                    <th style="width:50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in form.items" :key="idx">
                    <td><input class="form-control form-control-sm" v-model="item.item_name" placeholder="Item name"></td>
                    <td><input class="form-control form-control-sm" type="number" min="1" v-model.number="item.quantity"></td>
                    <td><input class="form-control form-control-sm" type="number" min="0" step="0.01" v-model.number="item.unit_price"></td>
                    <td class="text-end fw-bold">${{ (item.quantity * item.unit_price).toFixed(2) }}</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-danger" @click="removeFormItem(idx)"><i class="fas fa-times"></i></button>
                    </td>
                  </tr>
                  <tr v-if="form.items.length === 0">
                    <td colspan="5" class="text-center text-muted small py-2">No items added yet.</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end fw-bold">Total:</td>
                    <td class="text-end fw-bold text-primary">${{ formTotal }}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-link text-decoration-none text-secondary fw-bold" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary bg-custom-blue px-4"
              :disabled="ordersStore.isSubmitting"
              @click="submitCreate"
            >
              <span v-if="ordersStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ ordersStore.isSubmitting ? 'Saving...' : 'Create Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Edit Order Modal ─────────────────────────────────────────────── -->
    <div class="modal fade" id="editOrderModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">Edit Order <span class="text-muted fs-6">{{ editForm.order_number }}</span></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="editFormError" class="alert alert-danger py-2 small">{{ editFormError }}</div>

            <div class="row g-3 mb-3">
              <div class="col-md-4">
                <label class="form-label fw-bold small text-muted">Status</label>
                <select class="form-select" v-model="editForm.status">
                  <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold small text-muted">Restaurant <span class="text-danger">*</span></label>
                <select class="form-select text-muted" v-model="editForm.place_id">
                  <option value="">Select Restaurant</option>
                  <option v-for="place in places" :key="place.id" :value="place.id">{{ place.name }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold small text-muted">Customer</label>
                <select class="form-select text-muted" v-model="editForm.customer_id">
                  <option value="">No customer</option>
                  <option v-for="c in customers" :key="c.id" :value="c.id">{{ c.full_name }}</option>
                </select>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold small text-muted">Notes</label>
              <textarea class="form-control" rows="2" v-model="editForm.notes" placeholder="Order notes..."></textarea>
            </div>

            <!-- Items -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <label class="form-label fw-bold small text-muted mb-0">Order Items</label>
              <button type="button" class="btn btn-sm btn-outline-secondary" @click="addEditItem">
                <i class="fas fa-plus me-1"></i>Add Item
              </button>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered table-sm align-middle mb-2">
                <thead class="bg-light">
                  <tr>
                    <th>Item Name</th>
                    <th style="width:90px">Qty</th>
                    <th style="width:120px">Unit Price</th>
                    <th style="width:110px">Subtotal</th>
                    <th style="width:50px"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in editForm.items" :key="idx">
                    <td><input class="form-control form-control-sm" v-model="item.item_name" placeholder="Item name"></td>
                    <td><input class="form-control form-control-sm" type="number" min="1" v-model.number="item.quantity"></td>
                    <td><input class="form-control form-control-sm" type="number" min="0" step="0.01" v-model.number="item.unit_price"></td>
                    <td class="text-end fw-bold">${{ (item.quantity * item.unit_price).toFixed(2) }}</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-danger" @click="removeEditItem(idx)"><i class="fas fa-times"></i></button>
                    </td>
                  </tr>
                  <tr v-if="editForm.items.length === 0">
                    <td colspan="5" class="text-center text-muted small py-2">No items added yet.</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end fw-bold">Total:</td>
                    <td class="text-end fw-bold text-primary">${{ editFormTotal }}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div class="modal-footer border-0 pt-0">
            <button type="button" class="btn btn-link text-decoration-none text-secondary fw-bold" data-bs-dismiss="modal">Cancel</button>
            <button
              type="button"
              class="btn btn-primary bg-custom-blue px-4"
              :disabled="ordersStore.isSubmitting"
              @click="submitEdit"
            >
              <span v-if="ordersStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
              {{ ordersStore.isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup>
import MainLayout from '../layouts/MainLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { useOrdersStore }    from '../stores/orders.js'
import { usePlacesStore }    from '../stores/places.js'
import { useCustomersStore } from '../stores/customers.js'

const ordersStore    = useOrdersStore()
const placesStore    = usePlacesStore()
const customersStore = useCustomersStore()

const places    = ref([])
const customers = ref([])

// ── Status catalog ────────────────────────────────────────────────────────────
const statusOptions = [
  { value: 'pending',    label: 'Pending'    },
  { value: 'confirmed',  label: 'Confirmed'  },
  { value: 'preparing',  label: 'Preparing'  },
  { value: 'ready',      label: 'Ready'      },
  { value: 'delivered',  label: 'Delivered'  },
  { value: 'cancelled',  label: 'Cancelled'  },
]

const statusBadgeMap = {
  pending:   'badge bg-warning text-dark',
  confirmed: 'badge bg-info text-dark',
  preparing: 'badge bg-primary',
  ready:     'badge bg-success',
  delivered: 'badge bg-secondary',
  cancelled: 'badge bg-danger',
}

function statusClass(s)  { return statusBadgeMap[s] || 'badge bg-secondary' }
function statusLabel(s)  { return statusOptions.find(x => x.value === s)?.label || s }

// ── Filters ───────────────────────────────────────────────────────────────────
const filterPlaceId = ref('')
const filterStatus  = ref('')

function search() {
  ordersStore.fetchOrders({
    place_id: filterPlaceId.value || null,
    status:   filterStatus.value  || null,
  })
}

function reset() {
  filterPlaceId.value = ''
  filterStatus.value  = ''
  ordersStore.fetchOrders()
}

// ── Bootstrap modal helper ────────────────────────────────────────────────────
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
const emptyItem = () => ({ item_name: '', quantity: 1, unit_price: 0 })

const form      = ref({ place_id: '', customer_id: '', notes: '', items: [] })
const formError = ref('')
let addModalInstance = null

const formTotal = computed(() =>
  form.value.items.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0).toFixed(2)
)

function addFormItem()       { form.value.items.push(emptyItem()) }
function removeFormItem(idx) { form.value.items.splice(idx, 1) }

function openAdd() {
  formError.value = ''
  form.value = { place_id: '', customer_id: '', notes: '', items: [] }
  const el = document.getElementById('addOrderModal')
  addModalInstance = addModalInstance || new Modal(el)
  addModalInstance.show()
}

async function submitCreate() {
  formError.value = ''
  const payload = {
    place_id:    form.value.place_id    ? parseInt(form.value.place_id)    : null,
    customer_id: form.value.customer_id ? parseInt(form.value.customer_id) : null,
    notes:       form.value.notes,
    items:       form.value.items.filter(i => i.item_name.trim()),
  }
  const result = await ordersStore.createOrder(payload)
  if (result.success) {
    closeModal('addOrderModal')
  } else {
    formError.value = result.message
  }
}

// ── Edit form ─────────────────────────────────────────────────────────────────
const editForm      = ref({ id: null, order_number: '', place_id: '', customer_id: '', status: 'pending', notes: '', items: [] })
const editFormError = ref('')
let editModalInstance = null

const editFormTotal = computed(() =>
  editForm.value.items.reduce((sum, i) => sum + (i.quantity * i.unit_price), 0).toFixed(2)
)

function addEditItem()        { editForm.value.items.push(emptyItem()) }
function removeEditItem(idx)  { editForm.value.items.splice(idx, 1) }

function openEdit(order) {
  editFormError.value = ''
  editForm.value = {
    id:           order.id,
    order_number: order.order_number,
    place_id:     order.place_id     || '',
    customer_id:  order.customer_id  || '',
    status:       order.status       || 'pending',
    notes:        order.notes        || '',
    items: (order.items || []).map(i => ({
      item_name:  i.item_name,
      quantity:   i.quantity,
      unit_price: i.unit_price,
    })),
  }
  const el = document.getElementById('editOrderModal')
  editModalInstance = editModalInstance || new Modal(el)
  editModalInstance.show()
}

async function submitEdit() {
  editFormError.value = ''
  const payload = {
    id:          editForm.value.id,
    place_id:    editForm.value.place_id    ? parseInt(editForm.value.place_id)    : null,
    customer_id: editForm.value.customer_id ? parseInt(editForm.value.customer_id) : null,
    status:      editForm.value.status,
    notes:       editForm.value.notes,
    items:       editForm.value.items.filter(i => i.item_name.trim()),
  }
  const result = await ordersStore.updateOrder(payload)
  if (result.success) {
    closeModal('editOrderModal')
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

function formatAmount(val) {
  return Number(val).toFixed(2)
}

onMounted(async () => {
  ordersStore.fetchOrders()
  await Promise.all([placesStore.fetchPlaces(), customersStore.fetchCustomers()])
  places.value    = placesStore.places
  customers.value = customersStore.customers
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
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
}

.card {
  border-radius: 8px;
}

.modal-content {
  border-radius: 12px;
}

.form-control:focus,
.form-select:focus {
  border-color: #1a237e;
  box-shadow: 0 0 0 0.25rem rgba(26, 35, 126, 0.25);
}
</style>
