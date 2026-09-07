import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'
import potrace from 'potrace'

const INKSCAPE_CANDIDATES = [
  process.env.INKSCAPE_PATH,
  'C:\\Program Files\\Inkscape\\bin\\inkscape.com',
  'C:\\Program Files\\Inkscape\\bin\\inkscape.exe',
  'inkscape',
].filter(Boolean)

function findInkscape() {
  for (const candidate of INKSCAPE_CANDIDATES) {
    if (candidate === 'inkscape') return candidate
    if (existsSync(candidate)) return candidate
  }
  return null
}

function isPngBuffer(buf) {
  return (
    buf.length >= 8 &&
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
}

function isJpegBuffer(buf) {
  return buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
}

/**
 * Ensure the source is a real PNG on disk. JPEG (and other formats Inkscape
 * can read) are converted first so pngjs never sees non-PNG bytes.
 */
export function ensurePngSource(inputPath, privateDir = path.resolve('_private')) {
  const abs = path.resolve(inputPath)
  const buf = readFileSync(abs)
  if (isPngBuffer(buf)) return abs

  const inkscape = findInkscape()
  if (!inkscape) {
    const kind = isJpegBuffer(buf) ? 'JPEG' : 'non-PNG'
    throw new Error(
      `Fonte é ${kind} (${abs}) e Inkscape não foi encontrado para converter. ` +
        `Instale Inkscape ou passe um PNG real.`,
    )
  }

  mkdirSync(privateDir, { recursive: true })
  const base = path.basename(abs, path.extname(abs)).replace(/[^a-z0-9_-]/gi, '')
  const outPath = path.join(privateDir, `${base || 'source'}-converted.png`)
  const result = spawnSync(
    inkscape,
    [abs, '--export-type=png', `--export-filename=${outPath}`],
    { encoding: 'utf8' },
  )
  if (result.status !== 0 || !existsSync(outPath)) {
    throw new Error(
      `Falha ao converter ${abs} → PNG via Inkscape.\n` +
        `${result.stderr || result.stdout || `exit ${result.status}`}`,
    )
  }
  console.log(`Converted ${path.basename(abs)} → ${path.basename(outPath)}`)
  return outPath
}

/**
 * Force pure black/white so potrace keeps solid hair fills
 * instead of anti-aliased outline crumbs.
 * Accepts PNG or JPEG (JPEG is converted via Inkscape first).
 */
export function thresholdPngToBw(inputPath, outputPath, cutoff = 140) {
  const pngPath = ensurePngSource(inputPath, path.dirname(path.resolve(outputPath)))
  const png = PNG.sync.read(readFileSync(pngPath))
  for (let i = 0; i < png.data.length; i += 4) {
    const r = png.data[i]
    const g = png.data[i + 1]
    const b = png.data[i + 2]
    const a = png.data[i + 3]
    if (a < 16) {
      png.data[i] = 255
      png.data[i + 1] = 255
      png.data[i + 2] = 255
      png.data[i + 3] = 255
      continue
    }
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    const v = lum < cutoff ? 0 : 255
    png.data[i] = v
    png.data[i + 1] = v
    png.data[i + 2] = v
    png.data[i + 3] = 255
  }
  mkdirSync(path.dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, PNG.sync.write(png))
  return outputPath
}

function tracePng(file, blackOnWhite) {
  return new Promise((resolve, reject) => {
    potrace.trace(
      file,
      { turdSize: 40, optTolerance: 0.3, blackOnWhite, threshold: 128 },
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

/**
 * Keep potrace face-holes inside compound hair paths (evenodd), while pulling
 * tiny subpaths out as facial features. Expanding holes into separate fills
 * creates the classic black face / jaw-blob bug.
 */
function splitBlackHairAndFeatures(blackPaths, canvas) {
  const raw = discardArtifacts(blackPaths, canvas)
  const hair = []
  const features = []

  for (const pathItem of raw) {
    const parts = splitSubpaths(pathItem.d)
    if (parts.length <= 1) {
      hair.push(pathItem)
      continue
    }

    const scored = parts
      .map((d) => ({ d, fill: pathItem.fill, area: pathArea({ d, fill: pathItem.fill }) }))
      .sort((a, b) => b.area - a.area)

    const mainArea = scored[0].area
    const compound = [scored[0].d]

    for (const part of scored.slice(1)) {
      if (part.area < mainArea * 0.08) {
        features.push({ d: part.d, fill: part.fill })
      } else {
        compound.push(part.d)
      }
    }

    hair.push({ d: compound.join(' '), fill: pathItem.fill })
  }

  return { hair, features }
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

function boundsOverlapRatio(a, b) {
  const x1 = Math.max(a.minX, b.minX)
  const y1 = Math.max(a.minY, b.minY)
  const x2 = Math.min(a.maxX, b.maxX)
  const y2 = Math.min(a.maxY, b.maxY)
  if (x2 <= x1 || y2 <= y1) return 0
  const inter = (x2 - x1) * (y2 - y1)
  const smaller = Math.min(a.width * a.height, b.width * b.height)
  return smaller ? inter / smaller : 0
}

/** Point-in-ellipse test used to drop jaw/neck hair crumbs inside the face cutout. */
function pointInEgg(x, y, egg) {
  const dx = (x - egg.cx) / egg.rx
  const dy = (y - egg.cy) / egg.ry
  return dx * dx + dy * dy <= 1
}

/**
 * Compact face cutout kept well under the hairline.
 * Deliberately NOT a near-circle covering the crown — that reads as a white
 * disk on the gray namefaces background when painted as skin on top of hair.
 */
function faceSkinEgg(hairBounds, features) {
  let cx = (hairBounds.minX + hairBounds.maxX) / 2
  // Sit in the mid-lower face so crown hair stays black.
  let cy = hairBounds.minY + hairBounds.height * 0.58

  if (features.length) {
    const fb = boundsOfPaths(features)
    cx = (fb.minX + fb.maxX) / 2
    cy = (fb.minY + fb.maxY) / 2 + hairBounds.height * 0.06
  }

  // Narrower than the old egg — cheeks/jaw only, not the full head silhouette.
  let rx = hairBounds.width * 0.32
  let ry = hairBounds.height * 0.36

  // Keep top of cutout below ~28% of hair silhouette (preserve bangs/crown).
  const minTop = hairBounds.minY + hairBounds.height * 0.28
  if (cy - ry < minTop) {
    ry = Math.max(hairBounds.height * 0.22, cy - minTop)
    if (cy - ry < minTop) {
      cy = minTop + ry
    }
  }

  const maxBottom = hairBounds.maxY - hairBounds.height * 0.02
  if (cy + ry > maxBottom) {
    const bottom = maxBottom
    const top = Math.max(minTop, cy - ry)
    cy = (top + bottom) / 2
    ry = (bottom - top) / 2
  }

  rx = Math.min(Math.max(rx, hairBounds.width * 0.26), hairBounds.width * 0.38)
  ry = Math.min(Math.max(ry, hairBounds.height * 0.24), hairBounds.height * 0.42)

  // Stretch slightly vertical so it never reads as a perfect white circle.
  if (Math.abs(rx - ry) / Math.max(rx, ry) < 0.12) {
    ry = rx * 1.18
  }

  return {
    cx,
    cy,
    rx,
    ry,
    d: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} Z`,
    fill: 'white',
    synthetic: true,
  }
}

/** True when skin path is a near-circular ellipse (white-disk bug). */
function isCircularSkinDisk(skinPath, hairBounds) {
  if (!skinPath?.d) return false
  const arcMatches = skinPath.d.match(/A\s+([\d.]+)\s+([\d.]+)\s+0\s+1\s+0/gi)
  if (!arcMatches || arcMatches.length < 2) return false

  const nums = [...skinPath.d.matchAll(/A\s+([\d.]+)\s+([\d.]+)/gi)]
  if (!nums.length) return false
  const rx = parseFloat(nums[0][1])
  const ry = parseFloat(nums[0][2])
  if (!(rx > 0 && ry > 0)) return false

  const circularity = Math.min(rx, ry) / Math.max(rx, ry)
  const sb = boundsOfPaths([skinPath])
  const coversTop =
    hairBounds &&
    sb.minY <= hairBounds.minY + hairBounds.height * 0.22
  const tooRound = circularity >= 0.88
  const tooWide = hairBounds && sb.width >= hairBounds.width * 0.72
  const tooTall = hairBounds && sb.height >= hairBounds.height * 0.7

  // Classic white-disk: nearly circular ellipse that eats the crown / most of head.
  return tooRound && (coversTop || tooWide || tooTall)
}

function isFullHeadSilhouette(hair, canvas) {
  if (!hair.length) return false
  const main = [...hair].sort((a, b) => pathArea(b) - pathArea(a))[0]
  const b = boundsOfPaths([main])
  const canvasArea = canvas.width * canvas.height
  const heightRatio = b.height / canvas.height
  const widthRatio = b.width / canvas.width
  const areaRatio = pathArea(main) / canvasArea
  const reachesNeck = b.maxY >= canvas.minY + canvas.height * 0.72
  // True solid head blob (face filled black). Tall side-hair alone is NOT this.
  return heightRatio >= 0.55 && widthRatio >= 0.42 && reachesNeck && areaRatio >= 0.22
}

function classifyPaths(whitePaths, blackPaths, canvas) {
  const white = discardArtifacts(expandPaths(whitePaths), canvas)
  const { hair: hairSeed, features: featureSeed } = splitBlackHairAndFeatures(
    blackPaths,
    canvas,
  )

  const faceCenterX = canvas.minX + canvas.width * 0.48
  const faceCenterY = canvas.minY + canvas.height * 0.42
  const faceRadiusX = canvas.width * 0.22
  const faceRadiusY = canvas.height * 0.2

  const inFace = (pathItem) => {
    const c = pathCenter(pathItem)
    const dx = (c.x - faceCenterX) / faceRadiusX
    const dy = (c.y - faceCenterY) / faceRadiusY
    return dx * dx + dy * dy <= 1
  }

  const blackSorted = [...hairSeed].sort((a, b) => pathArea(b) - pathArea(a))
  const hair = []
  const features = [...featureSeed]
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

  const whiteCandidates = white.filter(
    (pathItem) => inFace(pathItem) && !touchesCanvasEdge(pathItem, canvas),
  )
  const whiteSorted = [...whiteCandidates].sort((a, b) => pathArea(b) - pathArea(a))
  let skin = whiteSorted.length ? [whiteSorted[0]] : []

  // Reject "skin" that is really a duplicate of the full head/hair silhouette
  // (painting it white on top wipes out all black hair).
  if (skin.length && hair.length) {
    const hairBounds = boundsOfPaths(hair)
    const skinBounds = boundsOfPaths(skin)
    const hairArea = Math.max(...hair.map((p) => pathArea(p)))
    const skinArea = pathArea(skin[0])
    const overlap = boundsOverlapRatio(hairBounds, skinBounds)
    const nearlySameSize = skinArea >= hairArea * 0.55
    const coversHair = overlap >= 0.75 && nearlySameSize
    const sameTopLeft =
      Math.abs(hairBounds.minX - skinBounds.minX) < hairBounds.width * 0.05 &&
      Math.abs(hairBounds.minY - skinBounds.minY) < hairBounds.height * 0.05

    if (coversHair || (sameTopLeft && nearlySameSize)) {
      skin = []
    }
  }

  let fullSilhouette = isFullHeadSilhouette(hair, canvas)
  let hasUsableSkin =
    skin.length > 0 && pathArea(skin[0]) >= canvas.width * canvas.height * 0.02

  // Best skin for compound hair: reuse the potrace face-hole subpath.
  if (hair.length && !hasUsableSkin) {
    const main = [...hair].sort((a, b) => pathArea(b) - pathArea(a))[0]
    const parts = splitSubpaths(main.d)
    if (parts.length >= 2) {
      const scored = parts
        .map((d) => ({ d, area: pathArea({ d, fill: 'white' }) }))
        .sort((a, b) => b.area - a.area)
      const hole = scored[1]
      if (hole && hole.area >= scored[0].area * 0.1 && hole.area <= scored[0].area * 0.75) {
        skin = [{ d: hole.d, fill: 'white' }]
        hasUsableSkin = true
      }
    }
  }

  // Prefer traced white face. Only invent an egg when the face is missing,
  // and only if it won't paint a white disk over the crown/hair.
  if (hair.length && !hasUsableSkin) {
    const hairBounds = boundsOfPaths(hair)
    const egg = faceSkinEgg(hairBounds, features)
    const candidate = { d: egg.d, fill: egg.fill, synthetic: true }

    if (isCircularSkinDisk(candidate, hairBounds)) {
      // Refuse the white-disk fallback — caller must supply a better PNG
      // with a clear white face hole inside solid black hair.
      skin = []
      hasUsableSkin = false
    } else {
      // Punch the egg into the main hair path (evenodd) so crown stays black,
      // then use the same path as skin fill inside the hole.
      const mainIdx = hair
        .map((p, i) => ({ i, area: pathArea(p) }))
        .sort((a, b) => b.area - a.area)[0]?.i
      if (mainIdx != null) {
        const main = hair[mainIdx]
        if (splitSubpaths(main.d).length === 1) {
          hair[mainIdx] = { ...main, d: `${main.d} ${egg.d}` }
        }
      }
      skin = [candidate]

      const mainArea = Math.max(...hair.map((p) => pathArea(p)))
      const keptHair = []
      for (const pathItem of hair) {
        const area = pathArea(pathItem)
        const subCount = splitSubpaths(pathItem.d).length
        if (subCount > 1) {
          keptHair.push(pathItem)
          continue
        }
        const c = pathCenter(pathItem)
        const insideEgg = pointInEgg(c.x, c.y, egg)
        if (insideEgg && area < mainArea * 0.5) {
          if (area < mainArea * 0.12) features.push(pathItem)
          continue
        }
        keptHair.push(pathItem)
      }
      hair.length = 0
      hair.push(...keptHair)
      fullSilhouette = isFullHeadSilhouette(hair, canvas)
      hasUsableSkin = true
    }
  }

  return { hair, skin, features, fullSilhouette }
}

function renderPath(pathItem, role) {
  const d = pathItem.d.replace(/"/g, "'")

  if (role === 'hair') {
    if (isLight(pathItem.fill)) {
      return `<path d="${d}" fill="{{skin}}" fill-rule="evenodd"/>`
    }
    // evenodd keeps white face holes inside solid hair silhouettes
    return `<path d="${d}" fill-rule="evenodd"/>`
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

function qcCheck({ hair, skin, features, fullSilhouette }) {
  const errors = []
  const warnings = []

  if (!hair.length) errors.push('QC: nenhum path de hair (cabelo preto ausente)')
  if (!skin.length) errors.push('QC: nenhum path de skin')
  if (!features.length) warnings.push('QC: nenhum path de features (rosto pode ficar sem olhos/boca)')

  const hairForcedSkin = hair.filter((p) => isLight(p.fill)).length
  if (hairForcedSkin > 0 && hairForcedSkin >= hair.length) {
    errors.push('QC: todos os paths de hair estão com fill claro (cabelo vai ficar branco)')
  }

  if (hair.length && skin.length) {
    const hairBounds = boundsOfPaths(hair)
    const skinBounds = boundsOfPaths(skin)
    const overlap = boundsOverlapRatio(hairBounds, skinBounds)
    const hairArea = Math.max(...hair.map((p) => pathArea(p)))
    const skinArea = pathArea(skin[0])
    const mainHair = [...hair].sort((a, b) => pathArea(b) - pathArea(a))[0]
    const hairParts = splitSubpaths(mainHair.d)
    const skinIsHairHole =
      hairParts.length >= 2 &&
      hairParts.slice(1).some((d) => d === skin[0].d || d.replace(/\s+/g, ' ') === skin[0].d.replace(/\s+/g, ' '))

    if (skinArea >= hairArea * 0.55 && overlap >= 0.75 && !skinIsHairHole) {
      errors.push('QC: skin cobre o hair (silhouette branca no lugar do cabelo)')
    }
    if (overlap > 0.92 && !fullSilhouette && !skinIsHairHole) {
      warnings.push(`QC: skin quase cobre hair (overlap=${overlap.toFixed(2)})`)
    }

    // White-disk / halo: near-circular ellipse skin painted over the head.
    if (isCircularSkinDisk(skin[0], hairBounds)) {
      errors.push(
        'QC: skin é elipse quase circular cobrindo o topo da cabeça (disco branco / halo)',
      )
    }

    // Skin reaching into the crown (top 18% of hair) usually erases bangs.
    const crownLimit = hairBounds.minY + hairBounds.height * 0.18
    if (skinBounds.minY < crownLimit && skinBounds.width >= hairBounds.width * 0.55 && !skinIsHairHole) {
      errors.push('QC: skin invade o topo do cabelo (halo branco / cabelo lavado)')
    }
  }

  return { errors, warnings }
}

/**
 * Import a doodle PNG into src/avatars/first/<id>.ts
 */
export async function importAvatarFromPng({
  id,
  gender = 'neutral',
  pngPath,
  privateDir = path.resolve('_private'),
}) {
  if (!/^[a-z][a-z0-9]*$/.test(id)) {
    throw new Error(`id inválido: ${id} (use só a-z0-9, começando com letra)`)
  }

  mkdirSync(privateDir, { recursive: true })

  const bwPath = path.join(privateDir, `${id}-bw.png`)
  thresholdPngToBw(pngPath, bwPath)

  const whiteSvg = await tracePng(bwPath, false)
  const blackSvg = await tracePng(bwPath, true)

  writeFileSync(path.join(privateDir, `${id}-white.svg`), whiteSvg)
  writeFileSync(path.join(privateDir, `${id}-black.svg`), blackSvg)

  const whitePaths = extractPathData(whiteSvg)
  const blackPaths = extractPathData(blackSvg)
  const canvas = boundsOfPaths([...expandPaths(whitePaths), ...expandPaths(blackPaths)])
  const { hair, skin, features, fullSilhouette } = classifyPaths(whitePaths, blackPaths, canvas)

  const qc = qcCheck({ hair, skin, features, fullSilhouette })
  for (const w of qc.warnings) console.warn(w)
  if (qc.errors.length) {
    throw new Error(qc.errors.join('\n'))
  }

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

  return {
    outPath,
    bwPath,
    stats: {
      hair: hair.length,
      skin: skin.length,
      features: features.length,
      fullSilhouette,
      bounds,
      scale,
      tx,
      ty,
    },
    qc,
  }
}

export function registerFirstAvatar(id) {
  const indexPath = path.resolve('src/avatars/index.ts')
  let src = readFileSync(indexPath, 'utf8')

  const importLine = `import { ${id} } from './first/${id}'`
  if (!src.includes(importLine)) {
    src = src.replace(
      /(import \{ yasmin \} from '\.\/first\/yasmin'\n)/,
      `$1import { ${id} } from './first/${id}'\n`,
    )
    if (!src.includes(importLine)) {
      src = src.replace(
        /(import \{ pool1 \} from '\.\/pool\/pool1')/,
        `${importLine}\n$1`,
      )
    }
  }

  const mapEntry = `  ${id},`
  if (!src.match(new RegExp(`^\\s*${id},\\s*$`, 'm'))) {
    src = src.replace(
      /(export const firstAvatars: Record<string, AvatarDefinition> = \{[\s\S]*?)(\n\})/,
      (full, body, closing) => {
        if (body.includes(`\n  ${id},`) || body.includes(`\n  ${id}\n`)) return full
        return `${body}\n  ${id},${closing}`
      },
    )
  }

  writeFileSync(indexPath, src)
  return indexPath
}
