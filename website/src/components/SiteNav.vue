<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)

const isCatalog = computed(() => route.name === 'catalog')

const navLinks = [
  { to: '/#recursos', label: 'Recursos' },
  { to: '/#demo', label: 'Demo' },
  { to: '/#docs', label: 'Docs' },
  { to: '/#como-usar', label: 'Como usar' },
  { to: '/rostos', label: 'Rostos', catalog: true },
]

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="nav" :class="{ scrolled }">
    <div class="container nav-inner">
      <RouterLink to="/" class="logo" @click="closeMenu">namefaces</RouterLink>

      <nav class="links" aria-label="Principal">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="{ active: link.catalog && isCatalog }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="actions">
        <a
          class="btn btn-secondary nav-btn hide-xs"
          href="https://github.com/matheusxdev/namefaces"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <RouterLink class="btn btn-primary nav-btn hide-xs" to="/#como-usar">
          Começar
        </RouterLink>

        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          aria-label="Abrir menu"
          @click="toggleMenu"
        >
          <span class="bar" />
          <span class="bar" />
          <span class="bar" />
        </button>
      </div>
    </div>

    <Transition name="menu">
      <div
        v-if="menuOpen"
        id="mobile-menu"
        class="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div class="mobile-backdrop" @click="closeMenu" />
        <div class="mobile-panel">
          <nav class="mobile-links">
            <RouterLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              :class="{ active: link.catalog && isCatalog }"
              @click="closeMenu"
            >
              {{ link.label }}
            </RouterLink>
          </nav>

          <div class="mobile-actions">
            <a
              class="btn btn-secondary"
              href="https://github.com/matheusxdev/namefaces"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <RouterLink class="btn btn-primary" to="/#como-usar" @click="closeMenu">
              Começar
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
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
  gap: 16px;
  min-height: 72px;
}

.logo {
  font-family: var(--font-serif);
  font-size: clamp(20px, 4vw, 24px);
  font-weight: 700;
  flex-shrink: 0;
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
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.nav-btn {
  min-height: 40px;
  padding: 0 14px;
  font-size: 14px;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.bar {
  display: block;
  width: 18px;
  height: 2px;
  margin: 0 auto;
  border-radius: 2px;
  background: var(--ink);
  transition: transform 0.2s ease;
}

.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 50;
}

.mobile-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(23, 23, 23, 0.35);
}

.mobile-panel {
  position: absolute;
  top: 0;
  right: 0;
  display: grid;
  gap: 24px;
  width: min(320px, 100%);
  height: 100%;
  padding: 88px var(--gutter) var(--gutter);
  background: var(--surface);
  box-shadow: -12px 0 40px rgba(23, 23, 23, 0.12);
  overflow-y: auto;
}

.mobile-links {
  display: grid;
  gap: 4px;
}

.mobile-links a {
  padding: 14px 12px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}

.mobile-links a:hover,
.mobile-links a.active {
  background: var(--bg-soft);
}

.mobile-actions {
  display: grid;
  gap: 10px;
}

.mobile-actions .btn {
  width: 100%;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;
}

.menu-enter-active .mobile-panel,
.menu-leave-active .mobile-panel {
  transition: transform 0.25s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-from .mobile-panel,
.menu-leave-to .mobile-panel {
  transform: translateX(100%);
}

@media (max-width: 860px) {
  .links {
    display: none;
  }

  .hide-xs {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-inner {
    min-height: 64px;
  }
}
</style>
