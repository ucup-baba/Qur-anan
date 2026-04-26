'use client';

import React, { useState } from 'react';

interface UserAvatarProps {
  photoURL?: string | null;
  displayName?: string | null;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function UserAvatar({ photoURL, displayName, size = 40, className = '', style }: UserAvatarProps) {
  const [failed, setFailed] = useState(false);

  const initials = displayName
    ? displayName.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const fontSize = Math.round(size * 0.36);

  if (photoURL && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoURL}
        alt={displayName || 'Profil'}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className={className}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', display: 'block',
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--bq-brown-400), var(--bq-brown-600))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize, fontWeight: 700, flexShrink: 0,
        userSelect: 'none',
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
