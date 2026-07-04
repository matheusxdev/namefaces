const ACCENT_MAP: Record<string, string> = {
  á: 'a',
  à: 'a',
  â: 'a',
  ã: 'a',
  ä: 'a',
  é: 'e',
  è: 'e',
  ê: 'e',
  ë: 'e',
  í: 'i',
  ì: 'i',
  î: 'i',
  ï: 'i',
  ó: 'o',
  ò: 'o',
  ô: 'o',
  õ: 'o',
  ö: 'o',
  ú: 'u',
  ù: 'u',
  û: 'u',
  ü: 'u',
  ç: 'c',
  ñ: 'n',
  ý: 'y',
  ÿ: 'y',
}

export function stripAccents(value: string): string {
  return value
    .split('')
    .map((char) => ACCENT_MAP[char] ?? ACCENT_MAP[char.toLowerCase()] ?? char)
    .join('')
}

export function normalizeToken(value: string): string {
  return stripAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

export function splitName(input: string): string[] {
  return input
    .trim()
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean)
}
