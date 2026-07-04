<script setup lang="ts">
import { listKnownNames } from 'namefaces'
import AvatarFace from './AvatarFace.vue'
import Reveal from './Reveal.vue'

const names = listKnownNames()
const first = names.first
const last = names.last

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
          <h2 class="serif">Uma galeria que cresce com os nomes</h2>
          <p class="muted">
            Cada rosto entra com identidade própria. Quanto mais nomes, mais
            gente deixa de ser genérica.
          </p>
        </div>
      </Reveal>

      <div class="grid">
        <Reveal
          v-for="(name, index) in first"
          :key="name"
          :delay="((index % 4) as 0 | 1 | 2 | 3)"
        >
          <article class="card person">
            <div class="pair">
              <AvatarFace
                :name="name"
                :size="88"
                :background="palettes[0].background"
                :hair="palettes[0].hair"
              />
              <AvatarFace
                :name="name"
                :size="88"
                :background="palettes[(index + 1) % palettes.length].background"
                :hair="palettes[(index + 1) % palettes.length].hair"
              />
            </div>
            <h3>{{ name }}</h3>
            <p class="muted">rosto próprio · first</p>
          </article>
        </Reveal>

        <Reveal
          v-for="(name, index) in last"
          :key="`last-${name}`"
          :delay="((index % 4) as 0 | 1 | 2 | 3)"
        >
          <article class="card person">
            <div class="pair">
              <AvatarFace
                :name="`Pessoa ${name}`"
                :size="88"
                mode="last"
                :background="palettes[0].background"
                :hair="palettes[0].hair"
              />
              <AvatarFace
                :name="`Pessoa ${name}`"
                :size="88"
                mode="last"
                :background="palettes[2].background"
                :hair="palettes[2].hair"
              />
            </div>
            <h3>Pessoa {{ name }}</h3>
            <p class="muted">rosto próprio · last</p>
          </article>
        </Reveal>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 620px;
  margin-bottom: 28px;
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
  text-transform: capitalize;
  font-size: 20px;
}

.person p {
  margin: 4px 0 0;
  font-size: 14px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
