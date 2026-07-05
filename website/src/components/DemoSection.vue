<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getAvatar, type AvatarKind, type AvatarMode } from 'namefaces'
import AvatarFace from './AvatarFace.vue'
import Reveal from './Reveal.vue'

const name = ref('Yasmin Silva')
const mode = ref<AvatarMode>('auto')
const kind = ref<AvatarKind>('auto')
const hair = ref('#111111')
const background = ref('#E8E8E8')
const skin = ref('#FFFFFF')
const features = ref('#111111')
const text = ref('#111111')
const font = ref<'brand' | 'sans' | 'rounded'>('brand')
const activeTheme = ref('neutral')

const modes: { value: AvatarMode; label: string; hint: string }[] = [
  { value: 'auto', label: 'Auto', hint: 'Primeiro → sobrenome → iniciais' },
  { value: 'first', label: 'Primeiro', hint: 'Só o primeiro nome' },
  { value: 'last', label: 'Sobrenome', hint: 'Só o sobrenome' },
  { value: 'full', label: 'Completo', hint: 'Nome inteiro' },
]

const kinds: { value: AvatarKind; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'face', label: 'Rosto' },
  { value: 'initials', label: 'Iniciais' },
]

const themes = [
  {
    id: 'neutral',
    label: 'Neutro',
    background: '#E8E8E8',
    hair: '#111111',
    skin: '#FFFFFF',
    features: '#111111',
  },
  {
    id: 'violet',
    label: 'Violeta',
    background: '#EDE9FE',
    hair: '#4C1D95',
    skin: '#FFFFFF',
    features: '#111111',
  },
  {
    id: 'ocean',
    label: 'Oceano',
    background: '#DBEAFE',
    hair: '#1D4ED8',
    skin: '#FFFFFF',
    features: '#111111',
  },
  {
    id: 'forest',
    label: 'Verde',
    background: '#DCFCE7',
    hair: '#166534',
    skin: '#FFFFFF',
    features: '#111111',
  },
  {
    id: 'rose',
    label: 'Rosa',
    background: '#FFE4E6',
    hair: '#9F1239',
    skin: '#FFFFFF',
    features: '#111111',
  },
]

const colorFields = computed(() => {
  const base = [
    { key: 'background' as const, label: 'Fundo' },
  ]

  if (result.value.render === 'initials' || kind.value === 'initials') {
    return [
      ...base,
      { key: 'text' as const, label: 'Texto' },
    ]
  }

  return [
    ...base,
    { key: 'hair' as const, label: 'Cabelo' },
    { key: 'skin' as const, label: 'Pele' },
    { key: 'features' as const, label: 'Traços' },
  ]
})

const fonts = [
  { value: 'brand' as const, label: 'Brand' },
  { value: 'sans' as const, label: 'Sans' },
  { value: 'rounded' as const, label: 'Rounded' },
]

const suggestions = [
  { label: 'Yasmin', value: 'Yasmin' },
  { label: 'Maria Silva', value: 'Maria Silva' },
  { label: 'João Pedro', value: 'João Pedro' },
  { label: 'Ana Costa', value: 'Ana Costa' },
  { label: 'Lucas', value: 'Lucas' },
]

const colors = computed(() => ({
  background: background.value,
  hair: hair.value,
  skin: skin.value,
  features: features.value,
  text: text.value,
}))

const result = computed(() =>
  getAvatar(name.value || 'Yasmin', {
    mode: mode.value,
    kind: kind.value,
    font: font.value,
    ...colors.value,
  }),
)

const modeHint = computed(
  () => modes.find((item) => item.value === mode.value)?.hint ?? '',
)

const statusLabel = computed(() => {
  if (result.value.render === 'initials') {
    return result.value.matched ? 'Iniciais (rosto disponível)' : 'Iniciais'
  }
  if (result.value.render === 'pool') {
    return 'Fallback pool'
  }
  return 'Rosto próprio'
})

const statusDetail = computed(() => {
  if (result.value.render === 'initials') {
    return `Iniciais · ${result.value.initials} · fonte ${font.value}`
  }
  if (result.value.render === 'pool') {
    return `Pool · ${result.value.id} · seed "${result.value.key}"`
  }
  return `Identidade · ${result.value.mode} · ${result.value.id}`
})

const codeSnippet = computed(() => {
  const options: string[] = [`mode: '${mode.value}'`]

  if (kind.value !== 'auto') {
    options.push(`kind: '${kind.value}'`)
  }
  if (font.value !== 'brand' && (kind.value === 'initials' || result.value.render === 'initials')) {
    options.push(`font: '${font.value}'`)
  }

  if (background.value !== '#E8E8E8') {
    options.push(`background: '${background.value}'`)
  }
  if (hair.value !== '#111111' && result.value.render === 'face') {
    options.push(`hair: '${hair.value}'`)
  }
  if (skin.value !== '#FFFFFF' && result.value.render === 'face') {
    options.push(`skin: '${skin.value}'`)
  }
  if (text.value !== '#111111' && (kind.value === 'initials' || result.value.render === 'initials')) {
    options.push(`text: '${text.value}'`)
  }
  if (features.value !== '#111111' && result.value.render === 'face') {
    options.push(`features: '${features.value}'`)
  }

  const safeName = (name.value || 'Yasmin').replace(/'/g, "\\'")
  return `getAvatarSvg('${safeName}', {\n  ${options.join(',\n  ')}\n})`
})

function applyTheme(themeId: string) {
  const theme = themes.find((item) => item.id === themeId)
  if (!theme) return

  activeTheme.value = themeId
  background.value = theme.background
  hair.value = theme.hair
  skin.value = theme.skin
  features.value = theme.features
}

function pickSuggestion(value: string) {
  name.value = value
}

function isSuggestionActive(value: string) {
  return name.value.trim().toLowerCase() === value.toLowerCase()
}

function suggestionMatched(value: string) {
  return getAvatar(value, { mode: mode.value }).matched
}

watch([hair, background, skin, features], () => {
  const match = themes.find(
    (theme) =>
      theme.background === background.value &&
      theme.hair === hair.value &&
      theme.skin === skin.value &&
      theme.features === features.value,
  )
  activeTheme.value = match?.id ?? 'custom'
})
</script>

<template>
  <section id="demo" class="section">
    <div class="container panel card">
      <div class="copy">
        <Reveal>
          <span class="eyebrow">Demo interativa</span>
          <h2 class="serif">Digite um nome e veja o rosto nascer</h2>
          <p class="muted">
            Teste rostos e iniciais em tempo real. Troque tipo, modo, paleta,
            fonte e veja o snippet gerado.
          </p>
        </Reveal>

        <Reveal :delay="1">
          <div class="controls">
            <label class="field">
              <span>Nome</span>
              <div class="input-wrap">
                <input
                  v-model="name"
                  type="text"
                  placeholder="Ex: Yasmin Silva"
                  autocomplete="off"
                  spellcheck="false"
                />
                <button
                  v-if="name"
                  type="button"
                  class="clear"
                  aria-label="Limpar nome"
                  @click="name = ''"
                >
                  ×
                </button>
              </div>
            </label>

            <div class="group">
              <span class="group-label">Modo</span>
              <div class="mode-tabs" role="tablist" aria-label="Modo de resolução">
                <button
                  v-for="item in modes"
                  :key="item.value"
                  type="button"
                  role="tab"
                  :aria-selected="mode === item.value"
                  :class="{ active: mode === item.value }"
                  @click="mode = item.value"
                >
                  {{ item.label }}
                </button>
              </div>
              <p class="hint">{{ modeHint }}</p>
            </div>

            <div class="group">
              <span class="group-label">Tipo</span>
              <div class="mode-tabs" role="tablist" aria-label="Tipo de avatar">
                <button
                  v-for="item in kinds"
                  :key="item.value"
                  type="button"
                  role="tab"
                  :aria-selected="kind === item.value"
                  :class="{ active: kind === item.value }"
                  @click="kind = item.value"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <div class="group">
              <span class="group-label">Paleta</span>
              <div class="theme-row">
                <button
                  v-for="theme in themes"
                  :key="theme.id"
                  type="button"
                  class="theme-btn"
                  :class="{ active: activeTheme === theme.id }"
                  :aria-label="`Tema ${theme.label}`"
                  @click="applyTheme(theme.id)"
                >
                  <span
                    class="theme-swatch"
                    :style="{
                      background: `linear-gradient(135deg, ${theme.background} 0 50%, ${theme.hair} 50% 100%)`,
                    }"
                  />
                  <span class="theme-name">{{ theme.label }}</span>
                </button>
              </div>
            </div>

            <div class="group">
              <span class="group-label">Cores</span>
              <div class="color-grid">
                <label
                  v-for="field in colorFields"
                  :key="field.key"
                  class="color-field"
                >
                  <span class="color-label">{{ field.label }}</span>
                  <div class="color-input">
                    <span
                      class="color-preview"
                      :style="{ background: colors[field.key] }"
                    />
                    <input
                      v-model="background"
                      v-if="field.key === 'background'"
                      type="color"
                      aria-label="Cor de fundo"
                    />
                    <input
                      v-model="hair"
                      v-else-if="field.key === 'hair'"
                      type="color"
                      aria-label="Cor do cabelo"
                    />
                    <input
                      v-model="skin"
                      v-else-if="field.key === 'skin'"
                      type="color"
                      aria-label="Cor da pele"
                    />
                    <input
                      v-model="text"
                      v-else-if="field.key === 'text'"
                      type="color"
                      aria-label="Cor do texto"
                    />
                    <input
                      v-model="features"
                      v-else-if="field.key === 'features'"
                      type="color"
                      aria-label="Cor dos traços"
                    />
                    <code>{{ colors[field.key].toUpperCase() }}</code>
                  </div>
                </label>
              </div>
            </div>

            <div
              v-if="result.render === 'initials' || kind === 'initials'"
              class="group"
            >
              <span class="group-label">Fonte das iniciais</span>
              <div class="mode-tabs">
                <button
                  v-for="item in fonts"
                  :key="item.value"
                  type="button"
                  :class="{ active: font === item.value }"
                  @click="font = item.value"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <div class="group">
              <span class="group-label">Experimente</span>
              <div class="chips">
                <button
                  v-for="item in suggestions"
                  :key="item.value"
                  type="button"
                  :class="{
                    active: isSuggestionActive(item.value),
                    matched: suggestionMatched(item.value),
                  }"
                  @click="pickSuggestion(item.value)"
                >
                  <span
                    class="chip-dot"
                    :class="suggestionMatched(item.value) ? 'own' : 'pool'"
                  />
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal :delay="2">
        <div class="preview">
          <div
            class="stage"
            :style="{ '--stage-bg': background }"
          >
            <AvatarFace
              :name="name || 'Yasmin'"
              :size="220"
              :mode="mode"
              :kind="kind"
              :font="font"
              v-bind="colors"
            />
          </div>

          <div class="meta">
            <span
              class="badge"
              :class="{
                own: result.render === 'face',
                initials: result.render === 'initials',
                pool: result.render === 'pool',
              }"
            >
              {{ statusLabel }}
            </span>
            <h3 class="serif">{{ name || 'Sem nome' }}</h3>
            <p class="detail">{{ statusDetail }}</p>
          </div>

          <div class="sizes">
            <span class="sizes-label">Tamanhos</span>
            <div class="size-row">
              <AvatarFace
                v-for="size in [40, 64, 96]"
                :key="size"
                :name="name || 'Yasmin'"
                :size="size"
                :mode="mode"
                :kind="kind"
                :font="font"
                v-bind="colors"
              />
            </div>
          </div>

          <div class="snippet">
            <span class="snippet-label">Código gerado</span>
            <pre><code>{{ codeSnippet }}</code></pre>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 32px;
  padding: 36px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), #fff),
    var(--bg-soft);
}

.copy h2 {
  margin: 14px 0 12px;
  font-size: clamp(32px, 4vw, 46px);
  max-width: 14ch;
}

.copy > .muted {
  margin: 0 0 28px;
  max-width: 44ch;
  line-height: 1.6;
}

.controls {
  display: grid;
  gap: 22px;
}

.group-label {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
}

.field {
  display: grid;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
}

.input-wrap {
  position: relative;
}

.field input[type='text'] {
  width: 100%;
  min-height: 50px;
  padding: 0 44px 0 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input[type='text']:focus {
  outline: none;
  border-color: rgba(91, 79, 224, 0.45);
  box-shadow: 0 0 0 4px rgba(91, 79, 224, 0.1);
}

.clear {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 999px;
  background: var(--bg-soft);
  color: var(--muted);
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.clear:hover {
  background: var(--line);
  color: var(--ink);
}

.mode-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mode-tabs button {
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.mode-tabs button.active {
  background: var(--ink);
  border-color: var(--ink);
  color: #fff;
}

.hint {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--muted);
}

.theme-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.theme-btn {
  display: grid;
  gap: 6px;
  justify-items: center;
  min-width: 68px;
  padding: 8px 10px 10px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.theme-btn:hover {
  transform: translateY(-1px);
}

.theme-btn.active {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(91, 79, 224, 0.12);
}

.theme-swatch {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(23, 23, 23, 0.08);
}

.theme-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

.theme-btn.active .theme-name {
  color: var(--ink);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.color-field {
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
}

.color-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
}

.color-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-preview {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid rgba(23, 23, 23, 0.08);
  flex-shrink: 0;
}

.color-input input[type='color'] {
  width: 34px;
  height: 28px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.color-input code {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.04em;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chips button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  background: #fff;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.chips button:hover,
.chips button.active {
  background: var(--bg-soft);
}

.chips button.active {
  border-color: rgba(91, 79, 224, 0.35);
}

.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.chip-dot.own {
  background: #0f766e;
}

.chip-dot.pool {
  background: #c2410c;
}

.preview {
  display: grid;
  align-content: start;
  gap: 20px;
  min-height: 100%;
  padding: 24px;
  border-radius: 22px;
  background:
    radial-gradient(circle at top, rgba(91, 79, 224, 0.08), transparent 52%),
    var(--bg-soft);
}

.stage {
  display: grid;
  place-items: center;
  padding: 28px;
  border-radius: 20px;
  background:
    radial-gradient(circle at center, rgba(255, 255, 255, 0.55), transparent 68%),
    var(--stage-bg);
  box-shadow: inset 0 0 0 1px rgba(23, 23, 23, 0.05);
}

.meta {
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.badge.own {
  background: #d1fae5;
  color: #0f766e;
}

.badge.initials {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge.pool {
  background: #ffedd5;
  color: #9a3412;
}

.meta h3 {
  margin: 12px 0 0;
  font-size: clamp(28px, 3vw, 36px);
  word-break: break-word;
}

.detail {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 14px;
}

.sizes-label,
.snippet-label {
  display: block;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.size-row {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 16px;
}

.snippet pre {
  margin: 0;
  padding: 14px 16px;
  border-radius: 16px;
  background: #171717;
  overflow-x: auto;
}

.snippet code {
  color: #f5f5f5;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre;
}

@media (max-width: 900px) {
  .panel {
    grid-template-columns: 1fr;
    padding: 24px;
  }

  .color-grid {
    grid-template-columns: 1fr;
  }
}
</style>
