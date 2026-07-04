export function createAvatarSvg(parts: {
  hair: string
  skin: string
  features: string
}): string {
  return [
    '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avatar">',
    '<circle data-part="background" cx="40" cy="40" r="40" fill="{{background}}"/>',
    `<g data-part="hair" fill="{{hair}}">${parts.hair}</g>`,
    `<g data-part="skin" fill="{{skin}}">${parts.skin}</g>`,
    `<g data-part="features" fill="{{features}}" stroke="{{features}}" stroke-linecap="round" stroke-linejoin="round">${parts.features}</g>`,
    '</svg>',
  ].join('')
}
