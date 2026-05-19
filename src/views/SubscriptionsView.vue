<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Subscriptions</h3>
      <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addSubModal">Add Subscription</button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="subsStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
        <table v-else class="table table-hover mb-0">
          <thead class="table-light">
            <tr><th>#</th><th>Customer</th><th>Plan</th><th>Start</th><th>End</th><th>Price</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-if="subsStore.subscriptions.length === 0"><td colspan="8" class="text-center py-4 text-muted">No subscriptions found.</td></tr>
            <tr v-for="(s, i) in subsStore.subscriptions" :key="s.id">
              <td>{{ i + 1 }}</td>
              <td>{{ s.customer || '—' }}</td>
              <td>{{ s.plan_name }}</td>
              <td>{{ s.start_date || '—' }}</td>
              <td>{{ s.end_date || '—' }}</td>
              <td>${{ Number(s.price).toFixed(2) }}</td>
              <td><span :class="s.status === 'active' ? 'badge bg-success' : 'badge bg-secondary'">{{ s.status }}</span></td>
              <td><button class="btn btn-sm btn-outline-primary" @click="openEdit(s)"><i class="fas fa-edit"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal fade" id="addSubModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Add Subscription</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Plan Name *</label><input type="text" class="form-control" v-model="addForm.plan_name" /></div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Price</label><input type="number" step="0.01" class="form-control" v-model="addForm.price" /></div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="addForm.status">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Start Date</label><input type="date" class="form-control" v-model="addForm.start_date" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">End Date</label><input type="date" class="form-control" v-model="addForm.end_date" /></div>
          </div>
          <div class="mb-3"><label class="form-label">Notes</label><textarea class="form-control" v-model="addForm.notes" rows="2"></textarea></div>
          <div v-if="addError" class="alert alert-danger">{{ addError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitAdd" :disabled="subsStore.isSubmitting">Save</button>
        </div>
      </div></div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editSubModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Edit Subscription</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Plan Name *</label><input type="text" class="form-control" v-model="editForm.plan_name" /></div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Price</label><input type="number" step="0.01" class="form-control" v-model="editForm.price" /></div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="editForm.status">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Start Date</label><input type="date" class="form-control" v-model="editForm.start_date" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">End Date</label><input type="date" class="form-control" v-model="editForm.end_date" /></div>
          </div>
          <div class="mb-3"><label class="form-label">Notes</label><textarea class="form-control" v-model="editForm.notes" rows="2"></textarea></div>
          <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitEdit" :disabled="subsStore.isSubmitting">Update</button>
        </div>
      </div></div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useSubscriptionsStore } from '../stores/subscriptions.js'
import { Modal } from 'bootstrap'

const subsStore = useSubscriptionsStore()

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

const addForm  = ref({ plan_name: '', price: 0, status: 'active', start_date: '', end_date: '', notes: '' })
const addError = ref('')

async function submitAdd() {
  addError.value = ''
  if (!addForm.value.plan_name.trim()) { addError.value = 'Plan name is required.'; return }
  const res = await subsStore.createSubscription({ ...addForm.value })
  if (res.success) { addForm.value = { plan_name: '', price: 0, status: 'active', start_date: '', end_date: '', notes: '' }; closeModal('addSubModal') }
  else addError.value = res.message
}

const editForm  = ref({})
const editError = ref('')

function openEdit(s) {
  editForm.value = { id: s.id, plan_name: s.plan_name, price: s.price, status: s.status, start_date: s.start_date || '', end_date: s.end_date || '', notes: s.notes || '' }
  editError.value = ''
  new Modal(document.getElementById('editSubModal')).show()
}

async function submitEdit() {
  editError.value = ''
  if (!editForm.value.plan_name?.trim()) { editError.value = 'Plan name is required.'; return }
  const res = await subsStore.updateSubscription({ ...editForm.value })
  if (res.success) closeModal('editSubModal')
  else editError.value = res.message
}

onMounted(() => subsStore.fetchSubscriptions())
</script>
