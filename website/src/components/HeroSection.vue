<script setup lang="ts">
import AvatarFace from './AvatarFace.vue'
import Reveal from './Reveal.vue'

const faces = [
  { name: 'Yasmin', hair: '#111111' },
  { name: 'Matheus', hair: '#4C1D95' },
  { name: 'Ana', hair: '#0F766E' },
  { name: 'João', hair: '#1D4ED8' },
  { name: 'Maria', hair: '#9F1239' },
]
</script>

<template>
  <section id="topo" class="hero section">
    <div class="container hero-grid">
      <Reveal>
        <div class="copy">
          <span class="eyebrow">Identidade por nome</span>
          <h1 class="serif title">
            Cada nome ganha um
            <span class="highlight">rosto próprio</span>
          </h1>
          <p class="lead muted">
            Pare de usar o mesmo ícone genérico para todo mundo. O namefaces
            transforma nomes em avatars únicos — perfeito para clientes,
            usuários e equipes.
          </p>

          <div class="cta-row">
            <a class="btn btn-primary" href="#demo">Ver ao vivo</a>
            <a class="btn btn-secondary" href="#como-usar">Instalar agora</a>
          </div>

          <div class="trust">
            <div class="stack">
              <AvatarFace
                v-for="face in faces"
                :key="face.name"
                :name="face.name"
                :size="36"
                :hair="face.hair"
                background="#F3F0EA"
              />
            </div>
            <p class="muted">
              Mesmo nome, mesmo rosto. Em qualquer listagem do seu app.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal :delay="2">
        <div class="showcase card">
          <div class="showcase-top">
            <AvatarFace name="Yasmin" :size="168" />
            <div>
              <p class="label muted">Perfil</p>
              <h2 class="serif">Yasmin</h2>
              <p class="muted">Cliente · identidade própria</p>
            </div>
          </div>

          <div class="mini-grid">
            <div v-for="face in faces" :key="face.name" class="mini">
              <AvatarFace
                :name="face.name"
                :size="56"
                :hair="face.hair"
                background="#F7F4EE"
              />
              <span>{{ face.name }}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: 48px;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: center;
}

.title {
  margin: 18px 0 16px;
  font-size: clamp(42px, 6vw, 72px);
  max-width: 12ch;
}

.highlight {
  color: var(--accent);
  background: linear-gradient(180deg, transparent 62%, var(--accent-soft) 62%);
}

.lead {
  margin: 0;
  max-width: 46ch;
  font-size: 18px;
  line-height: 1.6;
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.trust {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
}

.stack {
  display: flex;
}

.stack :deep(.avatar-face) {
  margin-left: -10px;
  border: 2px solid #fff;
}

.stack :deep(.avatar-face:first-child) {
  margin-left: 0;
}

.trust p {
  margin: 0;
  font-size: 14px;
  max-width: 28ch;
}

.showcase {
  padding: 28px;
}

.showcase-top {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.label {
  margin: 0 0 4px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.showcase-top h2 {
  margin: 0;
  font-size: 36px;
}

.showcase-top p:last-child {
  margin: 6px 0 0;
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.mini {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 16px;
  background: var(--bg-soft);
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .title {
    max-width: none;
  }

  .mini-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
