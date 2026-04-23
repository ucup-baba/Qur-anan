import React from 'react';
import { Icon, Icons } from '../icons';

interface SurahListItemProps {
  num: number;
  name: string;        // Arabic
  transliteration: string;
  meaning: string;
  ayatCount: number;
  revelation: string;
  bookmarked?: boolean;
  onClick?: () => void;
}

export const SurahListItem: React.FC<SurahListItemProps> = ({
  num, name, transliteration, meaning, ayatCount, revelation, bookmarked, onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      display: 'grid',
      gridTemplateColumns: '44px 1fr auto',
      gap: 14,
      alignItems: 'center',
      padding: '14px 16px',
      background: 'var(--bq-paper-50)',
      border: '1px solid var(--bq-paper-200)',
      borderRadius: 'var(--bq-radius-md)',
      cursor: 'pointer',
      transition: 'all var(--bq-dur-fast)',
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'><polygon points='22,2 40,13 40,31 22,42 4,31 4,13' fill='none' stroke='%23C9A24E' stroke-width='1.4'/></svg>")`,
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--bq-brown-500)',
        fontFamily: 'var(--bq-font-mono)',
      }}
    >
      {num}
    </div>
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--bq-paper-800)' }}>
          {transliteration}
        </span>
        <span style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>· {meaning}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--bq-paper-500)' }}>
        {revelation} · {ayatCount} ayat
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {bookmarked && <Icon d={Icons.Bookmark} size={16} style={{ color: 'var(--bq-gold-400)' }} />}
      <span className="bq-arabic" style={{ fontSize: 26, color: 'var(--bq-paper-800)', lineHeight: 1 }}>
        {name}
      </span>
    </div>
  </div>
);
