<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)

const isCatalog = computed(() => route.name === 'catalog')

function onScroll() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="nav" :class="{ scrolled }">
    <div class="container nav-inner">
      <RouterLink to="/" class="logo">namefaces</RouterLink>

      <nav class="links">
        <RouterLink to="/#recursos">Recursos</RouterLink>
        <RouterLink to="/#demo">Demo</RouterLink>
        <RouterLink to="/#como-usar">Como usar</RouterLink>
        <RouterLink to="/rostos" :class="{ active: isCatalog }">Rostos</RouterLink>
      </nav>

      <div class="actions">
        <a
          class="btn btn-secondary nav-btn"
          href="https://github.com/matheusxdev/namefaces"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <RouterLink class="btn btn-primary nav-btn" to="/#como-usar">
          Começar
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(14px);
  background: rgba(247, 244, 238, 0.72);
  border-bottom: 1px solid transparent;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.nav.scrolled {
  background: rgba(255, 255, 255, 0.84);
  border-bottom-color: var(--line);
  box-shadow: 0 8px 24px rgba(23, 23, 23, 0.04);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 72px;
}

.logo {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 700;
}

.links {
  display: flex;
  gap: 22px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}

.links a:hover,
.links a.active {
  color: var(--ink);
}

.actions {
  display: flex;
  gap: 10px;
}

.nav-btn {
  min-height: 40px;
  padding: 0 14px;
  font-size: 14px;
}

@media (max-width: 860px) {
  .links {
    display: none;
  }
}
</style>
