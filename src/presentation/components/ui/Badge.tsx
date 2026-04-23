import React from 'react';

type BadgeTone = 'neutral' | 'gold' | 'brown' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  style?: React.CSSProperties;
}

const tones: Record<BadgeTone, { bg: string; fg: string; br: string }> = {
  neutral: { bg: 'var(--bq-paper-100)', fg: 'var(--bq-paper-600)', br: 'var(--bq-paper-200)' },
  gold:    { bg: 'var(--bq-gold-50)',   fg: 'var(--bq-gold-500)',  br: 'var(--bq-gold-200)' },
  brown:   { bg: 'var(--bq-brown-50)',  fg: 'var(--bq-brown-500)', br: 'var(--bq-brown-100)' },
  success: { bg: '#E8F0E3', fg: 'var(--bq-success)', br: '#C6D8BC' },
  warning: { bg: '#F7EAD0', fg: 'var(--bq-warning)', br: '#ECD49E' },
};

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral', style }) => {
  const t = tones[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 9px',
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.br}`,
        borderRadius: 'var(--bq-radius-full)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </span>
  );
};
