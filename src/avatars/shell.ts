const COPYRIGHT_NOTICE =
  'Copyright (c) 2026 namefaces / matheusxdev. Artwork licensed under the namefaces package LICENSE.'

/** Stable fingerprint on the root svg. Travels with copied SVG source. */
export const AVATAR_FINGERPRINT = 'namefaces/matheusxdev/2026'

/**
 * Authorship that stays in the SVG string. Not painted in the 80×80 viewBox:
 * metadata/desc are not rendered, and the signature geometry sits outside the
 * viewBox (root overflow=hidden clips it). Not opacity:0 — optimizers strip that.
 */
const COPYRIGHT_MARKUP = [
  '<metadata>',
  '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/">',
  '<rdf:Description>',
  '<dc:creator>matheusxdev</dc:creator>',
  '<dc:publisher>namefaces</dc:publisher>',
  `<dc:rights>${COPYRIGHT_NOTICE}</dc:rights>`,
  '<dc:date>2026</dc:date>',
  '</rdf:Description>',
  '</rdf:RDF>',
  '</metadata>',
  `<desc>${COPYRIGHT_NOTICE}</desc>`,
  '<g data-namefaces-mark="copyright" aria-hidden="true">',
  '<path d="M120 120h8v8h-8z" fill="#111"/>',
  `<text x="132" y="128" font-size="6" fill="#111">${COPYRIGHT_NOTICE}</text>`,
  '</g>',
].join('')

/** ariaLabel is inserted as-is; callers must escape it. */
export function wrapAvatarSvg(ariaLabel: string, body: string): string {
  return [
    `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" overflow="hidden" role="img" aria-label="${ariaLabel}" data-namefaces="${AVATAR_FINGERPRINT}">`,
    COPYRIGHT_MARKUP,
    body,
    '</svg>',
  ].join('')
}

export function createAvatarSvg(parts: {
  hair: string
  skin: string
  features: string
}): string {
  return wrapAvatarSvg(
    'Avatar',
    [
      '<circle data-part="background" cx="40" cy="40" r="40" fill="{{background}}"/>',
      `<g data-part="hair" fill="{{hair}}">${parts.hair}</g>`,
      `<g data-part="skin" fill="{{skin}}">${parts.skin}</g>`,
      `<g data-part="features" fill="{{features}}" stroke="{{features}}" stroke-linecap="round" stroke-linejoin="round">${parts.features}</g>`,
    ].join(''),
  )
}
