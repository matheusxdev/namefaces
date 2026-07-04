import type { CSSProperties } from 'react'
import { getAvatar } from '../getAvatar'
import type { AvatarOptions } from '../types'

export interface NameFaceProps extends AvatarOptions {
  name: string
  className?: string
  title?: string
  as?: 'svg' | 'img'
  style?: CSSProperties
}

export function NameFace({
  name,
  as = 'svg',
  className,
  title,
  style,
  ...options
}: NameFaceProps) {
  const avatar = getAvatar(name, options)
  const label = title ?? name

  if (as === 'img') {
    return (
      <img
        src={avatar.dataUri}
        width={avatar.size}
        height={avatar.size}
        alt={label}
        className={className}
        style={style}
      />
    )
  }

  return (
    <span
      className={className}
      role="img"
      aria-label={label}
      style={{
        display: 'inline-block',
        width: avatar.size,
        height: avatar.size,
        lineHeight: 0,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: avatar.svg }}
    />
  )
}
