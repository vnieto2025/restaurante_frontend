<template>
  <MainLayout>
    <h3 class="fw-bold mb-4">Reports</h3>

    <div class="d-flex justify-content-end mb-4">
      <button class="btn btn-primary bg-custom-blue" @click="reportsStore.fetchSummary()" :disabled="reportsStore.isLoading">
        <span v-if="reportsStore.isLoading" class="spinner-border spinner-border-sm me-1"></span>
        Refresh
      </button>
    </div>

    <div v-if="reportsStore.isLoading && !reportsStore.summary" class="text-center p-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <template v-else-if="reportsStore.summary">
      <!-- Stat Cards -->
      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm text-center py-4">
            <div class="display-6 fw-bold text-primary">{{ reportsStore.summary.total_places }}</div>
            <div class="text-muted mt-1">Restaurants</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm text-center py-4">
            <div class="display-6 fw-bold text-success">{{ reportsStore.summary.total_customers }}</div>
            <div class="text-muted mt-1">Customers</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm text-center py-4">
            <div class="display-6 fw-bold text-warning">{{ reportsStore.summary.total_orders }}</div>
            <div class="text-muted mt-1">Orders</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm text-center py-4">
            <div class="display-6 fw-bold text-danger">${{ Number(reportsStore.summary.total_revenue).toFixed(2) }}</div>
            <div class="text-muted mt-1">Revenue</div>
          </div>
        </div>
      </div>

      <!-- Orders by Status -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white fw-bold">Orders by Status</div>
        <div class="card-body d-flex flex-wrap gap-3">
          <div v-for="s in reportsStore.summary.orders_by_status" :key="s.status" class="d-flex align-items-center gap-2">
            <span class="badge bg-secondary fs-6">{{ s.status }}</span>
            <span class="fw-bold">{{ s.count }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white fw-bold">Recent Orders (last 10)</div>
        <div class="card-body p-0">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr><th>Order #</th><th>Customer</th><th>Place</th><th>Total</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              <tr v-for="o in reportsStore.summary.recent_orders" :key="o.id">
                <td>{{ o.order_number }}</td>
                <td>{{ o.customer || '—' }}</td>
                <td>{{ o.place || '—' }}</td>
                <td>${{ Number(o.total_amount).toFixed(2) }}</td>
                <td><span class="badge bg-secondary">{{ o.status }}</span></td>
                <td>{{ o.created_at ? o.created_at.slice(0,10) : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <div v-else class="text-center text-muted py-5">Click Refresh to load the report.</div>
  </MainLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import MainLayout from '../layouts/MainLayout.vue'
import { useReportsStore } from '../stores/reports.js'

const reportsStore = useReportsStore()
onMounted(() => reportsStore.fetchSummary())
</script>
