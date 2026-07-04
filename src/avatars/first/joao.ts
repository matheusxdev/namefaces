import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const joao: AvatarDefinition = {
  id: 'joao',
  gender: 'male',
  svg: createAvatarSvg({
    hair: [
      '<path d="M23 36c1-12 9-20 17-20s16 8 17 20c-4-6-10-8-17-8s-13 2-17 8z"/>',
    ].join(''),
    skin: [
      '<ellipse cx="40" cy="44" rx="17" ry="20"/>',
      '<path d="M23 42c-2 1-3 4-2 6 2-1 3-3 3-4z"/>',
      '<path d="M57 42c2 1 3 4 2 6-2-1-3-3-3-4z"/>',
      '<path d="M34 62c2 4 10 4 12 0"/>',
    ].join(''),
    features: [
      '<circle cx="33" cy="42" r="1.5" stroke="none"/>',
      '<circle cx="47" cy="42" r="1.5" stroke="none"/>',
      '<path d="M31 37c2-1 4-1 5 0" fill="none" stroke-width="1.3"/>',
      '<path d="M44 37c2-1 4-1 5 0" fill="none" stroke-width="1.3"/>',
      '<circle cx="33" cy="42" r="5" fill="none" stroke-width="1.4"/>',
      '<circle cx="47" cy="42" r="5" fill="none" stroke-width="1.4"/>',
      '<path d="M38 42h4" fill="none" stroke-width="1.4"/>',
      '<path d="M39 46c1 2 2 3 3 2" fill="none" stroke-width="1.4"/>',
      '<path d="M36 52c2 2 6 2 8 0" fill="none" stroke-width="1.4"/>',
    ].join(''),
  }),
}
