import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const avatarsDir = path.join(root, 'src', 'avatars')

const REQUIRED_PARTS = ['background', 'hair', 'skin', 'features']
const REQUIRED_TOKENS = ['{{background}}', '{{hair}}', '{{skin}}', '{{features}}']
// Tool provenance only. Copyright metadata (namefaces / matheusxdev / LICENSE) is required below.
const FORBIDDEN = [
  'Generator',
  'Inkscape',
  'Figma',
  'Sketch',
  'Midjourney',
  'OpenAI',
  'DALL',
  'Cursor',
  'ChatGPT',
  '<!--',
]
const COPYRIGHT_REQUIRED = [
  '<metadata>',
  '<desc>',
  'data-namefaces="',
  'namefaces/matheusxdev/2026',
  'data-namefaces-mark="copyright"',
  'Copyright (c) 2026 namefaces / matheusxdev',
  'package LICENSE',
  'overflow="hidden"',
  'M120 120',
]

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
      continue
    }
    if (entry.name.endsWith('.ts') && entry.name !== 'shell.ts' && entry.name !== 'index.ts') {
      files.push(fullPath)
    }
  }

  return files
}

const files = await walk(avatarsDir)
const errors = []

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const relative = path.relative(root, file)

  if (!/id:\s*'[^']+'/.test(source)) {
    errors.push(`${relative}: missing id`)
  }

  if (!/gender:\s*'[^']+'/.test(source)) {
    errors.push(`${relative}: missing gender`)
  }

  if (!source.includes('createAvatarSvg') && !source.includes('<svg')) {
    errors.push(`${relative}: missing svg definition`)
  }

  if (!source.includes('createAvatarSvg')) {
    for (const part of REQUIRED_PARTS) {
      if (!source.includes(`data-part="${part}"`)) {
        errors.push(`${relative}: missing data-part="${part}"`)
      }
    }

    for (const token of REQUIRED_TOKENS) {
      if (!source.includes(token)) {
        errors.push(`${relative}: missing ${token}`)
      }
    }

    if (!source.includes('viewBox="0 0 80 80"')) {
      errors.push(`${relative}: unexpected viewBox`)
    }
  }

  for (const word of FORBIDDEN) {
    if (source.includes(word)) {
      errors.push(`${relative}: forbidden content "${word}"`)
    }
  }
}

const shellPath = path.join(avatarsDir, 'shell.ts')
const shell = await readFile(shellPath, 'utf8')

for (const part of REQUIRED_PARTS) {
  if (!shell.includes(`data-part="${part}"`)) {
    errors.push(`src/avatars/shell.ts: missing data-part="${part}"`)
  }
}

for (const token of REQUIRED_TOKENS) {
  if (!shell.includes(token)) {
    errors.push(`src/avatars/shell.ts: missing ${token}`)
  }
}

if (!shell.includes('viewBox="0 0 80 80"')) {
  errors.push('src/avatars/shell.ts: missing viewBox')
}

for (const word of FORBIDDEN) {
  if (shell.includes(word)) {
    errors.push(`src/avatars/shell.ts: forbidden content "${word}"`)
  }
}

for (const mark of COPYRIGHT_REQUIRED) {
  if (!shell.includes(mark)) {
    errors.push(`src/avatars/shell.ts: missing copyright mark "${mark}"`)
  }
}

if (errors.length > 0) {
  console.error('Avatar validation failed:\n')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`Validated ${files.length} avatars successfully.`)
