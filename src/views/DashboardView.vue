<template>
  <MainLayout>
    <!-- Stats Cards -->
    <div class="row g-3 my-2">
      <div class="col-md-3">
        <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card">
          <div>
            <h3 class="fs-2">{{ summary?.total_orders ?? '—' }}</h3>
            <p class="fs-5 text-secondary">Orders</p>
          </div>
          <i class="fas fa-shopping-cart fs-1 primary-text border rounded-full secondary-bg p-3"></i>
        </div>
      </div>

      <div class="col-md-3">
        <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card">
          <div>
            <h3 class="fs-2">${{ summary ? Number(summary.total_revenue).toFixed(2) : '—' }}</h3>
            <p class="fs-5 text-secondary">Revenue</p>
          </div>
          <i class="fas fa-hand-holding-usd fs-1 text-success border rounded-full success-bg p-3"></i>
        </div>
      </div>

      <div class="col-md-3">
        <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card">
          <div>
            <h3 class="fs-2">{{ summary?.total_customers ?? '—' }}</h3>
            <p class="fs-5 text-secondary">Customers</p>
          </div>
          <i class="fas fa-users fs-1 text-warning border rounded-full warning-bg p-3"></i>
        </div>
      </div>

      <div class="col-md-3">
        <div class="p-3 bg-white shadow-sm d-flex justify-content-around align-items-center rounded highlight-card">
          <div>
            <h3 class="fs-2">{{ summary?.total_places ?? '—' }}</h3>
            <p class="fs-5 text-secondary">Places</p>
          </div>
          <i class="fas fa-store fs-1 text-danger border rounded-full danger-bg p-3"></i>
        </div>
      </div>
    </div>

    <!-- Orders by Status -->
    <div class="row g-3 my-2" v-if="summary?.orders_by_status?.length">
      <div class="col-12">
        <div class="bg-white shadow-sm rounded p-3 d-flex flex-wrap gap-3 align-items-center">
          <span class="fw-semibold text-secondary me-2">Orders by status:</span>
          <span
            v-for="item in summary.orders_by_status"
            :key="item.status"
            :class="['badge fs-6', statusBadge(item.status)]"
          >
            {{ item.status }}: {{ item.count }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div class="row my-4">
      <div class="col-12 d-flex justify-content-between align-items-center mb-3">
        <h3 class="fs-4 m-0">Recent Orders</h3>
        <span v-if="reportsStore.isLoading" class="spinner-border spinner-border-sm text-primary"></span>
      </div>
      <div class="col">
        <div class="table-responsive shadow-sm rounded">
          <table class="table table-hover bg-white rounded mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Order No.</th>
                <th scope="col">Customer</th>
                <th scope="col">Place</th>
                <th scope="col">Total</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!summary?.recent_orders?.length">
                <td colspan="7" class="text-center text-muted py-4">No orders found.</td>
              </tr>
              <tr v-for="(order, index) in summary?.recent_orders" :key="order.id">
                <td>{{ index + 1 }}</td>
                <td class="fw-semibold">{{ order.order_number }}</td>
                <td>{{ order.customer || '—' }}</td>
                <td>{{ order.place || '—' }}</td>
                <td>${{ Number(order.total_amount).toFixed(2) }}</td>
                <td>{{ order.created_at ? new Date(order.created_at).toLocaleDateString() : '—' }}</td>
                <td><span :class="['badge', statusBadge(order.status)]">{{ order.status }}</span></td>
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
import { onMounted, computed } from "vue";
import { useReportsStore } from "../stores/reports.js";

const reportsStore = useReportsStore();
const summary = computed(() => reportsStore.summary);

const statusBadge = (status) => {
  const map = {
    completed: 'bg-success',
    pending:   'bg-warning text-dark',
    processing: 'bg-info text-dark',
    cancelled:  'bg-danger',
    active:     'bg-success',
  };
  return map[status?.toLowerCase()] ?? 'bg-secondary';
};

onMounted(() => {
  reportsStore.fetchSummary();
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
