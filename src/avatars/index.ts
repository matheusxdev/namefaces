import type { AvatarDefinition } from '../types'
import { ana } from './first/ana'
import { bruna } from './first/bruna'
import { clevison } from './first/clevison'
import { joao } from './first/joao'
import { marcelo } from './first/marcelo'
import { maria } from './first/maria'
import { matheus } from './first/matheus'
import { yasmin } from './first/yasmin'
import { silva } from './last/silva'
import { pool1 } from './pool/pool1'
import { pool2 } from './pool/pool2'
import { pool3 } from './pool/pool3'
import { pool4 } from './pool/pool4'

export const firstAvatars: Record<string, AvatarDefinition> = {
  ana,
  bruna,
  clevison,
  joao,
  marcelo,
  maria,
  matheus,
  yasmin,
}

export const lastAvatars: Record<string, AvatarDefinition> = {
  silva,
}

export const fullAvatars: Record<string, AvatarDefinition> = {}

export const poolAvatars: AvatarDefinition[] = [pool1, pool2, pool3, pool4]

export const allNamedAvatars: AvatarDefinition[] = [
  ...Object.values(firstAvatars),
  ...Object.values(lastAvatars),
  ...Object.values(fullAvatars),
]
