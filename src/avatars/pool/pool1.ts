import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const pool1: AvatarDefinition = {
  id: 'pool-1',
  gender: 'neutral',
  svg: createAvatarSvg({
    hair: [
      '<path d="M24 36c1-11 9-18 16-18s15 7 16 18c-4-5-9-7-16-7s-12 2-16 7z"/>',
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
      '<path d="M36 52c2 1 6 1 8 0" fill="none" stroke-width="1.4"/>',
    ].join(''),
  }),
}
