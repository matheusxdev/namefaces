<script setup lang="ts">
import { computed } from 'vue'
import { getGalleryEntries } from '../data/galleryEntries'
import AvatarFace from './AvatarFace.vue'
import Reveal from './Reveal.vue'

const entries = getGalleryEntries()
const preview = computed(() => entries.slice(0, 6))

const palettes = [
  { background: '#E8E8E8', hair: '#111111' },
  { background: '#EDE9FE', hair: '#4C1D95' },
  { background: '#DBEAFE', hair: '#1D4ED8' },
  { background: '#DCFCE7', hair: '#166534' },
  { background: '#FFE4E6', hair: '#9F1239' },
]
</script>

<template>
  <section id="rostos" class="section">
    <div class="container">
      <Reveal>
        <div class="head">
          <div class="copy">
            <h2 class="serif">Uma galeria que cresce com os nomes</h2>
            <p class="muted">
              Cada rosto entra com identidade própria. Quanto mais nomes, mais
              gente deixa de ser genérica.
            </p>
          </div>

          <RouterLink to="/rostos" class="btn btn-secondary">
            Ver todos
          </RouterLink>
        </div>
      </Reveal>

      <div class="grid">
        <Reveal
          v-for="(entry, index) in preview"
          :key="entry.id"
          :delay="((index % 4) as 0 | 1 | 2 | 3)"
        >
          <article class="card person">
            <div class="pair">
              <AvatarFace
                :name="entry.displayName"
                :size="88"
                :mode="entry.mode"
                :background="palettes[0].background"
                :hair="palettes[0].hair"
              />
              <AvatarFace
                :name="entry.displayName"
                :size="88"
                :mode="entry.mode"
                :background="palettes[(index + 1) % palettes.length].background"
                :hair="palettes[(index + 1) % palettes.length].hair"
              />
            </div>
            <h3>{{ entry.displayName }}</h3>
            <p class="muted">rosto próprio · {{ entry.mode }}</p>
          </article>
        </Reveal>
      </div>

      <Reveal v-if="entries.length > preview.length" :delay="2">
        <div class="more">
          <p class="muted">
            Prévia de {{ preview.length }} de {{ entries.length }} rostos
          </p>
          <RouterLink to="/rostos" class="btn btn-primary">
            Abrir catálogo completo
          </RouterLink>
        </div>
      </Reveal>
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.copy {
  max-width: 620px;
}

.head h2 {
  margin: 0 0 12px;
  font-size: clamp(32px, 4vw, 46px);
}

.head p {
  margin: 0;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.person {
  padding: 20px;
}

.pair {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.person h3 {
  margin: 0;
  font-size: 20px;
}

.person p {
  margin: 4px 0 0;
  font-size: 14px;
}

.more {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.more p {
  margin: 0;
}

@media (max-width: 900px) {
  .head {
    flex-direction: column;
    align-items: start;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .more {
    flex-direction: column;
    align-items: start;
  }
}
</style>
