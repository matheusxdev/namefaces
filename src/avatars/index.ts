import type { AvatarDefinition } from '../types'
import { ana } from './first/ana'
import { bruna } from './first/bruna'
import { clevison } from './first/clevison'
import { filipe } from './first/filipe'
import { gabriel } from './first/gabriel'
import { joao } from './first/joao'
import { jose } from './first/jose'
import { junior } from './first/junior'
import { leandro } from './first/leandro'
import { lucas } from './first/lucas'
import { marco } from './first/marco'
import { marcelo } from './first/marcelo'
import { maria } from './first/maria'
import { matheus } from './first/matheus'
import { rafael } from './first/rafael'
import { vitinho } from './first/vitinho'
import { isabelle } from './first/isabelle'
import { isaac } from './first/isaac'
import { yasmin } from './first/yasmin'
import { pool1 } from './pool/pool1'
import { pool2 } from './pool/pool2'
import { pool3 } from './pool/pool3'
import { pool4 } from './pool/pool4'

export const firstAvatars: Record<string, AvatarDefinition> = {
  ana,
  bruna,
  clevison,
  filipe,
  gabriel,
  joao,
  jose,
  junior,
  leandro,
  lucas,
  marco,
  marcelo,
  maria,
  matheus,
  rafael,
  vitinho,
  isabelle,
  isaac,
  yasmin,
}

export const lastAvatars: Record<string, AvatarDefinition> = {}

export const fullAvatars: Record<string, AvatarDefinition> = {}

export const poolAvatars: AvatarDefinition[] = [pool1, pool2, pool3, pool4]

export const allNamedAvatars: AvatarDefinition[] = [
  ...Object.values(firstAvatars),
  ...Object.values(lastAvatars),
  ...Object.values(fullAvatars),
]
