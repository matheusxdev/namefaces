import {
  extractInitials,
  getAvatar,
  getAvatarDataUri,
  getAvatarSvg,
  hasAvatar,
  listKnownNames,
} from '../dist/index.js'

console.log('hasAvatar Matheus', hasAvatar('Matheus Silva'))
console.log('hasAvatar raro', hasAvatar('NomeRaro'))
console.log('names', listKnownNames())

const colored = getAvatar('Yasmin', { hair: '#4C1D95', size: 40 })
console.log('colored', colored.matched, colored.render, colored.size)

const joao = getAvatarSvg('João')
console.log('joao size', joao.includes('width="80"'))

console.log('last mode', getAvatar('Matheus Silva', { mode: 'last' }).id)
console.log('dataUri', getAvatarDataUri('Ana').startsWith('data:image/svg+xml'))

const fallback = getAvatar('NomeRaro')
console.log('fallback render', fallback.render, fallback.initials, fallback.id)

console.log('initials M', extractInitials('Matheus'))
console.log('initials MO', extractInitials('Matheus Oliveira'))
console.log('forced initials', getAvatar('Matheus', { kind: 'initials' }).initials)
console.log('pool fallback', getAvatar('NomeRaro', { kind: 'face', fallback: 'pool' }).render)
