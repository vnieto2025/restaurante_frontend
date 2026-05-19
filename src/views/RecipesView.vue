<template>
  <MainLayout>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold">Recipes</h3>
      <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addRecipeModal">Add Recipe</button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="recipesStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
        <table v-else class="table table-hover mb-0">
          <thead class="table-light">
            <tr><th>#</th><th>Name</th><th>Menu Item</th><th>Ingredients</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-if="recipesStore.recipes.length === 0"><td colspan="6" class="text-center py-4 text-muted">No recipes found.</td></tr>
            <tr v-for="(r, i) in recipesStore.recipes" :key="r.id">
              <td>{{ i + 1 }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.menu_item || '—' }}</td>
              <td>{{ r.ingredients ? r.ingredients.length : 0 }}</td>
              <td><span :class="r.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">{{ r.status == 1 ? 'Active' : 'Inactive' }}</span></td>
              <td><button class="btn btn-sm btn-outline-primary" @click="openEdit(r)"><i class="fas fa-edit"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal fade" id="addRecipeModal" tabindex="-1">
      <div class="modal-dialog modal-lg"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Add Recipe</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="addForm.name" /></div>
          <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="addForm.description" rows="2"></textarea></div>
          <hr />
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6>Ingredients</h6>
            <button class="btn btn-sm btn-outline-secondary" @click="addIngRow(addForm)">+ Add</button>
          </div>
          <div v-for="(row, idx) in addForm.ingredients" :key="idx" class="row g-2 mb-2 align-items-center">
            <div class="col-md-7">
              <select class="form-select form-select-sm" v-model="row.ingredient_id">
                <option value="">Select ingredient</option>
                <option v-for="ing in ingStore.ingredients" :key="ing.id" :value="ing.id">{{ ing.name }} ({{ ing.unit }})</option>
              </select>
            </div>
            <div class="col-md-3">
              <input type="number" step="0.001" class="form-control form-control-sm" v-model="row.quantity" placeholder="Qty" />
            </div>
            <div class="col-md-2">
              <button class="btn btn-sm btn-outline-danger w-100" @click="removeIngRow(addForm, idx)">Remove</button>
            </div>
          </div>
          <div v-if="addError" class="alert alert-danger mt-2">{{ addError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitAdd" :disabled="recipesStore.isSubmitting">Save</button>
        </div>
      </div></div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editRecipeModal" tabindex="-1">
      <div class="modal-dialog modal-lg"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">Edit Recipe</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <div class="mb-3"><label class="form-label">Name *</label><input type="text" class="form-control" v-model="editForm.name" /></div>
          <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="editForm.description" rows="2"></textarea></div>
          <div class="mb-3"><label class="form-label">Status</label><select class="form-select" v-model="editForm.status"><option :value="1">Active</option><option :value="0">Inactive</option></select></div>
          <hr />
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h6>Ingredients</h6>
            <button class="btn btn-sm btn-outline-secondary" @click="addIngRow(editForm)">+ Add</button>
          </div>
          <div v-for="(row, idx) in editForm.ingredients" :key="idx" class="row g-2 mb-2 align-items-center">
            <div class="col-md-7">
              <select class="form-select form-select-sm" v-model="row.ingredient_id">
                <option value="">Select ingredient</option>
                <option v-for="ing in ingStore.ingredients" :key="ing.id" :value="ing.id">{{ ing.name }} ({{ ing.unit }})</option>
              </select>
            </div>
            <div class="col-md-3">
              <input type="number" step="0.001" class="form-control form-control-sm" v-model="row.quantity" placeholder="Qty" />
            </div>
            <div class="col-md-2">
              <button class="btn btn-sm btn-outline-danger w-100" @click="removeIngRow(editForm, idx)">Remove</button>
            </div>
          </div>
          <div v-if="editError" class="alert alert-danger mt-2">{{ editError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button class="btn btn-primary bg-custom-blue" @click="submitEdit" :disabled="recipesStore.isSubmitting">Update</button>
        </div>
      </div></div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useRecipesStore } from '../stores/recipes.js'
import { useIngredientsStore } from '../stores/ingredients.js'
import { Modal } from 'bootstrap'

const recipesStore = useRecipesStore()
const ingStore     = useIngredientsStore()

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

function addIngRow(form) { form.ingredients.push({ ingredient_id: '', quantity: 1 }) }
function removeIngRow(form, idx) { form.ingredients.splice(idx, 1) }

const addForm  = ref({ name: '', description: '', ingredients: [] })
const addError = ref('')

async function submitAdd() {
  addError.value = ''
  if (!addForm.value.name.trim()) { addError.value = 'Name is required.'; return }
  const res = await recipesStore.createRecipe({ ...addForm.value })
  if (res.success) { addForm.value = { name: '', description: '', ingredients: [] }; closeModal('addRecipeModal') }
  else addError.value = res.message
}

const editForm  = ref({})
const editError = ref('')

function openEdit(r) {
  editForm.value = {
    id: r.id, name: r.name, description: r.description || '', status: r.status,
    ingredients: (r.ingredients || []).map(i => ({ ingredient_id: i.ingredient_id, quantity: i.quantity }))
  }
  editError.value = ''
  new Modal(document.getElementById('editRecipeModal')).show()
}

async function submitEdit() {
  editError.value = ''
  if (!editForm.value.name?.trim()) { editError.value = 'Name is required.'; return }
  const res = await recipesStore.updateRecipe({ ...editForm.value })
  if (res.success) closeModal('editRecipeModal')
  else editError.value = res.message
}

onMounted(() => {
  recipesStore.fetchRecipes()
  ingStore.fetchIngredients()
})
</script>
