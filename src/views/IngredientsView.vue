<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Ingredients</h3>
      <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addIngModal">Add Ingredient</button>
    </div>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="Search by name" v-model="filterName" />
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-primary bg-custom-blue flex-fill" @click="search">Search</button>
            <button class="btn btn-secondary flex-fill" @click="clearFilters">Clear</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="ingStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
        <table v-else class="table table-hover mb-0">
          <thead class="table-light">
            <tr><th>#</th><th>Name</th><th>Unit</th><th>Stock</th><th>Min Stock</th><th>Cost/Unit</th><th>Stock Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-if="ingStore.ingredients.length === 0"><td colspan="8" class="text-center py-4 text-muted">No ingredients found.</td></tr>
            <tr v-for="(ing, i) in ingStore.ingredients" :key="ing.id">
              <td>{{ i + 1 }}</td>
              <td>{{ ing.name }}</td>
              <td>{{ ing.unit }}</td>
              <td>{{ ing.stock_quantity }}</td>
              <td>{{ ing.min_stock }}</td>
              <td>${{ Number(ing.cost_per_unit).toFixed(2) }}</td>
              <td>
                <span v-if="ing.low_stock" class="badge bg-danger">Low Stock</span>
                <span v-else class="badge bg-success">OK</span>
              </td>
              <td><button class="btn btn-sm btn-outline-primary" @click="openEdit(ing)"><i class="fas fa-edit"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal fade" id="addIngModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Add Ingredient</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="addForm.name" /></div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Unit</label><input type="text" class="form-control" v-model="addForm.unit" placeholder="e.g. kg, L, unit" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">Stock Qty</label><input type="number" step="0.001" class="form-control" v-model="addForm.stock_quantity" /></div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Min Stock</label><input type="number" step="0.001" class="form-control" v-model="addForm.min_stock" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">Cost/Unit</label><input type="number" step="0.01" class="form-control" v-model="addForm.cost_per_unit" /></div>
          </div>
          <div v-if="addError" class="alert alert-danger">{{ addError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitAdd" :disabled="ingStore.isSubmitting">Save</button>
        </div>
      </div></div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editIngModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Edit Ingredient</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="editForm.name" /></div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Unit</label><input type="text" class="form-control" v-model="editForm.unit" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">Stock Qty</label><input type="number" step="0.001" class="form-control" v-model="editForm.stock_quantity" /></div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3"><label class="form-label">Min Stock</label><input type="number" step="0.001" class="form-control" v-model="editForm.min_stock" /></div>
            <div class="col-md-6 mb-3"><label class="form-label">Cost/Unit</label><input type="number" step="0.01" class="form-control" v-model="editForm.cost_per_unit" /></div>
          </div>
          <div class="mb-3"><label class="form-label">Status</label><select class="form-select" v-model="editForm.status"><option :value="1">Active</option><option :value="0">Inactive</option></select></div>
          <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitEdit" :disabled="ingStore.isSubmitting">Update</button>
        </div>
      </div></div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useIngredientsStore } from '../stores/ingredients.js'
import { Modal } from 'bootstrap'

const ingStore = useIngredientsStore()

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

const filterName = ref('')
function search() { ingStore.fetchIngredients({ name: filterName.value }) }
function clearFilters() { filterName.value = ''; ingStore.fetchIngredients() }

const addForm  = ref({ name: '', unit: 'unit', stock_quantity: 0, min_stock: 0, cost_per_unit: 0 })
const addError = ref('')

async function submitAdd() {
  addError.value = ''
  if (!addForm.value.name.trim()) { addError.value = 'Name is required.'; return }
  const res = await ingStore.createIngredient({ ...addForm.value })
  if (res.success) { addForm.value = { name: '', unit: 'unit', stock_quantity: 0, min_stock: 0, cost_per_unit: 0 }; closeModal('addIngModal') }
  else addError.value = res.message
}

const editForm  = ref({})
const editError = ref('')

function openEdit(ing) {
  editForm.value = { ...ing }
  editError.value = ''
  new Modal(document.getElementById('editIngModal')).show()
}

async function submitEdit() {
  editError.value = ''
  if (!editForm.value.name?.trim()) { editError.value = 'Name is required.'; return }
  const res = await ingStore.updateIngredient({ ...editForm.value })
  if (res.success) closeModal('editIngModal')
  else editError.value = res.message
}

onMounted(() => ingStore.fetchIngredients())
</script>
