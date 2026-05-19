<template>
  <div class="bg-custom-sidebar" id="sidebar-wrapper">
    <div
      class="sidebar-heading text-center py-4 primary-text fs-4 fw-bold text-white border-bottom border-secondary"
    >
      <i class="fas fa-utensils me-2"></i>Restaurante
    </div>

    <div class="list-group list-group-flush my-3">
      <router-link
        to="/dashboard"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-home me-2"></i>Dashboard
      </router-link>
      <router-link
        to="/places"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-map-marker-alt me-2"></i>Places
      </router-link>
      <router-link
        to="/customers"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-users me-2"></i>Customers
      </router-link>
      <router-link
        to="/orders"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-clipboard-list me-2"></i>Orders
      </router-link>
      <router-link
        to="/menus"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-book-open me-2"></i>Menus
      </router-link>
      <router-link
        to="/ingredients"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-carrot me-2"></i>Ingredients
      </router-link>
      <router-link
        to="/recipes"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-utensil-spoon me-2"></i>Recipes
      </router-link>
      <router-link
        to="/subscriptions"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-bell me-2"></i>Subscriptions
      </router-link>
      <router-link
        to="/reports"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-chart-bar me-2"></i>Reports
      </router-link>
      <router-link
        to="/locations"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-location-arrow me-2"></i>Locations
      </router-link>
      <router-link
        to="/venues"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-store me-2"></i>Venues
      </router-link>
      <router-link
        to="/roles"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white"
        active-class="active text-white"
      >
        <i class="fas fa-user-shield me-2"></i>Role Management
      </router-link>
      <router-link
        to="/settings"
        class="list-group-item list-group-item-action bg-transparent text-white-50 hover-text-white mt-auto"
        active-class="active text-white"
      >
        <i class="fas fa-cog me-2"></i>Settings
      </router-link>
      <a
        href="#"
        @click.prevent="logout"
        class="list-group-item list-group-item-action bg-transparent text-danger fw-bold mt-2 border-top border-secondary"
      >
        <i class="fas fa-sign-out-alt me-2"></i>Logout
      </a>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const router   = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<style scoped>
#sidebar-wrapper {
  min-height: 100vh;
  margin-left: -15rem;
  -webkit-transition: margin 0.25s ease-out;
  -moz-transition: margin 0.25s ease-out;
  -o-transition: margin 0.25s ease-out;
  transition: margin 0.25s ease-out;
  background-color: #1a237e; /* Deep Blue */
  width: 15rem;
  flex-shrink: 0;
}

#sidebar-wrapper .sidebar-heading {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
}

#sidebar-wrapper .list-group {
  width: 15rem;
}

.list-group-item {
  border: none;
  padding: 20px 30px;
  font-size: 15px;
  text-decoration: none; /* Ensure links don't have underlines */
}

/* Base style for non-active items */
.list-group-item.text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* Hover effect */
.hover-text-white:hover {
  color: #fff !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Active state - handled by router-link-active or explicit class */
.list-group-item.active {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-right: 4px solid #ffffff;
  color: #fff !important;
  font-weight: bold;
}

.bg-custom-sidebar {
  background-color: #1a237e;
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    margin-left: 0;
  }
}
</style>
