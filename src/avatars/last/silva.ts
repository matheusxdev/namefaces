import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const silva: AvatarDefinition = {
  id: 'silva',
  gender: 'neutral',
  svg: createAvatarSvg({
    hair: [
      '<path d="M22 35c2-13 11-21 18-21s16 8 18 21c-5-7-11-9-18-9s-13 2-18 9z"/>',
      '<path d="M24 48c-1 4 0 8 2 10 2-3 3-6 3-6s-3-2-5-4z"/>',
      '<path d="M56 48c1 4 0 8-2 10-2-3-3-6-3-6s3-2 5-4z"/>',
    ].join(''),
    skin: [
      '<ellipse cx="40" cy="44" rx="17" ry="20"/>',
      '<path d="M23 42c-2 1-3 4-2 6 2-1 3-3 3-4z"/>',
      '<path d="M57 42c2 1 3 4 2 6-2-1-3-3-3-4z"/>',
      '<path d="M34 62c2 4 10 4 12 0"/>',
    ].join(''),
    features: [
      '<circle cx="33" cy="42" r="1.6" stroke="none"/>',
      '<circle cx="47" cy="42" r="1.6" stroke="none"/>',
      '<path d="M31 37c2-1 4-1 5 0" fill="none" stroke-width="1.4"/>',
      '<path d="M44 37c2-1 4-1 5 0" fill="none" stroke-width="1.4"/>',
      '<path d="M39 46c1 1 2 2 3 1" fill="none" stroke-width="1.5"/>',
      '<path d="M35 52c3 1 7 1 10 0" fill="none" stroke-width="1.5"/>',
    ].join(''),
  }),
}
