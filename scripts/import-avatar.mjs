import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const id = process.argv[2]
const gender = process.argv[3] || 'neutral'
const svgPath = process.argv[4]

if (!id || !svgPath) {
  console.error('Usage: node scripts/import-avatar.mjs <id> <gender> <svg-path>')
  process.exit(1)
}

const svg = readFileSync(svgPath, 'utf8')

function extractGroup(label) {
  const regex = new RegExp(
    `<g[^>]*inkscape:label="${label}"[^>]*>([\\s\\S]*?)</g>`,
  )
  const match = svg.match(regex)
  if (!match) {
    throw new Error(`Group not found: ${label}`)
  }
  return match[1]
}

function extractPaths(groupHtml) {
  const paths = []
  const regex = /<path\b([^>]*)\/?>/g
  let match
  while ((match = regex.exec(groupHtml))) {
    const attrs = match[1]
    const dMatch = attrs.match(/\bd="([^"]+)"/)
    const styleMatch = attrs.match(/\bstyle="([^"]*)"/)
    if (!dMatch) continue
    const style = styleMatch?.[1] ?? ''
    const fillMatch = style.match(/fill:([^;]+)/)
    const fill = (fillMatch?.[1] ?? '').trim().toLowerCase()
    paths.push({ d: dMatch[1].trim(), fill })
  }
  return paths
}

function parsePathPoints(d) {
  const tokens = d.replace(/,/g, ' ').trim().split(/\s+/).filter(Boolean)
  const points = []
  let i = 0
  let cmd = ''
  let x = 0
  let y = 0

  const read = () => {
    const value = parseFloat(tokens[i])
    i += 1
    return value
  }

  while (i < tokens.length) {
    const token = tokens[i]
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(token)) {
      cmd = token
      i += 1
      if (cmd === 'Z' || cmd === 'z') continue
    }

    if (cmd === 'M' || cmd === 'L') {
      x = read()
      y = read()
      if (cmd === 'M') cmd = 'L'
    } else if (cmd === 'm' || cmd === 'l') {
      x += read()
      y += read()
      if (cmd === 'm') cmd = 'l'
    } else if (cmd === 'H') {
      x = read()
    } else if (cmd === 'h') {
      x += read()
    } else if (cmd === 'V') {
      y = read()
    } else if (cmd === 'v') {
      y += read()
    } else if (cmd === 'C') {
      read()
      read()
      read()
      read()
      x = read()
      y = read()
    } else if (cmd === 'c') {
      read()
      read()
      read()
      read()
      x += read()
      y += read()
    } else if (cmd === 'S' || cmd === 'Q') {
      read()
      read()
      x = read()
      y = read()
    } else if (cmd === 's' || cmd === 'q') {
      read()
      read()
      x += read()
      y += read()
    } else if (cmd === 'T') {
      x = read()
      y = read()
    } else if (cmd === 't') {
      x += read()
      y += read()
    } else if (cmd === 'A') {
      read()
      read()
      read()
      read()
      read()
      x = read()
      y = read()
    } else if (cmd === 'a') {
      read()
      read()
      read()
      read()
      read()
      x += read()
      y += read()
    } else {
      i += 1
      continue
    }

    points.push([x, y])
  }

  return points
}

function boundsOf(paths) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const pathItem of paths) {
    for (const [x, y] of parsePathPoints(pathItem.d)) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY }
}

function isLight(fill) {
  return fill === '#ffffff' || fill === '#fff' || fill === 'white'
}

function renderPath(pathItem, role) {
  const d = pathItem.d.replace(/"/g, "'")

  if (role === 'hair') {
    if (isLight(pathItem.fill)) {
      return `<path d="${d}" fill="{{skin}}"/>`
    }
    return `<path d="${d}"/>`
  }

  if (role === 'skin') {
    return `<path d="${d}"/>`
  }

  if (isLight(pathItem.fill)) {
    return `<path d="${d}" fill="{{skin}}" stroke="none"/>`
  }

  return `<path d="${d}" stroke="none"/>`
}

function wrap(paths, role, transform) {
  const content = paths.map((pathItem) => renderPath(pathItem, role)).join('')
  return `<g transform="${transform}">${content}</g>`
}

const hair = extractPaths(extractGroup('hair'))
const skin = extractPaths(extractGroup('skin'))
const features = extractPaths(extractGroup('features'))
const all = [...hair, ...skin, ...features]
const bounds = boundsOf(all)

const padding = 3
const target = 80
const scale = Math.min(
  (target - padding * 2) / bounds.width,
  (target - padding * 2) / bounds.height,
)
const tx = (target - bounds.width * scale) / 2 - bounds.minX * scale
const ty = (target - bounds.height * scale) / 2 - bounds.minY * scale
const transform = `translate(${tx} ${ty}) scale(${scale})`

const file = `import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const ${id}: AvatarDefinition = {
  id: '${id}',
  gender: '${gender}',
  svg: createAvatarSvg({
    hair: '${wrap(hair, 'hair', transform)}',
    skin: '${wrap(skin, 'skin', transform)}',
    features: '${wrap(features, 'features', transform)}',
  }),
}
`

const outPath = path.resolve(`src/avatars/first/${id}.ts`)
writeFileSync(outPath, file)
console.log('Wrote', outPath)
console.log({ bounds, scale, tx, ty })
