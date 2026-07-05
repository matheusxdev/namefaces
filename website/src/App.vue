<script setup lang="ts">
import SiteNav from './components/SiteNav.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="page">
    <SiteNav />
    <main>
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.page {
  position: relative;
  z-index: 1;
}
</style>
