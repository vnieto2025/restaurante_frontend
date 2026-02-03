<template>
  <MainLayout>
    <!-- Stats Cards -->
    <div class="row g-3 my-2">
      <div class="col-md-3">
        <div
          class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card"
        >
          <div>
            <h3 class="fs-2">720</h3>
            <p class="fs-5 text-secondary">Orders</p>
          </div>
          <i
            class="fas fa-shopping-cart fs-1 primary-text border rounded-full secondary-bg p-3"
          ></i>
        </div>
      </div>

      <div class="col-md-3">
        <div
          class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card"
        >
          <div>
            <h3 class="fs-2">4920</h3>
            <p class="fs-5 text-secondary">Revenue</p>
          </div>
          <i
            class="fas fa-hand-holding-usd fs-1 text-success border rounded-full success-bg p-3"
          ></i>
        </div>
      </div>

      <div class="col-md-3">
        <div
          class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card"
        >
          <div>
            <h3 class="fs-2">389</h3>
            <p class="fs-5 text-secondary">Customers</p>
          </div>
          <i
            class="fas fa-users fs-1 text-warning border rounded-full warning-bg p-3"
          ></i>
        </div>
      </div>

      <div class="col-md-3">
        <div
          class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card"
        >
          <div>
            <h3 class="fs-2">%25</h3>
            <p class="fs-5 text-secondary">Growth</p>
          </div>
          <i
            class="fas fa-chart-line fs-1 text-danger border rounded-full danger-bg p-3"
          ></i>
        </div>
      </div>
    </div>

    <div class="row my-5">
      <h3 class="fs-4 mb-3">Recent Orders</h3>
      <div class="col">
        <div class="table-responsive shadow-sm rounded">
          <table class="table table-hover bg-white rounded mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">#1234</th>
                <td>Juan Perez</td>
                <td>Pizza Margherita</td>
                <td>$12.00</td>
                <td><span class="badge bg-success">Completed</span></td>
              </tr>
              <tr>
                <th scope="row">#1235</th>
                <td>Maria Garcia</td>
                <td>Burger Menu</td>
                <td>$15.50</td>
                <td>
                  <span class="badge bg-warning text-dark">Pending</span>
                </td>
              </tr>
              <tr>
                <th scope="row">#1236</th>
                <td>Carlos Ruiz</td>
                <td>Pasta Carbonara</td>
                <td>$14.00</td>
                <td>
                  <span class="badge bg-info text-dark">Processing</span>
                </td>
              </tr>
              <tr>
                <th scope="row">#1237</th>
                <td>Ana Lopez</td>
                <td>Salad Bowl</td>
                <td>$9.50</td>
                <td><span class="badge bg-danger">Cancelled</span></td>
              </tr>
              <tr>
                <th scope="row">#1238</th>
                <td>John Doe</td>
                <td>Tacos x3</td>
                <td>$11.00</td>
                <td><span class="badge bg-success">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from "../layouts/MainLayout.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const token = ref("");

onMounted(() => {
  token.value = localStorage.getItem("token");
  if (!token.value) {
    router.push("/");
  }
});
</script>

<style scoped>
/* Colors for Stats Cards (if not global) */
.primary-text {
  color: #1a237e;
}
.secondary-bg {
  background-color: #e8eaf6;
}
.success-bg {
  background-color: #e8f5e9;
}
.warning-bg {
  background-color: #fff3e0;
}
.danger-bg {
  background-color: #ffebee;
}

.highlight-card {
  transition: transform 0.2s;
}
.highlight-card:hover {
  transform: translateY(-5px);
}
</style>
