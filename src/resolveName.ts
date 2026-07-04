import {
  firstAvatars,
  fullAvatars,
  lastAvatars,
  poolAvatars,
} from './avatars'
import { stableHash } from './hash'
import { splitName } from './normalizeName'
import type { AvatarDefinition, AvatarMode } from './types'

export interface ResolvedName {
  key: string
  mode: AvatarMode
  matched: boolean
  avatar: AvatarDefinition
}

function getFirstKey(parts: string[]): string | null {
  return parts[0] ?? null
}

function getLastKey(parts: string[]): string | null {
  if (parts.length < 2) {
    return null
  }

  return parts[parts.length - 1] ?? null
}

function getFullKey(parts: string[]): string | null {
  if (parts.length < 2) {
    return null
  }

  return parts.join('-')
}

function fromPool(seed: string): AvatarDefinition {
  const index = stableHash(seed) % poolAvatars.length
  return poolAvatars[index] ?? poolAvatars[0]
}

function lookupFirst(key: string): AvatarDefinition | undefined {
  return firstAvatars[key]
}

function lookupLast(key: string): AvatarDefinition | undefined {
  return lastAvatars[key]
}

function lookupFull(key: string): AvatarDefinition | undefined {
  return fullAvatars[key]
}

function resolveFirst(parts: string[]): ResolvedName {
  const key = getFirstKey(parts)

  if (!key) {
    const avatar = fromPool('unknown')
    return { key: avatar.id, mode: 'first', matched: false, avatar }
  }

  const avatar = lookupFirst(key)
  if (avatar) {
    return { key, mode: 'first', matched: true, avatar }
  }

  return { key, mode: 'first', matched: false, avatar: fromPool(key) }
}

function resolveLast(parts: string[]): ResolvedName {
  const key = getLastKey(parts) ?? getFirstKey(parts)

  if (!key) {
    const avatar = fromPool('unknown')
    return { key: avatar.id, mode: 'last', matched: false, avatar }
  }

  const avatar = lookupLast(key)
  if (avatar) {
    return { key, mode: 'last', matched: true, avatar }
  }

  return { key, mode: 'last', matched: false, avatar: fromPool(`last:${key}`) }
}

function resolveFull(parts: string[]): ResolvedName {
  const fullKey = getFullKey(parts)

  if (fullKey) {
    const avatar = lookupFull(fullKey)
    if (avatar) {
      return { key: fullKey, mode: 'full', matched: true, avatar }
    }
  }

  return resolveFirst(parts)
}

function resolveAuto(parts: string[]): ResolvedName {
  const fullKey = getFullKey(parts)
  if (fullKey) {
    const fullAvatar = lookupFull(fullKey)
    if (fullAvatar) {
      return { key: fullKey, mode: 'full', matched: true, avatar: fullAvatar }
    }
  }

  const firstKey = getFirstKey(parts)
  if (firstKey) {
    const firstAvatar = lookupFirst(firstKey)
    if (firstAvatar) {
      return { key: firstKey, mode: 'first', matched: true, avatar: firstAvatar }
    }
  }

  const lastKey = getLastKey(parts)
  if (lastKey) {
    const lastAvatar = lookupLast(lastKey)
    if (lastAvatar) {
      return { key: lastKey, mode: 'last', matched: true, avatar: lastAvatar }
    }
  }

  const seed = parts.join('-') || 'unknown'
  return {
    key: seed,
    mode: 'auto',
    matched: false,
    avatar: fromPool(seed),
  }
}

export function resolveName(
  input: string,
  mode: AvatarMode = 'first',
): ResolvedName {
  const parts = splitName(input)

  switch (mode) {
    case 'last':
      return resolveLast(parts)
    case 'full':
      return resolveFull(parts)
    case 'auto':
      return resolveAuto(parts)
    case 'first':
    default:
      return resolveFirst(parts)
  }
}

export function hasNamedAvatar(
  input: string,
  mode: AvatarMode = 'first',
): boolean {
  return resolveName(input, mode).matched
}

export function listKnownNames(): {
  first: string[]
  last: string[]
  full: string[]
} {
  return {
    first: Object.keys(firstAvatars).sort(),
    last: Object.keys(lastAvatars).sort(),
    full: Object.keys(fullAvatars).sort(),
  }
}
