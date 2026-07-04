import {
  DEFAULT_COLORS,
  DEFAULT_SIZE,
  type AvatarColors,
  type AvatarOptions,
} from './types'

export function resolveColors(colors: AvatarColors = {}): Required<AvatarColors> {
  return {
    background: colors.background ?? DEFAULT_COLORS.background,
    hair: colors.hair ?? DEFAULT_COLORS.hair,
    skin: colors.skin ?? DEFAULT_COLORS.skin,
    features: colors.features ?? DEFAULT_COLORS.features,
  }
}

export function applyColors(template: string, colors: Required<AvatarColors>): string {
  return template
    .replace(/\{\{background\}\}/g, colors.background)
    .replace(/\{\{hair\}\}/g, colors.hair)
    .replace(/\{\{skin\}\}/g, colors.skin)
    .replace(/\{\{features\}\}/g, colors.features)
}

export function applySize(svg: string, size: number): string {
  if (/<svg\b[^>]*\bwidth="/.test(svg) || /<svg\b[^>]*\bheight="/.test(svg)) {
    return svg
      .replace(/(<svg\b[^>]*?)\swidth="[^"]*"/, `$1 width="${size}"`)
      .replace(/(<svg\b[^>]*?)\sheight="[^"]*"/, `$1 height="${size}"`)
  }

  return svg.replace(
    '<svg ',
    `<svg width="${size}" height="${size}" `,
  )
}

export function toDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22')

  return `data:image/svg+xml,${encoded}`
}

export function resolveSize(options: AvatarOptions = {}): number {
  const size = options.size ?? DEFAULT_SIZE
  return Number.isFinite(size) && size > 0 ? size : DEFAULT_SIZE
}
