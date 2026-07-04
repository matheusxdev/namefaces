<script setup lang="ts">
import { computed, ref } from 'vue'
import { hasAvatar } from 'namefaces'
import AvatarFace from './AvatarFace.vue'
import Reveal from './Reveal.vue'

const name = ref('Yasmin Silva')
const hair = ref('#111111')
const background = ref('#E8E8E8')

const matched = computed(() => hasAvatar(name.value))

const suggestions = ['Yasmin', 'Matheus', 'Ana Costa', 'João Pedro', 'Maria Silva']
</script>

<template>
  <section id="demo" class="section">
    <div class="container panel card">
      <div class="copy">
        <Reveal>
          <span class="eyebrow">Demo interativa</span>
          <h2 class="serif">Digite um nome e veja o rosto nascer</h2>
          <p class="muted">
            Teste em tempo real. Se o nome já tiver identidade própria, o
            namefaces usa esse rosto. Se ainda não, escolhe um estável do pool.
          </p>
        </Reveal>

        <Reveal :delay="1">
          <label class="field">
            <span>Nome</span>
            <input v-model="name" type="text" placeholder="Ex: Yasmin Silva" />
          </label>

          <div class="colors">
            <label>
              <span>Cabelo</span>
              <input v-model="hair" type="color" />
            </label>
            <label>
              <span>Fundo</span>
              <input v-model="background" type="color" />
            </label>
          </div>

          <div class="chips">
            <button
              v-for="item in suggestions"
              :key="item"
              type="button"
              @click="name = item"
            >
              {{ item }}
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal :delay="2">
        <div class="preview">
          <AvatarFace
            :name="name || 'Yasmin'"
            :size="220"
            :hair="hair"
            :background="background"
          />
          <div class="meta">
            <h3 class="serif">{{ name || 'Sem nome' }}</h3>
            <p :class="matched ? 'ok' : 'fallback'">
              {{ matched ? 'Rosto próprio' : 'Fallback estável' }}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
  padding: 36px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.9), #fff),
    var(--bg-soft);
}

.copy h2 {
  margin: 14px 0 12px;
  font-size: clamp(32px, 4vw, 46px);
  max-width: 14ch;
}

.copy > .muted {
  margin: 0 0 24px;
  max-width: 42ch;
  line-height: 1.6;
}

.field,
.colors label {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 600;
}

.field input[type='text'] {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
}

.colors {
  display: flex;
  gap: 16px;
}

.colors input[type='color'] {
  width: 56px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.chips button {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
}

.chips button:hover {
  background: var(--bg);
}

.preview {
  display: grid;
  place-items: center;
  gap: 18px;
  min-height: 100%;
  padding: 28px;
  border-radius: 22px;
  background:
    radial-gradient(circle at top, rgba(91, 79, 224, 0.08), transparent 50%),
    var(--bg-soft);
}

.meta {
  text-align: center;
}

.meta h3 {
  margin: 0;
  font-size: 34px;
}

.meta p {
  margin: 8px 0 0;
  font-weight: 600;
}

.ok {
  color: #0f766e;
}

.fallback {
  color: #9a3412;
}

@media (max-width: 900px) {
  .panel {
    grid-template-columns: 1fr;
    padding: 24px;
  }
}
</style>
