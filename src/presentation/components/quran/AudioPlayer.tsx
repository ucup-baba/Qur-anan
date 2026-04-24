import React from 'react';
import { Icon, Icons } from '../icons';

interface AudioPlayerProps {
  surah: string;
  reciter: string;
  progress?: number;
  playing?: boolean;
  onPlayPause?: () => void;
  onSkipBack?: () => void;
  onSkipForward?: () => void;
  style?: React.CSSProperties;
}

function formatTime(secs: number): string {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surah, reciter, progress = 0, playing = false,
  onPlayPause, onSkipBack, onSkipForward, style,
}) => (
  <div
    style={{
      background: 'linear-gradient(135deg, #2d2416 0%, #4a3520 100%)',
      color: '#fff',
      borderRadius: 20,
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(12px)',
      ...style,
    }}
  >
    {/* Album art */}
    <div
      style={{
        width: 48, height: 48,
        borderRadius: 12,
        background: 'linear-gradient(135deg, var(--bq-gold-400) 0%, var(--bq-brown-400) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}
    >
      <span className="bq-arabic" style={{ fontSize: 22, color: '#fff', lineHeight: 1, opacity: 0.9 }}>قرآن</span>
    </div>

    {/* Info + progress */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {surah}
      </div>
      <div style={{ fontSize: 11, opacity: 0.55, marginBottom: 10 }}>{reciter}</div>

      {/* Progress bar */}
      <div
        style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', cursor: 'pointer' }}
      >
        <div
          style={{
            width: `${Math.min(progress * 100, 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--bq-gold-300), var(--bq-gold-400))',
            borderRadius: 2,
            transition: 'width 0.3s linear',
          }}
        />
      </div>
    </div>

    {/* Controls */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      <button
        style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '50%', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
        onClick={onSkipBack}
      >
        <Icon d={Icons.SkipBack} size={16} />
      </button>
      <button
        style={{
          width: 44, height: 44,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--bq-gold-300), var(--bq-gold-400))',
          border: 'none', borderRadius: '50%',
          color: '#2d2416', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(201,162,78,0.4)',
          flexShrink: 0,
        }}
        onClick={onPlayPause}
      >
        <Icon d={playing ? Icons.Pause : Icons.Play} size={18} />
      </button>
      <button
        style={{ width: 36, height: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '50%', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
        onClick={onSkipForward}
      >
        <Icon d={Icons.SkipForward} size={16} />
      </button>
    </div>
  </div>
);
