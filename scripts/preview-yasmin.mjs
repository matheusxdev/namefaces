import { writeFileSync } from 'node:fs'
import { getAvatarSvg, hasAvatar } from '../dist/index.js'

const svg = getAvatarSvg('Yasmin', { size: 240 })
writeFileSync(new URL('./yasmin-preview.svg', import.meta.url), svg)
console.log('hasAvatar', hasAvatar('Yasmin'))
console.log('bytes', svg.length)
