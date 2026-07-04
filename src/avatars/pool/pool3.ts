import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const pool3: AvatarDefinition = {
  id: 'pool-3',
  gender: 'neutral',
  svg: createAvatarSvg({
    hair: [
      '<path d="M25 38c0-12 8-20 15-20s15 8 15 20c-3-4-8-6-15-6s-12 2-15 6z"/>',
      '<path d="M28 52c0 2 1 4 2 5 1-2 2-4 2-4s-2-1-4-1z"/>',
    ].join(''),
    skin: [
      '<ellipse cx="40" cy="44" rx="16" ry="19"/>',
      '<path d="M24 42c-2 1-3 3-2 5 1-1 2-2 2-3z"/>',
      '<path d="M56 42c2 1 3 3 2 5-1-1-2-2-2-3z"/>',
      '<path d="M34 61c2 3 10 3 12 0"/>',
    ].join(''),
    features: [
      '<circle cx="33" cy="42" r="1.5" stroke="none"/>',
      '<circle cx="47" cy="42" r="1.5" stroke="none"/>',
      '<path d="M39 46c1 1 2 2 3 1" fill="none" stroke-width="1.4"/>',
      '<path d="M35 53c3 0 7 0 10 0" fill="none" stroke-width="1.4"/>',
    ].join(''),
  }),
}
