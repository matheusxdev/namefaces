import {
  applyColors,
  applySize,
  resolveColors,
  resolveSize,
  toDataUri,
} from './applyColors'
import { hasNamedAvatar, listKnownNames, resolveName } from './resolveName'
import type { AvatarOptions, AvatarResult } from './types'

function buildResult(input: string, options: AvatarOptions = {}): AvatarResult {
  const mode = options.mode ?? 'first'
  const size = resolveSize(options)
  const colors = resolveColors(options)
  const resolved = resolveName(input, mode)
  const colored = applyColors(resolved.avatar.svg, colors)
  const svg = applySize(colored, size)

  return {
    id: resolved.avatar.id,
    key: resolved.key,
    mode: resolved.mode,
    matched: resolved.matched,
    gender: resolved.avatar.gender,
    svg,
    dataUri: toDataUri(svg),
    size,
    colors,
  }
}

export function getAvatar(input: string, options?: AvatarOptions): AvatarResult {
  return buildResult(input, options)
}

export function getAvatarSvg(input: string, options?: AvatarOptions): string {
  return buildResult(input, options).svg
}

export function getAvatarDataUri(input: string, options?: AvatarOptions): string {
  return buildResult(input, options).dataUri
}

export function hasAvatar(input: string, options?: Pick<AvatarOptions, 'mode'>): boolean {
  return hasNamedAvatar(input, options?.mode ?? 'first')
}

export { listKnownNames }
