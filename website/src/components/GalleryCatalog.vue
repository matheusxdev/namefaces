<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AvatarMode } from 'namefaces'
import {
  countByMode,
  filterEntries,
  getGalleryEntries,
  sortEntries,
  type GallerySort,
} from '../data/galleryEntries'
import AvatarFace from './AvatarFace.vue'

const query = ref('')
const modeFilter = ref<AvatarMode | 'all'>('all')
const sort = ref<GallerySort>('az')

const allEntries = getGalleryEntries()
const counts = countByMode(allEntries)

const filtered = computed(() => {
  const matched = filterEntries(allEntries, query.value, modeFilter.value)
  return sortEntries(matched, sort.value)
})

const modeTabs: { value: AvatarMode | 'all'; label: string; count: number }[] =
  [
    { value: 'all', label: 'Todos', count: counts.all },
    { value: 'first', label: 'Primeiro nome', count: counts.first },
    { value: 'last', label: 'Sobrenome', count: counts.last },
    { value: 'full', label: 'Nome completo', count: counts.full },
  ]
</script>

<template>
  <div class="catalog">
    <p class="summary muted">
      {{ counts.all }} identidades no namefaces
      <span v-if="filtered.length !== counts.all">
        · mostrando {{ filtered.length }}
      </span>
    </p>

    <div class="toolbar">
      <label class="search">
        <span class="sr-only">Buscar por nome</span>
        <input
          v-model="query"
          type="search"
          placeholder="Buscar por nome..."
          autocomplete="off"
          spellcheck="false"
        />
      </label>

      <label class="sort">
        <span>Ordenar</span>
        <select v-model="sort">
          <option value="az">Alfabética (A–Z)</option>
          <option value="za">Alfabética (Z–A)</option>
          <option value="type">Por tipo</option>
        </select>
      </label>
    </div>

    <div class="filters" role="tablist" aria-label="Filtrar por tipo">
      <button
        v-for="tab in modeTabs"
        :key="tab.value"
        type="button"
        role="tab"
        :aria-selected="modeFilter === tab.value"
        :class="{ active: modeFilter === tab.value }"
        @click="modeFilter = tab.value"
      >
        {{ tab.label }}
        <span class="count">{{ tab.count }}</span>
      </button>
    </div>

    <div v-if="filtered.length" class="grid">
      <article
        v-for="(entry, index) in filtered"
        :key="entry.id"
        class="item card"
      >
        <AvatarFace
          :name="entry.displayName"
          :size="88"
          :mode="entry.mode"
          background="#E8E8E8"
          hair="#111111"
        />
        <div class="meta">
          <h2>{{ entry.displayName }}</h2>
          <p class="muted">{{ entry.typeLabel }}</p>
        </div>
        <span class="index">{{ String(index + 1).padStart(2, '0') }}</span>
      </article>
    </div>

    <div v-else class="empty">
      <h3 class="serif">Nenhum rosto encontrado</h3>
      <p class="muted">
        Tente outro termo ou limpe os filtros para ver todo o catálogo.
      </p>
      <button
        type="button"
        class="btn btn-secondary"
        @click="
          query = '';
          modeFilter = 'all';
        "
      >
        Limpar busca
      </button>
    </div>
  </div>
</template>

<style scoped>
.catalog {
  display: grid;
  gap: 18px;
}

.summary {
  margin: 0;
  font-size: 15px;
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 12px;
}

.search input,
.sort select {
  width: 100%;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
}

.search input:focus,
.sort select:focus {
  outline: none;
  border-color: rgba(91, 79, 224, 0.45);
  box-shadow: 0 0 0 4px rgba(91, 79, 224, 0.1);
}

.sort {
  display: grid;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filters button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.filters button.active {
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}

.count {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(23, 23, 23, 0.08);
  font-size: 11px;
}

.filters button.active .count {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.item {
  position: relative;
  display: grid;
  gap: 12px;
  padding: 18px;
}

.meta h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.meta p {
  margin: 4px 0 0;
  font-size: 14px;
}

.index {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.empty {
  display: grid;
  justify-items: start;
  gap: 10px;
  padding: 36px 0 12px;
}

.empty h3 {
  margin: 0;
  font-size: 28px;
}

.empty p {
  margin: 0 0 8px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 900px) {
  .toolbar {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    margin: 0 calc(var(--gutter) * -1);
    padding-left: var(--gutter);
    padding-right: var(--gutter);
  }

  .filters button {
    flex-shrink: 0;
  }
}
</style>
