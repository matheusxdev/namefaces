import { splitName } from './normalizeName'
import { DEFAULT_COLORS } from './types'

export const INITIALS_FONTS = {
  brand: '"Fraunces", Georgia, "Times New Roman", serif',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
  rounded: 'system-ui, "Segoe UI", sans-serif',
} as const

export type InitialsFont = keyof typeof INITIALS_FONTS

export const DEFAULT_INITIALS_FONT: InitialsFont = 'brand'

export interface InitialsStyle {
  background: string
  text: string
  font: string
}

export function extractInitials(input: string): string {
  const parts = splitName(input)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  const first = parts[0].charAt(0)
  const last = parts[parts.length - 1].charAt(0)
  return `${first}${last}`.toUpperCase()
}

export function resolveInitialsFont(font?: InitialsFont | string): string {
  if (!font) {
    return INITIALS_FONTS[DEFAULT_INITIALS_FONT]
  }

  if (font in INITIALS_FONTS) {
    return INITIALS_FONTS[font as InitialsFont]
  }

  return font
}

export function resolveInitialsStyle(options: {
  background?: string
  text?: string
  features?: string
  font?: InitialsFont | string
}): InitialsStyle {
  return {
    background: options.background ?? DEFAULT_COLORS.background,
    text: options.text ?? options.features ?? DEFAULT_COLORS.features,
    font: resolveInitialsFont(options.font),
  }
}

export function createInitialsSvg(
  initials: string,
  style: InitialsStyle,
): string {
  const label = initials || '?'
  const fontSize = label.length > 1 ? 28 : 36
  const safeLabel = label
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

  return [
    `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${safeLabel}">`,
    `<circle data-part="background" cx="40" cy="40" r="40" fill="${style.background}"/>`,
    `<text data-part="initials" x="40" y="42" text-anchor="middle" dominant-baseline="middle"`,
    ` font-family="${style.font}" font-size="${fontSize}" font-weight="600" letter-spacing="-0.04em"`,
    ` fill="${style.text}" stroke="${style.text}" stroke-width="1.6"`,
    ` stroke-linecap="round" stroke-linejoin="round" paint-order="stroke fill">${safeLabel}</text>`,
    '</svg>',
  ].join('')
}
