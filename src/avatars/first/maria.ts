import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const maria: AvatarDefinition = {
  id: 'maria',
  gender: 'female',
  svg: createAvatarSvg({
    hair: [
      '<path d="M22 34c2-14 11-22 18-22s16 8 18 22c-3-5-9-8-18-8s-15 3-18 8z"/>',
      '<circle cx="40" cy="18" r="7"/>',
      '<path d="M20 40c-1 8 0 16 3 20 3-3 5-8 5-8s-5-6-8-12z"/>',
      '<path d="M60 40c1 8 0 16-3 20-3-3-5-8-5-8s5-6 8-12z"/>',
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
      '<path d="M36 51c3 3 7 2 8-1" fill="none" stroke-width="1.4"/>',
    ].join(''),
  }),
}
