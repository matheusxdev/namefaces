import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const pool2: AvatarDefinition = {
  id: 'pool-2',
  gender: 'neutral',
  svg: createAvatarSvg({
    hair: [
      '<path d="M20 32c3-12 12-20 20-20s17 8 20 20c1 10-1 20-4 24-4 1-7-1-8-4-2 4-6 6-10 5-4-1-7-5-8-9-4 3-8 2-10-1-3-5-2-12 0-15z"/>',
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
      '<path d="M31 37c2-1 4-1 5 0" fill="none" stroke-width="1.2"/>',
      '<path d="M44 37c2-1 4-1 5 0" fill="none" stroke-width="1.2"/>',
      '<path d="M39 45c1 2 2 3 3 2" fill="none" stroke-width="1.3"/>',
      '<path d="M36 51c2 2 6 2 8 0" fill="none" stroke-width="1.3"/>',
    ].join(''),
  }),
}
