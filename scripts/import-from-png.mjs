import path from 'node:path'
import { importAvatarFromPng } from './lib/png-avatar.mjs'

const id = process.argv[2]
const gender = process.argv[3] || 'neutral'
const pngPath = process.argv[4]

if (!id || !pngPath) {
  console.error('Usage: node scripts/import-from-png.mjs <id> <gender> <png-path>')
  process.exit(1)
}

const result = await importAvatarFromPng({
  id,
  gender,
  pngPath: path.resolve(pngPath),
})

console.log('Wrote', result.outPath)
console.log(result.stats)
