import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const pool4: AvatarDefinition = {
  id: 'pool-4',
  gender: 'neutral',
  svg: createAvatarSvg({
    hair: [
      '<path d="M21 30c2-12 12-20 19-20s17 8 19 20v22c-3 2-7 1-9-2V34c0-5-4-8-10-8s-10 3-10 8v16c-2 3-6 4-9 2V30z"/>',
    ].join(''),
    skin: [
      '<ellipse cx="40" cy="44" rx="15" ry="18"/>',
      '<path d="M25 42c-2 1-3 3-2 5 1-1 2-2 2-3z"/>',
      '<path d="M55 42c2 1 3 3 2 5-1-1-2-2-2-3z"/>',
      '<path d="M34 60c2 3 10 3 12 0"/>',
    ].join(''),
    features: [
      '<circle cx="33" cy="42" r="1.4" stroke="none"/>',
      '<circle cx="47" cy="42" r="1.4" stroke="none"/>',
      '<path d="M30 37c2-1 5-1 6 0" fill="none" stroke-width="1.2"/>',
      '<path d="M44 37c2-1 5-1 6 0" fill="none" stroke-width="1.2"/>',
      '<path d="M39 45c1 2 2 3 3 2" fill="none" stroke-width="1.3"/>',
      '<path d="M36 51c3 2 7 2 8 0" fill="none" stroke-width="1.3"/>',
      '<circle cx="24" cy="46" r="1.2" fill="none" stroke-width="1.1"/>',
      '<circle cx="56" cy="46" r="1.2" fill="none" stroke-width="1.1"/>',
    ].join(''),
  }),
}
