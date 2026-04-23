import React from 'react';

interface LastReadCardProps {
  surah: string;
  ayat: string;
  progress?: number;
  onClick?: () => void;
}

export const LastReadCard: React.FC<LastReadCardProps> = ({ surah, ayat, progress = 0.18, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'linear-gradient(135deg, var(--bq-brown-500), var(--bq-brown-400))',
      color: 'var(--bq-paper-50)',
      borderRadius: 'var(--bq-radius-lg)',
      padding: 22,
      position: 'relative',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : undefined,
    }}
  >
    <div
      style={{
        position: 'absolute', right: -20, top: -20,
        width: 140, height: 140,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,162,78,0.25), transparent 70%)',
      }}
    />
    <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 14, fontWeight: 600 }}>
      Terakhir dibaca
    </div>
    <div className="bq-serif" style={{ fontSize: 26, fontWeight: 500, marginBottom: 2 }}>
      {surah}
    </div>
    <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 18 }}>Ayat {ayat}</div>
    <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, marginBottom: 6 }}>
      <div style={{ width: `${progress * 100}%`, height: '100%', background: 'var(--bq-gold-300)', borderRadius: 2 }} />
    </div>
    <div style={{ fontSize: 11, opacity: 0.65, fontFamily: 'var(--bq-font-mono)' }}>
      {Math.round(progress * 100)}% selesai
    </div>
  </div>
);
