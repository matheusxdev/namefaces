import {
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
console.log('colored', colored.matched, colored.size, colored.colors.hair)

const joao = getAvatarSvg('João')
console.log('joao size', joao.includes('width="80"'))

console.log('last mode', getAvatar('Matheus Silva', { mode: 'last' }).id)
console.log('dataUri', getAvatarDataUri('Ana').startsWith('data:image/svg+xml'))
console.log('fallback id', getAvatar('NomeRaro').id)
