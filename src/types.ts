import type { InitialsFont } from './initials'

export type AvatarMode = 'first' | 'last' | 'full' | 'auto'

export type AvatarGender = 'male' | 'female' | 'neutral'

/** Como escolher entre rosto e iniciais. */
export type AvatarKind = 'auto' | 'face' | 'initials'

/** Fallback quando não há rosto próprio e `kind` é `face`. */
export type AvatarFallback = 'initials' | 'pool'

/** O que foi renderizado de fato. */
export type AvatarRender = 'face' | 'initials' | 'pool'

export interface AvatarColors {
  background?: string
  hair?: string
  skin?: string
  features?: string
  /** Cor das iniciais (padrão: igual a `features`). */
  text?: string
}

export interface AvatarOptions extends AvatarColors {
  size?: number
  mode?: AvatarMode
  /**
   * `auto` — rosto se existir, senão iniciais (padrão)
   * `face` — tenta rosto; sem match usa `fallback`
   * `initials` — sempre iniciais
   */
  kind?: AvatarKind
  /** Usado só com `kind: 'face'`. Padrão: `initials`. */
  fallback?: AvatarFallback
  /** Fonte das iniciais: `brand`, `sans`, `rounded` ou CSS customizado. */
  font?: InitialsFont | string
}

export interface AvatarDefinition {
  id: string
  gender: AvatarGender
  svg: string
}

export interface AvatarResult {
  id: string
  key: string
  mode: AvatarMode
  matched: boolean
  render: AvatarRender
  initials?: string
  gender: AvatarGender
  svg: string
  dataUri: string
  size: number
  colors: Required<AvatarColors>
}

export const DEFAULT_COLORS: Required<AvatarColors> = {
  background: '#E8E8E8',
  hair: '#111111',
  skin: '#FFFFFF',
  features: '#111111',
  text: '#111111',
}

export const DEFAULT_SIZE = 80

export const DEFAULT_KIND: AvatarKind = 'auto'

export const DEFAULT_FALLBACK: AvatarFallback = 'initials'
