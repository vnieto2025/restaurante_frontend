<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-light py-3 px-4 border-bottom"
  >
    <div class="d-flex align-items-center">
      <i
        class="fas fa-align-left primary-text fs-4 me-3"
        id="menu-toggle"
        @click="$emit('toggle-sidebar')"
      ></i>
      <h2 class="fs-5 m-0 text-secondary">
        Application / <span class="text-dark fw-bold">{{ pageTitle }}</span>
      </h2>
    </div>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
        <li class="nav-item">
          <div class="input-group me-3">
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              aria-label="Search"
            />
            <button class="btn btn-outline-secondary" type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle text-dark fw-bold"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fas fa-user me-2"></i>{{ username || "User" }}
          </a>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><a class="dropdown-item" href="#">Settings</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a class="dropdown-item" href="#" @click="logout">Logout</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const username = ref("");

// Simple logic to determine page title from route name
const pageTitle = computed(() => {
    if (route.name) {
        return route.name.charAt(0).toUpperCase() + route.name.slice(1);
    }
    return "Dashboard";
});

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  router.push("/");
};

onMounted(() => {
  const storedUsername = localStorage.getItem("username");
  if (storedUsername && storedUsername !== "undefined" && storedUsername !== "null") {
    username.value = storedUsername;
  }
});
</script>

<style scoped>
#menu-toggle {
  cursor: pointer;
}
.primary-text {
  color: #1a237e;
}
</style>
