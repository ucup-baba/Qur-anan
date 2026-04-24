import React, { useState } from 'react';
import { Icon, Icons } from '../icons';

interface AyatCardProps {
  surah: string;
  ayat: number;
  arabic: string;
  translation: string;
  transliteration?: string;
  compact?: boolean;
  bookmarked?: boolean;
  onPlay?: () => void;
  onBookmark?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
}

export const AyatCard: React.FC<AyatCardProps> = ({
  surah, ayat, arabic, translation, transliteration, compact,
  bookmarked = false, onPlay, onBookmark, onCopy, onShare,
}) => {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleBookmark = () => {
    setIsBookmarked(v => !v);
    onBookmark?.();
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--bq-paper-200)',
        borderRadius: 'var(--bq-radius-lg)',
        padding: compact ? 20 : 32,
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
      className="ayat-card-hover"
    >
      {/* Top row: ayat number badge + action buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 16,
          marginBottom: 20,
          borderBottom: '1px solid var(--bq-paper-100)',
        }}
      >
        {/* Ayat badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px 5px 5px',
            background: 'var(--bq-brown-50)',
            border: '1px solid var(--bq-brown-100)',
            borderRadius: 'var(--bq-radius-full)',
          }}
        >
          <span
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--bq-brown-500), var(--bq-brown-400))',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, fontFamily: 'var(--bq-font-mono)',
            }}
          >
            {ayat}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-brown-600)' }}>
            {surah} · {ayat}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 2 }}>
          <ActionBtn onClick={onPlay} title="Putar">
            <Icon d={Icons.Play} size={15} />
          </ActionBtn>
          <ActionBtn onClick={handleBookmark} title="Bookmark" active={isBookmarked}>
            <Icon d={Icons.Bookmark} size={15} />
          </ActionBtn>
          <ActionBtn onClick={handleCopy} title="Salin" active={copied}>
            <Icon d={copied ? Icons.Check : Icons.Copy} size={15} />
          </ActionBtn>
          <ActionBtn onClick={onShare} title="Bagikan">
            <Icon d={Icons.Share} size={15} />
          </ActionBtn>
        </div>
      </div>

      {/* Arabic text */}
      <div
        className="bq-arabic"
        style={{
          fontSize: compact ? 36 : 46,
          color: 'var(--bq-paper-900)',
          textAlign: 'right',
          marginBottom: 22,
          lineHeight: 2.1,
          letterSpacing: '0.02em',
        }}
      >
        {arabic}
      </div>

      {/* Transliteration */}
      {transliteration && (
        <div style={{
          fontSize: 13,
          fontStyle: 'italic',
          color: 'var(--bq-paper-400)',
          marginBottom: 12,
          letterSpacing: 0.3,
          lineHeight: 1.6,
        }}>
          {transliteration}
        </div>
      )}

      {/* Translation */}
      <div style={{
        fontSize: compact ? 14 : 16,
        color: 'var(--bq-paper-600)',
        lineHeight: 1.75,
        borderLeft: '3px solid var(--bq-gold-300)',
        paddingLeft: 14,
      }}>
        {translation}
      </div>
    </div>
  );
};

// ─── Small action button ───
const ActionBtn: React.FC<{
  onClick?: () => void;
  title?: string;
  active?: boolean;
  children: React.ReactNode;
}> = ({ onClick, title, active, children }) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 32,
      height: 32,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: active ? 'var(--bq-brown-50)' : 'transparent',
      border: active ? '1px solid var(--bq-brown-200)' : '1px solid transparent',
      borderRadius: 'var(--bq-radius-sm)',
      cursor: 'pointer',
      color: active ? 'var(--bq-brown-500)' : 'var(--bq-paper-400)',
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => {
      if (!active) {
        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bq-paper-100)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--bq-paper-700)';
      }
    }}
    onMouseLeave={e => {
      if (!active) {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--bq-paper-400)';
      }
    }}
  >
    {children}
  </button>
);

export { ActionBtn };
