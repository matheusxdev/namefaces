<script setup lang="ts">
import Reveal from './Reveal.vue'

const blocks = [
  {
    title: 'Instalação',
    code: `npm install namefaces`,
  },
  {
    title: 'Rosto ou iniciais (padrão)',
    code: `import { getAvatarSvg } from 'namefaces'

// Com rosto próprio → rosto
getAvatarSvg('Maria Silva')

// Sem rosto → iniciais (ex.: Lucas → L, Lucas Ferreira → LF)
getAvatarSvg('Lucas Ferreira')`,
  },
  {
    title: 'Forçar iniciais',
    code: `getAvatarSvg('Matheus', {
  kind: 'initials',
  background: '#EDE9FE',
  text: '#4C1D95',
  font: 'brand', // brand | sans | rounded
})`,
  },
  {
    title: 'React',
    code: `import { NameFace } from 'namefaces/react'

<NameFace name="Ana Costa" size={40} />
<NameFace name="Lucas" kind="initials" text="#1D4ED8" />`,
  },
]

const apiRows = [
  ['kind', 'auto | face | initials', 'auto'],
  ['mode', 'first | last | full | auto', 'first'],
  ['fallback', 'initials | pool', 'initials'],
  ['font', 'brand | sans | rounded', 'brand'],
  ['text', 'cor das iniciais', '#111111'],
  ['render', 'face | initials | pool', '(retorno)'],
]
</script>

<template>
  <section id="docs" class="section">
    <div class="container">
      <Reveal>
        <div class="head">
          <span class="eyebrow">Documentação</span>
          <h2 class="serif">Como usar no seu projeto</h2>
          <p class="muted">
            Rostos desenhados para nomes conhecidos. Iniciais dinâmicas para
            todo o resto — até 2 letras, fundo redondo, fonte configurável.
          </p>
        </div>
      </Reveal>

      <div class="grid">
        <Reveal
          v-for="(block, index) in blocks"
          :key="block.title"
          :delay="((index % 4) as 0 | 1 | 2 | 3)"
        >
          <article class="card block">
            <h3>{{ block.title }}</h3>
            <pre><code>{{ block.code }}</code></pre>
          </article>
        </Reveal>
      </div>

      <Reveal :delay="2">
        <div class="table-wrap card">
          <h3 class="serif">Opções principais</h3>
          <table>
            <thead>
              <tr>
                <th>Opção</th>
                <th>Valores</th>
                <th>Padrão</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in apiRows" :key="row[0]">
                <td><code>{{ row[0] }}</code></td>
                <td>{{ row[1] }}</td>
                <td><code>{{ row[2] }}</code></td>
              </tr>
            </tbody>
          </table>
          <p class="note muted">
            Guia completo em
            <a
              href="https://github.com/matheusxdev/namefaces/blob/main/docs/USO.md"
              target="_blank"
              rel="noreferrer"
            >
              docs/USO.md
            </a>
            · npm:
            <a
              href="https://www.npmjs.com/package/namefaces"
              target="_blank"
              rel="noreferrer"
            >
              namefaces@0.2.0
            </a>
          </p>
        </div>
      </Reveal>
    </div>
  </section>
</template>

<style scoped>
.head {
  max-width: 640px;
  margin-bottom: 28px;
}

.head h2 {
  margin: 14px 0 12px;
  font-size: clamp(32px, 4vw, 46px);
}

.head p {
  margin: 0;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.block {
  padding: 20px;
}

.block h3 {
  margin: 0 0 12px;
  font-size: 18px;
}

.block pre {
  margin: 0;
  padding: 14px;
  border-radius: 14px;
  background: #171717;
  overflow-x: auto;
}

.block code {
  color: #f5f5f5;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre;
}

.table-wrap {
  padding: 24px;
}

.table-wrap h3 {
  margin: 0 0 16px;
  font-size: 28px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid var(--line);
}

th {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.note {
  margin: 16px 0 0;
  font-size: 14px;
}

.note a {
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
