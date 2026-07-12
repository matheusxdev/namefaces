<script setup lang="ts">
import AvatarFace from './AvatarFace.vue'
import Reveal from './Reveal.vue'

const features = [
  {
    title: 'Rosto antes do ícone',
    text: 'Cada pessoa aparece com identidade própria, não como mais uma silhueta igual às outras.',
    tone: 'blue',
    names: ['Yasmin', 'Matheus', 'Ana', 'João', 'Maria', 'Bruna'],
  },
  {
    title: 'Iniciais automáticas',
    text: 'Sem rosto no mapa? Gera M ou MO no mesmo estilo — fundo redondo, traço consistente, fonte brand.',
    tone: 'green',
    initials: true,
  },
  {
    title: 'Ache pelo nome',
    text: 'Passe o nome e receba rosto ou iniciais. Funciona com primeiro nome, sobrenome ou nome completo.',
    tone: 'lavender',
    search: true,
  },
  {
    title: 'Cor do seu produto',
    text: 'Pinte fundo, cabelo, pele, traços — ou cor do texto e fonte nas iniciais.',
    tone: 'peach',
    colors: true,
  },
]
</script>

<template>
  <section id="recursos" class="section">
    <div class="container">
      <div class="head">
        <Reveal>
          <h2 class="serif">Rosto próprio, não ícone genérico</h2>
        </Reveal>
        <Reveal :delay="1">
          <a class="btn btn-primary" href="#docs">Ver documentação</a>
        </Reveal>
      </div>

      <div class="grid">
        <Reveal
          v-for="(feature, index) in features"
          :key="feature.title"
          :delay="(index as 0 | 1 | 2 | 3)"
        >
          <article class="feature card">
            <div class="visual" :class="feature.tone">
              <template v-if="feature.names">
                <div class="faces">
                  <AvatarFace
                    v-for="name in feature.names"
                    :key="name"
                    :name="name"
                    :size="44"
                    background="#ffffff"
                  />
                </div>
              </template>

              <template v-else-if="feature.initials">
                <div class="initials-row">
                  <AvatarFace name="Lucas" :size="56" />
                  <AvatarFace
                    name="Lucas Ferreira"
                    :size="56"
                    background="#EDE9FE"
                    text="#4C1D95"
                  />
                  <AvatarFace
                    name="Matheus"
                    :size="56"
                    kind="initials"
                    background="#DBEAFE"
                    text="#1D4ED8"
                  />
                </div>
              </template>

              <template v-else-if="feature.search">
                <div class="search-mock">
                  <div class="search-bar">Lucas Ferreira</div>
                  <div class="result">
                    <AvatarFace name="Lucas Ferreira" :size="48" />
                    <div>
                      <strong>Lucas Ferreira</strong>
                      <span>iniciais · LF</span>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else>
                <div class="color-row">
                  <AvatarFace name="Matheus" :size="64" />
                  <AvatarFace
                    name="Matheus"
                    :size="64"
                    background="#EDE9FE"
                    hair="#4C1D95"
                  />
                  <AvatarFace
                    name="Lucas"
                    :size="64"
                    kind="initials"
                    background="#DCFCE7"
                    text="#166534"
                    font="sans"
                  />
                </div>
              </template>
            </div>
            <div class="body">
              <h3 class="serif">{{ feature.title }}</h3>
              <p class="muted">{{ feature.text }}</p>
            </div>
          </article>
        </Reveal>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.head h2 {
  margin: 0;
  max-width: 14ch;
  font-size: clamp(34px, 4vw, 48px);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.feature {
  overflow: hidden;
}

.visual {
  min-height: 190px;
  display: grid;
  place-items: center;
  padding: 24px;
}

.visual.blue {
  background: var(--pastel-blue);
}

.visual.green {
  background: var(--pastel-green);
}

.visual.lavender {
  background: #ede9fe;
}

.visual.peach {
  background: var(--pastel-peach);
}

.faces {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 10px;
}

.initials-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.search-mock,
.color-row {
  width: min(100%, 260px);
}

.search-bar {
  padding: 12px 14px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;
  font-weight: 500;
}

.result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  background: #fff;
}

.result strong,
.result span {
  display: block;
}

.result span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 13px;
}

.color-row {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.body {
  padding: 22px;
}

.body h3 {
  margin: 0 0 8px;
  font-size: 28px;
}

.body p {
  margin: 0;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .head {
    flex-direction: column;
    align-items: start;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 540px) {
  .head h2 {
    max-width: none;
  }

  .head .btn {
    width: 100%;
  }

  .body h3 {
    font-size: 24px;
  }

  .visual {
    min-height: 160px;
    padding: 18px;
  }

  .faces {
    grid-template-columns: repeat(3, auto);
    gap: 8px;
  }
}
</style>
