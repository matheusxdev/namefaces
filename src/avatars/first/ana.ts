import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const ana: AvatarDefinition = {
  id: 'ana',
  gender: 'female',
  svg: createAvatarSvg({
    hair: [
      '<path d="M20 28c2-12 11-20 20-20s18 8 20 20v28c-4 2-8 1-10-2V36c0-6-4-10-10-10s-10 4-10 10v18c-2 3-6 4-10 2V28z"/>',
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
      '<path d="M30 37c2-1 5-1 6 0" fill="none" stroke-width="1.3"/>',
      '<path d="M44 37c2-1 5-1 6 0" fill="none" stroke-width="1.3"/>',
      '<path d="M39 45c1 2 2 3 3 2" fill="none" stroke-width="1.4"/>',
      '<path d="M36 51c2 2 6 2 8 0" fill="none" stroke-width="1.4"/>',
      '<circle cx="23" cy="46" r="1.4" fill="none" stroke-width="1.2"/>',
      '<circle cx="57" cy="46" r="1.4" fill="none" stroke-width="1.2"/>',
    ].join(''),
  }),
}
