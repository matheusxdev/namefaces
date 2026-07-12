<script setup lang="ts">
import { ref } from 'vue'
import Reveal from './Reveal.vue'

const copied = ref(false)

const install = 'npm install namefaces'
const snippet = `import { getAvatarSvg } from 'namefaces'

// Rosto se existir, senão iniciais
getAvatarSvg('Maria Silva', { size: 64 })

// Só iniciais, com cor e fonte
getAvatarSvg('Lucas Ferreira', {
  kind: 'initials',
  background: '#EDE9FE',
  text: '#4C1D95',
  font: 'brand',
})`

async function copyInstall() {
  await navigator.clipboard.writeText(install)
  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <section id="como-usar" class="section">
    <div class="container layout">
      <Reveal>
        <div class="copy">
          <span class="eyebrow">Leve e simples</span>
          <h2 class="serif">Entra no seu app em segundos</h2>
          <p class="muted">
            Instale, passe o nome e use o SVG ou data URI. Sem rosto no mapa?
            As iniciais entram sozinhas — M, MO, LF e por aí vai.
          </p>

          <div class="install card">
            <code>{{ install }}</code>
            <button type="button" class="btn btn-primary" @click="copyInstall">
              {{ copied ? 'Copiado' : 'Copiar' }}
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal :delay="2">
        <pre class="code card"><code>{{ snippet }}</code></pre>
      </Reveal>
    </div>
  </section>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 28px;
  align-items: center;
}

.copy h2 {
  margin: 14px 0 12px;
  font-size: clamp(32px, 4vw, 46px);
  max-width: 12ch;
}

.copy .muted {
  margin: 0 0 22px;
  max-width: 40ch;
  line-height: 1.6;
}

.install {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 12px 12px 18px;
}

.install code {
  font-size: 14px;
}

.code {
  margin: 0;
  padding: 24px;
  overflow: auto;
  background: #171717;
  color: #f5f5f5;
  line-height: 1.6;
  font-size: 14px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .install {
    flex-direction: column;
    align-items: stretch;
  }

  .copy h2 {
    max-width: none;
  }
}

@media (max-width: 540px) {
  .code {
    padding: 16px;
    font-size: 12px;
  }

  .install code {
    font-size: 13px;
    word-break: break-all;
  }
}
</style>
