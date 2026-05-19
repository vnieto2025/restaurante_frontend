<template>
  <MainLayout>
    <h3 class="fw-bold mb-4">Menus</h3>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">Categories</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'items' }" @click="activeTab = 'items'">Items</button>
      </li>
    </ul>

    <!-- CATEGORIES -->
    <div v-if="activeTab === 'categories'">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addCatModal">Add Category</button>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div v-if="menusStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
          <table v-else class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>#</th><th>Name</th><th>Description</th><th>Sort</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr v-if="menusStore.categories.length === 0"><td colspan="6" class="text-center py-4 text-muted">No categories found.</td></tr>
              <tr v-for="(c, i) in menusStore.categories" :key="c.id">
                <td>{{ i + 1 }}</td>
                <td>{{ c.name }}</td>
                <td>{{ c.description || '—' }}</td>
                <td>{{ c.sort_order }}</td>
                <td><span :class="c.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">{{ c.status == 1 ? 'Active' : 'Inactive' }}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" @click="openEditCat(c)"><i class="fas fa-edit"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ITEMS -->
    <div v-if="activeTab === 'items'">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addItemModal">Add Item</button>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div v-if="menusStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
          <table v-else class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>#</th><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr v-if="menusStore.items.length === 0"><td colspan="6" class="text-center py-4 text-muted">No items found.</td></tr>
              <tr v-for="(it, i) in menusStore.items" :key="it.id">
                <td>{{ i + 1 }}</td>
                <td>{{ it.name }}</td>
                <td>{{ it.category || '—' }}</td>
                <td>${{ Number(it.price).toFixed(2) }}</td>
                <td><span :class="it.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">{{ it.status == 1 ? 'Active' : 'Inactive' }}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" @click="openEditItem(it)"><i class="fas fa-edit"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div class="modal fade" id="addCatModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Add Category</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="addCatForm.name" /></div>
          <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="addCatForm.description" rows="2"></textarea></div>
          <div class="mb-3"><label class="form-label">Sort Order</label><input type="number" class="form-control" v-model="addCatForm.sort_order" /></div>
          <div v-if="addCatError" class="alert alert-danger">{{ addCatError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitAddCat" :disabled="menusStore.isSubmitting">Save</button>
        </div>
      </div></div>
    </div>

    <!-- Edit Category Modal -->
    <div class="modal fade" id="editCatModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Edit Category</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="editCatForm.name" /></div>
          <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="editCatForm.description" rows="2"></textarea></div>
          <div class="mb-3"><label class="form-label">Sort Order</label><input type="number" class="form-control" v-model="editCatForm.sort_order" /></div>
          <div class="mb-3"><label class="form-label">Status</label><select class="form-select" v-model="editCatForm.status"><option :value="1">Active</option><option :value="0">Inactive</option></select></div>
          <div v-if="editCatError" class="alert alert-danger">{{ editCatError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitEditCat" :disabled="menusStore.isSubmitting">Update</button>
        </div>
      </div></div>
    </div>

    <!-- Add Item Modal -->
    <div class="modal fade" id="addItemModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Add Menu Item</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="addItemForm.name" /></div>
          <div class="mb-3">
            <label class="form-label">Category</label>
            <select class="form-select" v-model="addItemForm.category_id">
              <option value="">None</option>
              <option v-for="c in menusStore.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="addItemForm.description" rows="2"></textarea></div>
          <div class="mb-3"><label class="form-label">Price</label><input type="number" step="0.01" class="form-control" v-model="addItemForm.price" /></div>
          <div v-if="addItemError" class="alert alert-danger">{{ addItemError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitAddItem" :disabled="menusStore.isSubmitting">Save</button>
        </div>
      </div></div>
    </div>

    <!-- Edit Item Modal -->
    <div class="modal fade" id="editItemModal" tabindex="-1">
      <div class="modal-dialog"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Edit Menu Item</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="editItemForm.name" /></div>
          <div class="mb-3">
            <label class="form-label">Category</label>
            <select class="form-select" v-model="editItemForm.category_id">
              <option value="">None</option>
              <option v-for="c in menusStore.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="editItemForm.description" rows="2"></textarea></div>
          <div class="mb-3"><label class="form-label">Price</label><input type="number" step="0.01" class="form-control" v-model="editItemForm.price" /></div>
          <div class="mb-3"><label class="form-label">Status</label><select class="form-select" v-model="editItemForm.status"><option :value="1">Active</option><option :value="0">Inactive</option></select></div>
          <div v-if="editItemError" class="alert alert-danger">{{ editItemError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitEditItem" :disabled="menusStore.isSubmitting">Update</button>
        </div>
      </div></div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useMenusStore } from '../stores/menus.js'
import { Modal } from 'bootstrap'

const menusStore = useMenusStore()
const activeTab  = ref('categories')

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

watch(activeTab, (tab) => {
  if (tab === 'categories') menusStore.fetchCategories()
  else menusStore.fetchItems()
})

// Categories
const addCatForm  = ref({ name: '', description: '', sort_order: 0 })
const addCatError = ref('')

async function submitAddCat() {
  addCatError.value = ''
  if (!addCatForm.value.name.trim()) { addCatError.value = 'Name is required.'; return }
  const res = await menusStore.createCategory({ ...addCatForm.value })
  if (res.success) { addCatForm.value = { name: '', description: '', sort_order: 0 }; closeModal('addCatModal') }
  else addCatError.value = res.message
}

const editCatForm  = ref({})
const editCatError = ref('')

function openEditCat(c) {
  editCatForm.value = { id: c.id, name: c.name, description: c.description || '', sort_order: c.sort_order, status: c.status }
  editCatError.value = ''
  new Modal(document.getElementById('editCatModal')).show()
}

async function submitEditCat() {
  editCatError.value = ''
  if (!editCatForm.value.name?.trim()) { editCatError.value = 'Name is required.'; return }
  const res = await menusStore.updateCategory({ ...editCatForm.value })
  if (res.success) closeModal('editCatModal')
  else editCatError.value = res.message
}

// Items
const addItemForm  = ref({ name: '', category_id: '', description: '', price: 0 })
const addItemError = ref('')

async function submitAddItem() {
  addItemError.value = ''
  if (!addItemForm.value.name.trim()) { addItemError.value = 'Name is required.'; return }
  const res = await menusStore.createItem({ ...addItemForm.value })
  if (res.success) { addItemForm.value = { name: '', category_id: '', description: '', price: 0 }; closeModal('addItemModal') }
  else addItemError.value = res.message
}

const editItemForm  = ref({})
const editItemError = ref('')

function openEditItem(it) {
  editItemForm.value = { id: it.id, name: it.name, category_id: it.category_id, description: it.description || '', price: it.price, status: it.status }
  editItemError.value = ''
  new Modal(document.getElementById('editItemModal')).show()
}

async function submitEditItem() {
  editItemError.value = ''
  if (!editItemForm.value.name?.trim()) { editItemError.value = 'Name is required.'; return }
  const res = await menusStore.updateItem({ ...editItemForm.value })
  if (res.success) closeModal('editItemModal')
  else editItemError.value = res.message
}

onMounted(() => {
  menusStore.fetchCategories()
  menusStore.fetchItems()
})
</script>
