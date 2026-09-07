import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { importAvatarFromPng, registerFirstAvatar } from './lib/png-avatar.mjs'

const id = process.argv[2]
const gender = process.argv[3] || 'neutral'
const pngPath = process.argv[4]

if (!id || !pngPath) {
  console.error('Usage: node scripts/add-avatar-from-png.mjs <id> <gender> <png-path>')
  console.error('Example: node scripts/add-avatar-from-png.mjs osmar male _private/osmar.png')
  process.exit(1)
}

const result = await importAvatarFromPng({
  id,
  gender,
  pngPath: path.resolve(pngPath),
})

console.log('Wrote', result.outPath)
console.log(result.stats)

const indexPath = registerFirstAvatar(id)
console.log('Registered in', indexPath)

const validate = spawnSync('node', ['scripts/validate-avatars.mjs'], { stdio: 'inherit' })
if (validate.status !== 0) process.exit(validate.status ?? 1)

console.log(`OK: avatar "${id}" pronto. Rode npm run build (ou npm run website) para ver.`)
