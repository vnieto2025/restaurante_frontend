<template>
  <MainLayout>
    <h3 class="fw-bold mb-4">Role Management</h3>

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'roles' }" @click="activeTab = 'roles'">Roles</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Users</button>
      </li>
    </ul>

    <!-- ── ROLES TAB ──────────────────────────────────────────────────────── -->
    <div v-if="activeTab === 'roles'">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addRoleModal">Add Role</button>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div v-if="rolesStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
          <table v-else class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>#</th><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr v-if="rolesStore.roles.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">No roles found.</td>
              </tr>
              <tr v-for="(r, i) in rolesStore.roles" :key="r.id">
                <td>{{ i + 1 }}</td>
                <td>{{ r.name }}</td>
                <td>{{ r.description || '—' }}</td>
                <td><span :class="r.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">{{ r.status == 1 ? 'Active' : 'Inactive' }}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" @click="openEditRole(r)"><i class="fas fa-edit"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── USERS TAB ──────────────────────────────────────────────────────── -->
    <div v-if="activeTab === 'users'">
      <div class="d-flex justify-content-end mb-3">
        <button class="btn btn-primary bg-custom-blue" data-bs-toggle="modal" data-bs-target="#addUserModal">Add User</button>
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-0">
          <div v-if="rolesStore.isLoading" class="text-center p-4"><div class="spinner-border text-primary"></div></div>
          <table v-else class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>#</th><th>Username</th><th>Role</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr v-if="rolesStore.users.length === 0">
                <td colspan="5" class="text-center py-4 text-muted">No users found.</td>
              </tr>
              <tr v-for="(u, i) in rolesStore.users" :key="u.id">
                <td>{{ i + 1 }}</td>
                <td>{{ u.username }}</td>
                <td>{{ u.role || '—' }}</td>
                <td><span :class="u.status == 1 ? 'badge bg-success' : 'badge bg-secondary'">{{ u.status == 1 ? 'Active' : 'Inactive' }}</span></td>
                <td><button class="btn btn-sm btn-outline-primary" @click="openEditUser(u)"><i class="fas fa-edit"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add Role Modal -->
    <div class="modal fade" id="addRoleModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Add Role</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Name <span class="text-danger">*</span></label><input type="text" class="form-control" v-model="addRoleForm.name" /></div>
            <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="addRoleForm.description" rows="3"></textarea></div>
            <div v-if="addRoleError" class="alert alert-danger">{{ addRoleError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary bg-custom-blue" @click="submitAddRole" :disabled="rolesStore.isSubmitting">
              <span v-if="rolesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Role Modal -->
    <div class="modal fade" id="editRoleModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Edit Role</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Name <span class="text-danger">*</span></label><input type="text" class="form-control" v-model="editRoleForm.name" /></div>
            <div class="mb-3"><label class="form-label">Description</label><textarea class="form-control" v-model="editRoleForm.description" rows="3"></textarea></div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="editRoleForm.status"><option :value="1">Active</option><option :value="0">Inactive</option></select>
            </div>
            <div v-if="editRoleError" class="alert alert-danger">{{ editRoleError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary bg-custom-blue" @click="submitEditRole" :disabled="rolesStore.isSubmitting">
              <span v-if="rolesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>Update
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <div class="modal fade" id="addUserModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Add User</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Username <span class="text-danger">*</span></label><input type="text" class="form-control" v-model="addUserForm.username" /></div>
            <div class="mb-3"><label class="form-label">Password <span class="text-danger">*</span></label><input type="password" class="form-control" v-model="addUserForm.password" /></div>
            <div class="mb-3">
              <label class="form-label">Role <span class="text-danger">*</span></label>
              <select class="form-select" v-model="addUserForm.role_id">
                <option value="">Select role</option>
                <option v-for="r in rolesStore.roles" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div v-if="addUserError" class="alert alert-danger">{{ addUserError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary bg-custom-blue" @click="submitAddUser" :disabled="rolesStore.isSubmitting">
              <span v-if="rolesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div class="modal fade" id="editUserModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Edit User</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label">Username</label><input type="text" class="form-control" :value="editUserForm.username" disabled /></div>
            <div class="mb-3"><label class="form-label">New Password <small class="text-muted">(leave blank to keep)</small></label><input type="password" class="form-control" v-model="editUserForm.password" /></div>
            <div class="mb-3">
              <label class="form-label">Role</label>
              <select class="form-select" v-model="editUserForm.role_id">
                <option v-for="r in rolesStore.roles" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="editUserForm.status"><option :value="1">Active</option><option :value="0">Inactive</option></select>
            </div>
            <div v-if="editUserError" class="alert alert-danger">{{ editUserError }}</div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary bg-custom-blue" @click="submitEditUser" :disabled="rolesStore.isSubmitting">
              <span v-if="rolesStore.isSubmitting" class="spinner-border spinner-border-sm me-1"></span>Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useRolesStore } from '../stores/roles.js'
import { Modal } from 'bootstrap'

const rolesStore = useRolesStore()
const activeTab  = ref('roles')

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
  if (tab === 'roles') rolesStore.fetchRoles()
  else rolesStore.fetchUsers()
})

// Roles
const addRoleForm  = ref({ name: '', description: '' })
const addRoleError = ref('')

async function submitAddRole() {
  addRoleError.value = ''
  if (!addRoleForm.value.name.trim()) { addRoleError.value = 'Name is required.'; return }
  const res = await rolesStore.createRole({ ...addRoleForm.value })
  if (res.success) { addRoleForm.value = { name: '', description: '' }; closeModal('addRoleModal') }
  else addRoleError.value = res.message
}

const editRoleForm  = ref({})
const editRoleError = ref('')

function openEditRole(r) {
  editRoleForm.value = { id: r.id, name: r.name, description: r.description || '', status: r.status }
  editRoleError.value = ''
  new Modal(document.getElementById('editRoleModal')).show()
}

async function submitEditRole() {
  editRoleError.value = ''
  if (!editRoleForm.value.name?.trim()) { editRoleError.value = 'Name is required.'; return }
  const res = await rolesStore.updateRole({ ...editRoleForm.value })
  if (res.success) closeModal('editRoleModal')
  else editRoleError.value = res.message
}

// Users
const addUserForm  = ref({ username: '', password: '', role_id: '' })
const addUserError = ref('')

async function submitAddUser() {
  addUserError.value = ''
  if (!addUserForm.value.username.trim() || !addUserForm.value.password.trim() || !addUserForm.value.role_id) {
    addUserError.value = 'Username, password and role are required.'; return
  }
  const res = await rolesStore.createUser({ ...addUserForm.value })
  if (res.success) { addUserForm.value = { username: '', password: '', role_id: '' }; closeModal('addUserModal') }
  else addUserError.value = res.message
}

const editUserForm  = ref({})
const editUserError = ref('')

function openEditUser(u) {
  editUserForm.value = { id: u.id, username: u.username, password: '', role_id: u.role_id, status: u.status }
  editUserError.value = ''
  new Modal(document.getElementById('editUserModal')).show()
}

async function submitEditUser() {
  editUserError.value = ''
  const res = await rolesStore.updateUser({ ...editUserForm.value })
  if (res.success) closeModal('editUserModal')
  else editUserError.value = res.message
}

onMounted(() => {
  rolesStore.fetchRoles()
  rolesStore.fetchUsers()
})
</script>
