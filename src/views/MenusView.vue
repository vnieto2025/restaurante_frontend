<template>
  <MainLayout>
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold text-dark">Menus</h3>
      <button 
        class="btn btn-primary bg-custom-blue border-0 px-4 py-2" 
        data-bs-toggle="modal" 
        data-bs-target="#addMenuModal"
      >
        Add New Menu
      </button>
    </div>

    <!-- Filter Section -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3 align-items-center">
          <div class="col-md-4">
            <input
              type="text"
              class="form-control"
              placeholder="Search by name"
              v-model="filters.name"
            />
          </div>
          <div class="col-md-3">
             <select class="form-select text-muted" v-model="filters.status">
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
             </select>
          </div>
          <div class="col-md-3">
               <!-- Placeholder for another filter or empty -->
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button class="btn btn-search text-white flex-grow-1">Search</button>
            <button class="btn btn-light flex-grow-1" @click="resetFilters">Reset</button>
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
                <th class="ps-4 py-3 border-0 text-muted text-uppercase small fw-bold">PDF</th>
                <th class="py-3 border-0 text-muted text-uppercase small fw-bold">Title</th>
                <th class="py-3 border-0 text-muted text-uppercase small fw-bold">Description</th>
                <th class="py-3 border-0 text-muted text-uppercase small fw-bold">Status</th>
                <th class="py-3 border-0 text-muted text-uppercase small fw-bold text-end pe-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="menu in menus" :key="menu.id">
                <td class="ps-4">
                    <i class="far fa-file-pdf text-primary fs-5" title="View PDF"></i>
                </td>
                <td class="fw-bold">{{ menu.title }}</td>
                <td class="text-muted">{{ menu.description }}</td>
                <td>
                  <span 
                    class="badge rounded-pill px-3 py-2"
                    :class="menu.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'"
                  >
                    {{ menu.status }}
                  </span>
                </td>
                <td class="text-end pe-4">
                  <div class="d-flex gap-2 justify-content-end">
                      <button class="btn btn-sm text-secondary" title="Edit">
                        <i class="far fa-edit fa-lg"></i>
                      </button>
                      <button class="btn btn-sm text-danger" title="Delete">
                        <i class="far fa-trash-alt fa-lg"></i>
                      </button>
                      <button class="btn btn-sm text-secondary" title="Inventory">
                        <i class="fas fa-box fa-lg"></i>
                      </button>
                       <button class="btn btn-sm text-secondary" title="Details">
                        <i class="fas fa-list fa-lg"></i>
                      </button>
                       <button class="btn btn-sm text-secondary" title="View">
                        <i class="far fa-eye fa-lg"></i>
                      </button>
                  </div>
                </td>
              </tr>
              <tr v-if="menus.length === 0">
                 <td colspan="5" class="text-center py-4 text-muted">No menus found</td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination (Mockup) -->
          <div class="d-flex justify-content-end align-items-center p-3 border-top">
              <span class="text-muted small me-3">Rows per page: 10 <i class="fas fa-chevron-down ms-1"></i></span>
              <span class="text-muted small me-3">1-{{ menus.length }} of {{ menus.length }}</span>
              <div class="btn-group">
                  <button class="btn btn-sm btn-light border-0"><i class="fas fa-chevron-left text-muted"></i></button>
                  <button class="btn btn-sm btn-light border-0"><i class="fas fa-chevron-right text-muted"></i></button>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Menu Modal -->
    <div class="modal fade" id="addMenuModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">Add New Menu</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <form>
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Language</label>
                  <select class="form-select" v-model="newMenu.language">
                    <option value="" disabled selected>Select Language</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Status <span class="text-danger">*</span></label>
                  <select class="form-select" v-model="newMenu.status">
                    <option value="" disabled selected>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Title</label>
                  <input type="text" class="form-control" placeholder="Menu Title" v-model="newMenu.title">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Description</label>
                  <input type="text" class="form-control" placeholder="Menu Description" v-model="newMenu.description">
                </div>
              </div>

              <div class="row g-3 mb-3">
                 <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Restaurant</label>
                  <input type="text" class="form-control" value="Hotel Resort Ejemplo" disabled readonly>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Start Time</label>
                  <input type="text" class="form-control" placeholder="12:30 p.m." v-model="newMenu.startTime">
                </div>
              </div>
               
               <div class="row g-3">
                 <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">End Time</label>
                  <input type="text" class="form-control" placeholder="12:30 p.m." v-model="newMenu.endTime">
                </div>
              </div>

            </form>
          </div>
          <div class="modal-footer border-0 pt-0 px-4 pb-4">
             <button type="button" class="btn btn-light text-secondary fw-bold px-4" data-bs-dismiss="modal">Cancel</button>
             <button type="button" class="btn btn-primary bg-custom-blue px-5" @click="addMenu">Add</button>
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup>
import MainLayout from "../layouts/MainLayout.vue";
import { ref } from "vue";

const filters = ref({
    name: '',
    status: ''
});

const resetFilters = () => {
    filters.value.name = '';
    filters.value.status = '';
};

const newMenu = ref({
    language: '',
    status: '',
    title: '',
    description: '',
    restaurant: 'Hotel Resort Ejemplo',
    startTime: '',
    endTime: ''
});

// Mock Data
const menus = ref([
  {
    id: 1,
    title: "2. Drinks / Bebidas",
    description: "Bebidas alcohólicas y no alcohólicas",
    status: "Active",
  },
  {
    id: 2,
    title: "6. Technical Assistance",
    description: "Support services",
    status: "Active",
  },
  {
    id: 3,
    title: "7. Complaints and Claims",
    description: "Customer feedback channel",
    status: "Active",
  },
   {
    id: 4,
    title: "1. Need Mice en Place",
    description: "Preparation list",
    status: "Active",
  },
]);

const addMenu = () => {
    // Logic to add menu would go here (e.g., API call)
    // For now, just a console log and maybe close modal (if using bootstrap js correctly)
    console.log("Adding menu:", newMenu.value);
    
    // Simulate adding to list
    menus.value.unshift({
        id: Date.now(),
        title: newMenu.value.title || "New Menu",
        description: newMenu.value.description || "No description",
        status: newMenu.value.status || "Inactive"
    });

    // Reset form
    newMenu.value = {
        language: '',
        status: '',
        title: '',
        description: '',
        restaurant: 'Hotel Resort Ejemplo',
        startTime: '',
        endTime: ''
    };
    
    // In a real app, we'd close the modal programmatically here
};
</script>

<style scoped>
.bg-custom-blue {
  background-color: #1a237e; /* Dark blue from screenshot/MainLayout */
  border-color: #1a237e;
}

.btn-primary:hover {
    background-color: #0d165f;
    border-color: #0d165f;
}

.btn-search {
  background-color: #1a237e;
  border-color: #1a237e;
}

.text-custom-blue {
    color: #1a237e;
}

.table thead th {
  letter-spacing: 0.5px;
}

.form-control:focus, .form-select:focus {
  border-color: #1a237e;
  box-shadow: 0 0 0 0.25rem rgba(26, 35, 126, 0.25);
}

/* Modal styling adjustments */
.modal-content {
    border-radius: 10px;
}
</style>
