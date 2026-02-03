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
            />
          </div>
          <div class="col-md-3">
            <input
              type="text"
              class="form-control"
              placeholder="Search by address"
            />
          </div>
          <div class="col-md-2">
            <input
              type="text"
              class="form-control"
              placeholder="Search by phone"
            />
          </div>
          <div class="col-md-2">
            <input
              type="text"
              class="form-control"
              placeholder="Search by email"
            />
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button class="btn btn-search text-white flex-grow-1">Search</button>
            <button class="btn btn-light flex-grow-1">Reset</button>
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="place in places" :key="place.id">
                <td class="ps-4">{{ place.created }}</td>
                <td>{{ place.placeId }}</td>
                <td>{{ place.placeHash }}</td>
                <td>{{ place.name }}</td>
                <td>{{ place.address }}</td>
                <td>{{ place.phone }}</td>
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
            <form>
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Restaurant Name">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Address <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Address">
                </div>
              </div>
              
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Phone <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" placeholder="Phone">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Email <span class="text-danger">*</span></label>
                  <input type="email" class="form-control" placeholder="Email">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold small text-muted">Website</label>
                <input type="text" class="form-control" placeholder="Website">
              </div>

              <div class="row g-3">
                <!-- Columna Izquierda: Venue -->
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted">Venue</label>
                  <select class="form-select text-muted">
                    <option selected>Select Venue</option>
                    <option value="1">Venue 1</option>
                    <option value="2">Venue 2</option>
                  </select>
                </div>

                <!-- Columna Derecha: Opening Hours (Grid) -->
                <div class="col-md-6">
                  <label class="form-label fw-bold small text-muted d-block">Opening Hours</label>
                  
                  <div class="row g-2">
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Monday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Opening Hour:">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Tuesday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Opening Hour:">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Wednesday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Opening Hour:">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Thursday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Opening Hour:">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Friday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Opening Hour:">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Saturday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Opening Hour:">
                     </div>
                     <div class="col-4">
                        <label class="small text-uppercase fw-bold text-muted" style="font-size: 0.7rem;">Sunday</label>
                        <input type="text" class="form-control form-control-sm" placeholder="Opening Hour:">
                     </div>
                  </div>
                </div>
              </div>

            </form>
          </div>
          <div class="modal-footer border-0 pt-0">
             <button type="button" class="btn btn-link text-decoration-none text-secondary fw-bold" data-bs-dismiss="modal">Cancel</button>
             <button type="button" class="btn btn-primary bg-custom-blue px-4">Add</button>
          </div>
        </div>
      </div>
    </div>

  </MainLayout>
</template>

<script setup>
import MainLayout from "../layouts/MainLayout.vue";
import { ref } from "vue";

const places = ref([
  {
    id: 1,
    created: "7/9/2025",
    placeId: "100",
    placeHash: "QzcyK6e3oQ",
    name: "Casino De Ibiza",
    address: "Paseo Juan Carlos I, ...",
    phone: "+34 971 806 806",
  },
  {
    id: 2,
    created: "28/8/2025",
    placeId: "99",
    placeHash: "tAc3hLdHD-",
    name: "RestaurantLange",
    address: "123 Main St, Springfie...",
    phone: "+34971342661",
  },
  {
    id: 3,
    created: "26/8/2025",
    placeId: "97",
    placeHash: "yigH_9FiCd",
    name: "translation",
    address: "123 Main St, Springfie...",
    phone: "+34971342661",
  },
  {
    id: 4,
    created: "20/8/2025",
    placeId: "96",
    placeHash: "b8lWEdUubM",
    name: "languageresturantprod",
    address: "123 Main St, Springfie...",
    phone: "+34971342661",
  },
  {
    id: 5,
    created: "16/7/2025",
    placeId: "95",
    placeHash: "iOSVTOC9y0",
    name: "test",
    address: "123 Main St, Springfie...",
    phone: "+34971342661",
  },
  {
    id: 6,
    created: "16/7/2025",
    placeId: "94",
    placeHash: "FQINVZ7T0f",
    name: "Club de playa Cala Ba...",
    address: "Cala Bassa,San Jose ...",
    phone: "+34971342661",
  },
  {
    id: 7,
    created: "16/7/2025",
    placeId: "93",
    placeHash: "VPzUEDe5Xv",
    name: "Cala Bassa Beach 2",
    address: "Cala Bassa,San Jose ...",
    phone: "+34971342661",
  },
  {
    id: 8,
    created: "15/7/2025",
    placeId: "92",
    placeHash: "RMO6vINNYw",
    name: "Atzaró Agroturismo H...",
    address: "Diseminado P 12, Sta ...",
    phone: "+34 971 33 88 38",
  },
  {
    id: 9,
    created: "26/6/2025",
    placeId: "91",
    placeHash: "Poi2eSOjH_",
    name: "Zuana Beach Resort",
    address: "Carrera 2 # 6-80 Sant...",
    phone: "+57 323 599 6470",
  },
]);
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
