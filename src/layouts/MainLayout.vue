<template>
  <div class="d-flex" :class="{ toggled: isToggled }" id="wrapper">
    <Sidebar />
    <div id="page-content-wrapper">
      <Header @toggle-sidebar="toggleSidebar" />
      <div class="container-fluid px-4 py-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "./Sidebar.vue";
import Header from "./Header.vue";

const isToggled = ref(false);

const toggleSidebar = () => {
  isToggled.value = !isToggled.value;
};
</script>

<style>
:root {
  --main-bg-color: #fce4ec;
  --sidebar-color: #1a237e;
  --second-text-color: #b0bec5;
  --menu-text-color: #ffffff;
}

#wrapper {
  overflow-x: hidden;
  background-color: #f5f6fa;
  min-height: 100vh;
}

#page-content-wrapper {
  min-width: 100vw;
  flex-grow: 1;
}

#wrapper.toggled #sidebar-wrapper {
  margin-left: -15rem; /* When toggled off on desktop, or toggled on? logic reversed in CSS usually */
}

/* 
   Original CSS Logic:
   Desktop: margin-left: 0 (default).
   Mobile: margin-left: -15rem (default).
   
   If toggled:
   Desktop: margin-left: -15rem.
   Mobile: margin-left: 0.
*/

@media (min-width: 768px) {
  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }
  
  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem;
  }
}

@media (max-width: 768px) {
   /* Adjust if necessary, but standard sidebar template expects this */
    #sidebar-wrapper {
        margin-left: -15rem;
    }
    #wrapper.toggled #sidebar-wrapper {
        margin-left: 0;
    }
}
</style>
