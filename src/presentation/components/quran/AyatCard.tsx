import React, { useMemo, useState } from 'react';
import { Icon, Icons } from '../icons';
import { segmentTajwid, TAJWID_COLORS } from '@/infrastructure/utils/tajwid';

interface AyatCardProps {
  surah: string;
  ayat: number;
  arabic: string;
  translation: string;
  transliteration?: string;
  compact?: boolean;
  bookmarked?: boolean;
  isPlaying?: boolean;
  tajwid?: boolean;
  onPlay?: () => void;
  onBookmark?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onTafsir?: () => void;
}

export const AyatCard: React.FC<AyatCardProps> = ({
  surah, ayat, arabic, translation, transliteration, compact,
  bookmarked = false, isPlaying = false, tajwid = false,
  onPlay, onBookmark, onCopy, onShare, onTafsir,
}) => {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [showMenu, setShowMenu] = useState(false);

  const arabicContent = useMemo(() => {
    if (!tajwid) return arabic;
    const segs = segmentTajwid(arabic);
    return segs.map((s, idx) =>
      s.rule ? (
        <span key={idx} style={{ color: TAJWID_COLORS[s.rule] }}>{s.text}</span>
      ) : (
        <React.Fragment key={idx}>{s.text}</React.Fragment>
      )
    );
  }, [arabic, tajwid]);

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
      id={`ayat-${ayat}`}
      style={{
        background: isPlaying ? 'var(--bq-gold-50, #FFFDF5)' : '#ffffff',
        border: isPlaying ? '2px solid var(--bq-gold-300)' : '1px solid var(--bq-paper-200)',
        borderRadius: 'var(--bq-radius-lg)',
        padding: compact ? 20 : 32,
        transition: 'all 0.3s ease',
        boxShadow: isPlaying
          ? '0 4px 20px rgba(201,162,78,0.15)'
          : '0 1px 3px rgba(0,0,0,0.03)',
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
        <div style={{ display: 'flex', gap: 2, position: 'relative' }}>
          <ActionBtn onClick={onPlay} title="Putar" active={isPlaying}>
            <Icon d={isPlaying ? Icons.Pause : Icons.Play} size={15} />
          </ActionBtn>
          <ActionBtn onClick={handleBookmark} title="Bookmark" active={isBookmarked}>
            <Icon d={Icons.Bookmark} size={15} />
          </ActionBtn>

          {/* Desktop actions */}
          <div className="bq-ayat-actions-desktop" style={{ display: 'flex', gap: 2 }}>
            <ActionBtn onClick={onTafsir} title="Tafsir">
              <Icon d={Icons.Book} size={15} />
            </ActionBtn>
            <ActionBtn onClick={handleCopy} title="Salin" active={copied}>
              <Icon d={copied ? Icons.Check : Icons.Copy} size={15} />
            </ActionBtn>
            <ActionBtn onClick={onShare} title="Bagikan">
              <Icon d={Icons.Share} size={15} />
            </ActionBtn>
          </div>

          {/* Mobile more actions */}
          <div className="bq-ayat-actions-mobile">
            <ActionBtn onClick={() => setShowMenu(!showMenu)} title="Lainnya" active={showMenu}>
              <Icon d={Icons.Menu} size={15} />
            </ActionBtn>

            {showMenu && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 9 }} 
                  onClick={() => setShowMenu(false)}
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 4,
                    background: '#fff',
                    border: '1px solid var(--bq-paper-200)',
                    borderRadius: 'var(--bq-radius-md)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '4px',
                    minWidth: '130px',
                  }}
                >
                  <MenuBtn onClick={() => { onTafsir?.(); setShowMenu(false); }} icon={Icons.Book}>Tafsir</MenuBtn>
                  <MenuBtn onClick={() => { handleCopy(); setShowMenu(false); }} icon={copied ? Icons.Check : Icons.Copy}>{copied ? 'Disalin' : 'Salin'}</MenuBtn>
                  <MenuBtn onClick={() => { onShare?.(); setShowMenu(false); }} icon={Icons.Share}>Bagikan</MenuBtn>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Arabic text */}
      <div
        className="bq-arabic"
        style={{
          fontSize: compact ? 'clamp(22px, 5vw, 36px)' : 'clamp(26px, 6.5vw, 46px)',
          color: 'var(--bq-paper-900)',
          textAlign: 'right',
          marginBottom: 22,
          lineHeight: 2,
          letterSpacing: '0.02em',
        }}
      >
        {arabicContent}
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

      <style>{`
        .bq-ayat-actions-mobile { display: none; }
        @media (max-width: 640px) {
          .bq-ayat-actions-desktop { display: none !important; }
          .bq-ayat-actions-mobile { display: block; }
        }
      `}</style>
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

// ─── Menu button (for dropdown) ───
const MenuBtn: React.FC<{
  onClick?: () => void;
  icon: any;
  children: React.ReactNode;
}> = ({ onClick, icon, children }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      width: '100%',
      padding: '8px 12px',
      background: 'transparent',
      border: 'none',
      borderRadius: 'var(--bq-radius-sm)',
      cursor: 'pointer',
      color: 'var(--bq-paper-700)',
      fontSize: 14,
      textAlign: 'left',
      transition: 'background 0.15s ease',
    }}
    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bq-paper-50)')}
    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
  >
    <Icon d={icon} size={15} color="var(--bq-paper-500)" />
    {children}
  </button>
);

export { ActionBtn, MenuBtn };
