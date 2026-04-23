import React from 'react';
import { Icon, Icons } from '../icons';

const iconBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: 'var(--bq-radius-sm)',
  cursor: 'pointer',
  color: 'var(--bq-paper-500)',
  transition: 'all var(--bq-dur-fast)',
};

interface AyatCardProps {
  surah: string;
  ayat: number;
  arabic: string;
  translation: string;
  transliteration?: string;
  compact?: boolean;
  onPlay?: () => void;
  onBookmark?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
}

export const AyatCard: React.FC<AyatCardProps> = ({
  surah, ayat, arabic, translation, transliteration, compact,
  onPlay, onBookmark, onCopy, onShare,
}) => (
  <div
    style={{
      background: 'var(--bq-paper-50)',
      border: '1px solid var(--bq-paper-200)',
      borderRadius: 'var(--bq-radius-lg)',
      padding: compact ? 20 : 28,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 14,
        marginBottom: 18,
        borderBottom: '1px dashed var(--bq-paper-200)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 10px 4px 4px',
          background: 'var(--bq-brown-50)',
          borderRadius: 'var(--bq-radius-full)',
        }}
      >
        <span
          style={{
            width: 24, height: 24, borderRadius: '50%',
            background: 'var(--bq-brown-400)', color: 'var(--bq-paper-50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, fontFamily: 'var(--bq-font-mono)',
          }}
        >
          {ayat}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-brown-500)' }}>
          {surah} : {ayat}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4, color: 'var(--bq-paper-400)' }}>
        <button style={iconBtnStyle} onClick={onPlay}><Icon d={Icons.Play} size={14} /></button>
        <button style={iconBtnStyle} onClick={onBookmark}><Icon d={Icons.Bookmark} size={14} /></button>
        <button style={iconBtnStyle} onClick={onCopy}><Icon d={Icons.Copy} size={14} /></button>
        <button style={iconBtnStyle} onClick={onShare}><Icon d={Icons.Share} size={14} /></button>
      </div>
    </div>

    <div
      className="bq-arabic"
      style={{
        fontSize: compact ? 38 : 48,
        color: 'var(--bq-paper-800)',
        textAlign: 'right',
        marginBottom: 20,
        lineHeight: 2,
      }}
    >
      {arabic}
    </div>

    {transliteration && (
      <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--bq-paper-400)', marginBottom: 10, letterSpacing: 0.2 }}>
        {transliteration}
      </div>
    )}

    <div style={{ fontSize: compact ? 14 : 16, color: 'var(--bq-paper-600)', lineHeight: 1.6 }}>
      {translation}
    </div>
  </div>
);

export { iconBtnStyle };
