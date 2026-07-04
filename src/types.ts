export type AvatarMode = 'first' | 'last' | 'full' | 'auto'

export type AvatarGender = 'male' | 'female' | 'neutral'

export interface AvatarColors {
  background?: string
  hair?: string
  skin?: string
  features?: string
}

export interface AvatarOptions extends AvatarColors {
  size?: number
  mode?: AvatarMode
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
}

export const DEFAULT_SIZE = 80
