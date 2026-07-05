import {
  applyColors,
  applySize,
  resolveColors,
  resolveSize,
  toDataUri,
} from './applyColors'
import {
  createInitialsSvg,
  extractInitials,
  resolveInitialsStyle,
} from './initials'
import { hasNamedAvatar, listKnownNames, resolveName } from './resolveName'
import type {
  AvatarFallback,
  AvatarKind,
  AvatarOptions,
  AvatarRender,
  AvatarResult,
} from './types'
import { DEFAULT_FALLBACK, DEFAULT_KIND } from './types'

function buildFaceResult(
  input: string,
  options: AvatarOptions,
  render: Extract<AvatarRender, 'face' | 'pool'>,
): AvatarResult {
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
    render,
    gender: resolved.avatar.gender,
    svg,
    dataUri: toDataUri(svg),
    size,
    colors,
  }
}

function buildInitialsResult(
  input: string,
  options: AvatarOptions,
): AvatarResult {
  const mode = options.mode ?? 'first'
  const size = resolveSize(options)
  const colors = resolveColors(options)
  const initials = extractInitials(input)
  const style = resolveInitialsStyle({
    background: colors.background,
    text: colors.text,
    features: colors.features,
    font: options.font,
  })
  const svg = applySize(createInitialsSvg(initials, style), size)
  const matched = hasNamedAvatar(input, mode)

  return {
    id: 'initials',
    key: initials.toLowerCase(),
    mode,
    matched,
    render: 'initials',
    initials,
    gender: 'neutral',
    svg,
    dataUri: toDataUri(svg),
    size,
    colors,
  }
}

function resolveKind(options: AvatarOptions): AvatarKind {
  return options.kind ?? DEFAULT_KIND
}

function resolveFallback(options: AvatarOptions): AvatarFallback {
  return options.fallback ?? DEFAULT_FALLBACK
}

function buildResult(input: string, options: AvatarOptions = {}): AvatarResult {
  const kind = resolveKind(options)
  const mode = options.mode ?? 'first'
  const matched = hasNamedAvatar(input, mode)

  if (kind === 'initials') {
    return buildInitialsResult(input, options)
  }

  if (kind === 'face') {
    if (matched) {
      return buildFaceResult(input, options, 'face')
    }

    if (resolveFallback(options) === 'pool') {
      return buildFaceResult(input, options, 'pool')
    }

    return buildInitialsResult(input, options)
  }

  // kind === 'auto'
  if (matched) {
    return buildFaceResult(input, options, 'face')
  }

  return buildInitialsResult(input, options)
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
