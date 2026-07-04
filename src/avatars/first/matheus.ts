import type { AvatarDefinition } from '../../types'
import { createAvatarSvg } from '../shell'

export const matheus: AvatarDefinition = {
  id: 'matheus',
  gender: 'male',
  svg: createAvatarSvg({
    hair: [
      '<path d="M22 34c1-14 10-22 18-22s17 8 18 22c0 0-3-8-18-8S22 34 22 34z"/>',
      '<path d="M21 36c-1 4-1 9 0 12 2-5 4-9 4-9s-2-2-4-3z"/>',
      '<path d="M59 36c1 4 1 9 0 12-2-5-4-9-4-9s2-2 4-3z"/>',
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
      '<path d="M39 45c1 2 2 3 3 2" fill="none" stroke-width="1.5"/>',
      '<path d="M36 52c2 2 6 2 8 0" fill="none" stroke-width="1.5"/>',
    ].join(''),
  }),
}
