import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const svgPath = process.argv[2] || 'C:/Users/mathe/Downloads/yasmin.svg'
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
    const fill = (fillMatch?.[1] ?? '').trim()
    paths.push({ d: dMatch[1], fill })
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

function transformD(d, scale, offsetX, offsetY) {
  const tokens = d.replace(/,/g, ' ').trim().split(/\s+/).filter(Boolean)
  const out = []
  let i = 0
  let cmd = ''

  const read = () => {
    const value = parseFloat(tokens[i])
    i += 1
    return value
  }

  const pushNum = (value) => {
    const rounded = Math.round(value * 1000) / 1000
    out.push(String(rounded))
  }

  while (i < tokens.length) {
    const token = tokens[i]
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(token)) {
      cmd = token
      out.push(cmd)
      i += 1
      if (cmd === 'Z' || cmd === 'z') continue
    }

    if (cmd === 'M' || cmd === 'L' || cmd === 'T') {
      pushNum(read() * scale + offsetX)
      pushNum(read() * scale + offsetY)
      if (cmd === 'M') cmd = 'L'
    } else if (cmd === 'm' || cmd === 'l' || cmd === 't') {
      pushNum(read() * scale)
      pushNum(read() * scale)
      if (cmd === 'm') cmd = 'l'
    } else if (cmd === 'H') {
      pushNum(read() * scale + offsetX)
    } else if (cmd === 'h') {
      pushNum(read() * scale)
    } else if (cmd === 'V') {
      pushNum(read() * scale + offsetY)
    } else if (cmd === 'v') {
      pushNum(read() * scale)
    } else if (cmd === 'C') {
      for (let n = 0; n < 3; n += 1) {
        pushNum(read() * scale + offsetX)
        pushNum(read() * scale + offsetY)
      }
    } else if (cmd === 'c') {
      for (let n = 0; n < 3; n += 1) {
        pushNum(read() * scale)
        pushNum(read() * scale)
      }
    } else if (cmd === 'S' || cmd === 'Q') {
      for (let n = 0; n < 2; n += 1) {
        pushNum(read() * scale + offsetX)
        pushNum(read() * scale + offsetY)
      }
    } else if (cmd === 's' || cmd === 'q') {
      for (let n = 0; n < 2; n += 1) {
        pushNum(read() * scale)
        pushNum(read() * scale)
      }
    } else if (cmd === 'A') {
      pushNum(read() * scale)
      pushNum(read() * scale)
      pushNum(read())
      pushNum(read())
      pushNum(read())
      pushNum(read() * scale + offsetX)
      pushNum(read() * scale + offsetY)
    } else if (cmd === 'a') {
      pushNum(read() * scale)
      pushNum(read() * scale)
      pushNum(read())
      pushNum(read())
      pushNum(read())
      pushNum(read() * scale)
      pushNum(read() * scale)
    } else {
      i += 1
    }
  }

  return out.join(' ')
}

function isLight(fill) {
  const value = fill.toLowerCase()
  return value === '#ffffff' || value === '#fff' || value === 'white'
}

function isDark(fill) {
  const value = fill.toLowerCase()
  return (
    value === '#333333' ||
    value === '#333' ||
    value === '#111111' ||
    value === '#000000' ||
    value === '#000' ||
    value === 'black'
  )
}

function renderPath(pathItem, role) {
  const d = pathItem.d
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

const hair = extractPaths(extractGroup('hair'))
const skin = extractPaths(extractGroup('skin'))
const features = extractPaths(extractGroup('features'))
const all = [...hair, ...skin, ...features]
const bounds = boundsOf(all)

const padding = 4
const target = 80
const scale = Math.min(
  (target - padding * 2) / bounds.width,
  (target - padding * 2) / bounds.height,
)
const offsetX = (target - bounds.width * scale) / 2 - bounds.minX * scale
const offsetY = (target - bounds.height * scale) / 2 - bounds.minY * scale

const mapPaths = (paths, role) =>
  paths
    .map((pathItem) =>
      renderPath(
        {
          ...pathItem,
          d: transformD(pathItem.d, scale, offsetX, offsetY),
        },
        role,
      ),
    )
    .join('')

const file = `import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const yasmin: AvatarDefinition = {
  id: 'yasmin',
  gender: 'female',
  svg: createAvatarSvg({
    hair: '${mapPaths(hair, 'hair')}',
    skin: '${mapPaths(skin, 'skin')}',
    features: '${mapPaths(features, 'features')}',
  }),
}
`

const outPath = path.resolve('src/avatars/first/yasmin.ts')
writeFileSync(outPath, file)
console.log('Wrote', outPath)
console.log('bounds', bounds)
console.log('scale', scale)
