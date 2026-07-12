import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import potrace from 'potrace'

const id = process.argv[2]
const gender = process.argv[3] || 'neutral'
const pngPath = process.argv[4]

if (!id || !pngPath) {
  console.error('Usage: node scripts/import-from-png.mjs <id> <gender> <png-path>')
  process.exit(1)
}

function tracePng(file, blackOnWhite) {
  return new Promise((resolve, reject) => {
    potrace.trace(
      file,
      { turdSize: 2, optTolerance: 0.2, blackOnWhite },
      (err, svg) => (err ? reject(err) : resolve(svg)),
    )
  })
}

function extractPathData(svg) {
  const paths = []
  const regex = /<path\b([^>]*)\/?>/g
  let match
  while ((match = regex.exec(svg))) {
    const attrs = match[1]
    const dMatch = attrs.match(/\bd="([^"]+)"/)
    const styleMatch = attrs.match(/\bstyle="([^"]*)"/)
    const fillAttr = attrs.match(/\bfill="([^"]+)"/)
    if (!dMatch) continue
    const style = styleMatch?.[1] ?? ''
    const styleFill = style.match(/fill:([^;]+)/)?.[1]?.trim().toLowerCase()
    const fill = (fillAttr?.[1] ?? styleFill ?? '').toLowerCase()
    paths.push({ d: dMatch[1].trim(), fill })
  }
  return paths
}

function splitSubpaths(d) {
  const normalized = d.replace(/\s+/g, ' ').trim()
  return normalized.split(/(?=M )/).filter(Boolean).map((part) => part.trim())
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

function boundsOfPaths(paths) {
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

function pathArea(pathItem) {
  const b = boundsOfPaths([pathItem])
  return b.width * b.height
}

function pathCenter(pathItem) {
  const b = boundsOfPaths([pathItem])
  return { x: (b.minX + b.maxX) / 2, y: (b.minY + b.maxY) / 2 }
}

function touchesCanvasEdge(pathItem, canvas, margin = 8) {
  const b = boundsOfPaths([pathItem])
  return (
    b.minX <= canvas.minX + margin ||
    b.minY <= canvas.minY + margin ||
    b.maxX >= canvas.maxX - margin ||
    b.maxY >= canvas.maxY - margin
  )
}

function coversMostOfCanvas(pathItem, canvas) {
  const area = pathArea(pathItem)
  const canvasArea = canvas.width * canvas.height
  return area >= canvasArea * 0.55
}

function isCanvasFrame(pathItem, canvas) {
  return touchesCanvasEdge(pathItem, canvas) && coversMostOfCanvas(pathItem, canvas)
}

function discardArtifacts(paths, canvas) {
  return paths.filter((pathItem) => !isCanvasFrame(pathItem, canvas))
}

function expandPaths(paths) {
  const expanded = []
  for (const pathItem of paths) {
    for (const d of splitSubpaths(pathItem.d)) {
      expanded.push({ d, fill: pathItem.fill })
    }
  }
  return expanded
}

function isLight(fill) {
  return fill === '#ffffff' || fill === '#fff' || fill === 'white'
}

function classifyPaths(whitePaths, blackPaths, canvas) {
  const white = discardArtifacts(expandPaths(whitePaths), canvas)
  const black = discardArtifacts(expandPaths(blackPaths), canvas)

  const faceCenterX = canvas.minX + canvas.width * 0.48
  const faceCenterY = canvas.minY + canvas.height * 0.42
  const faceRadiusX = canvas.width * 0.2
  const faceRadiusY = canvas.height * 0.18

  const inFace = (pathItem) => {
    const c = pathCenter(pathItem)
    const dx = (c.x - faceCenterX) / faceRadiusX
    const dy = (c.y - faceCenterY) / faceRadiusY
    return dx * dx + dy * dy <= 1
  }

  const whiteCandidates = white.filter(
    (pathItem) => inFace(pathItem) && !touchesCanvasEdge(pathItem, canvas),
  )
  const whiteSorted = [...whiteCandidates].sort((a, b) => pathArea(b) - pathArea(a))
  const skin = whiteSorted.length ? [whiteSorted[0]] : []
  const hairHighlights = white.filter(
    (pathItem) => pathItem !== skin[0] && !touchesCanvasEdge(pathItem, canvas),
  )

  const blackSorted = [...black].sort((a, b) => pathArea(b) - pathArea(a))
  const hair = []
  const features = []
  const maxBlackArea = blackSorted.length ? pathArea(blackSorted[0]) : 0

  for (const pathItem of blackSorted) {
    const area = pathArea(pathItem)

    if (area >= maxBlackArea * 0.35) {
      hair.push(pathItem)
      continue
    }

    if (inFace(pathItem) && area < maxBlackArea * 0.12) {
      features.push(pathItem)
      continue
    }

    if (!inFace(pathItem)) {
      hair.push(pathItem)
      continue
    }

    features.push(pathItem)
  }

  return { hair: [...hair, ...hairHighlights], skin, features }
}

function renderPath(pathItem, role) {
  const d = pathItem.d.replace(/"/g, "'")

  if (role === 'hair') {
    if (isLight(pathItem.fill) || !pathItem.fill || pathItem.fill === 'none') {
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

const whiteSvg = await tracePng(pngPath, false)
const blackSvg = await tracePng(pngPath, true)

const privateDir = path.resolve('_private')
writeFileSync(path.join(privateDir, `${id}-white.svg`), whiteSvg)
writeFileSync(path.join(privateDir, `${id}-black.svg`), blackSvg)

const whitePaths = extractPathData(whiteSvg)
const blackPaths = extractPathData(blackSvg)
const canvas = boundsOfPaths([...expandPaths(whitePaths), ...expandPaths(blackPaths)])
const { hair, skin, features } = classifyPaths(whitePaths, blackPaths, canvas)

const contentPaths = discardArtifacts([...hair, ...skin, ...features], canvas)

const padding = 3
const target = 80
const bounds = boundsOfPaths(contentPaths.length ? contentPaths : [...hair, ...skin, ...features])
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
console.log({
  hair: hair.length,
  skin: skin.length,
  features: features.length,
  bounds,
  scale,
  tx,
  ty,
})
