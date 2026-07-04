import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getAvatarDataUri,
  getAvatarSvg,
  hasAvatar,
  listKnownNames,
} from '../dist/index.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'playground')
mkdirSync(outDir, { recursive: true })

const names = listKnownNames()
const samples = [
  ...names.first.map((name) => ({ name, mode: 'first' })),
  ...names.last.map((name) => ({ name: `Pessoa ${name}`, mode: 'last' })),
]

const cards = samples
  .map(({ name, mode }) => {
    const label = mode === 'last' ? name : name
    const matched = hasAvatar(name, { mode })
    const src = getAvatarDataUri(name, { size: 120, mode })
    const colored = getAvatarDataUri(name, {
      size: 120,
      mode,
      background: '#EDE9FE',
      hair: '#4C1D95',
      features: '#1F2937',
    })

    return `
      <article class="card">
        <div class="faces">
          <img src="${src}" width="120" height="120" alt="${label}" />
          <img src="${colored}" width="120" height="120" alt="${label} colorido" />
        </div>
        <h2>${label}</h2>
        <p>${matched ? 'rosto proprio' : 'fallback'} · mode: ${mode}</p>
      </article>
    `
  })
  .join('\n')

const yasminSvg = getAvatarSvg('Yasmin', { size: 240 })

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>namefaces preview</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, Segoe UI, sans-serif;
        background: #f6f6f4;
        color: #171717;
      }
      body {
        margin: 0;
        padding: 32px;
      }
      h1 {
        margin: 0 0 8px;
        font-size: 28px;
      }
      .lead {
        margin: 0 0 28px;
        color: #525252;
      }
      .hero {
        display: flex;
        gap: 24px;
        align-items: center;
        margin-bottom: 36px;
        padding: 24px;
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 20px;
      }
      .hero svg,
      .hero img {
        display: block;
        border-radius: 999px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
      }
      .card {
        background: #fff;
        border: 1px solid #e5e5e5;
        border-radius: 18px;
        padding: 16px;
      }
      .faces {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
      }
      .faces img {
        border-radius: 999px;
        background: #fff;
      }
      h2 {
        margin: 0;
        font-size: 18px;
        text-transform: capitalize;
      }
      p {
        margin: 4px 0 0;
        color: #737373;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <h1>namefaces</h1>
    <p class="lead">Preview local dos avatars. Esquerda = padrao, direita = com cor.</p>

    <section class="hero">
      ${yasminSvg}
      <div>
        <h2>Yasmin</h2>
        <p>Avatar principal para validar o import do SVG.</p>
      </div>
    </section>

    <section class="grid">
      ${cards}
    </section>
  </body>
</html>
`

const outFile = path.join(outDir, 'index.html')
writeFileSync(outFile, html)
console.log(`Preview gerado em ${outFile}`)
