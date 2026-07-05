import { listKnownNames, type AvatarMode } from 'namefaces'

export type GalleryEntry = {
  id: string
  name: string
  displayName: string
  mode: AvatarMode
  typeLabel: string
}

export type GallerySort = 'az' | 'za' | 'type'

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getGalleryEntries(): GalleryEntry[] {
  const { first, last, full } = listKnownNames()

  const entries: GalleryEntry[] = [
    ...first.map((name) => ({
      id: `first:${name}`,
      name,
      displayName: capitalize(name),
      mode: 'first' as const,
      typeLabel: 'Primeiro nome',
    })),
    ...last.map((name) => ({
      id: `last:${name}`,
      name,
      displayName: capitalize(name),
      mode: 'last' as const,
      typeLabel: 'Sobrenome',
    })),
    ...full.map((name) => ({
      id: `full:${name}`,
      name,
      displayName: capitalize(name),
      mode: 'full' as const,
      typeLabel: 'Nome completo',
    })),
  ]

  return sortEntries(entries, 'az')
}

export function sortEntries(
  entries: GalleryEntry[],
  sort: GallerySort,
): GalleryEntry[] {
  const next = [...entries]

  if (sort === 'za') {
    return next.sort((a, b) =>
      b.displayName.localeCompare(a.displayName, 'pt-BR'),
    )
  }

  if (sort === 'type') {
    const order = { first: 0, last: 1, full: 2 } as const
    return next.sort((a, b) => {
      const byType = order[a.mode] - order[b.mode]
      if (byType !== 0) return byType
      return a.displayName.localeCompare(b.displayName, 'pt-BR')
    })
  }

  return next.sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'pt-BR'),
  )
}

export function filterEntries(
  entries: GalleryEntry[],
  query: string,
  mode: AvatarMode | 'all',
): GalleryEntry[] {
  const normalized = query.trim().toLowerCase()

  return entries.filter((entry) => {
    const matchesMode = mode === 'all' || entry.mode === mode
    if (!matchesMode) return false
    if (!normalized) return true

    return (
      entry.name.includes(normalized) ||
      entry.displayName.toLowerCase().includes(normalized) ||
      entry.typeLabel.toLowerCase().includes(normalized)
    )
  })
}

export function countByMode(entries: GalleryEntry[]) {
  return {
    all: entries.length,
    first: entries.filter((entry) => entry.mode === 'first').length,
    last: entries.filter((entry) => entry.mode === 'last').length,
    full: entries.filter((entry) => entry.mode === 'full').length,
  }
}
