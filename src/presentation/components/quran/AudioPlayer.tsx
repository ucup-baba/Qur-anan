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

const playerBtnStyle: React.CSSProperties = {
  width: 36, height: 36,
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  background: 'transparent', border: 'none', borderRadius: '50%',
  color: 'var(--bq-paper-50)', cursor: 'pointer',
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  surah, reciter, progress = 0.35, playing = true,
  onPlayPause, onSkipBack, onSkipForward, style,
}) => (
  <div
    style={{
      background: 'var(--bq-paper-700)',
      color: 'var(--bq-paper-50)',
      borderRadius: 'var(--bq-radius-xl)',
      padding: 18,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: 'var(--bq-shadow-lg)',
      ...style,
    }}
  >
    <div
      style={{
        width: 52, height: 52,
        borderRadius: 'var(--bq-radius-md)',
        background: 'linear-gradient(135deg, var(--bq-gold-300), var(--bq-brown-300))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span className="bq-arabic" style={{ fontSize: 24, color: 'var(--bq-paper-800)', lineHeight: 1 }}>قرآن</span>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{surah}</div>
      <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 8 }}>{reciter}</div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: 'var(--bq-gold-300)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, opacity: 0.65, fontFamily: 'var(--bq-font-mono)' }}>
        <span>01:12</span><span>03:28</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button style={playerBtnStyle} onClick={onSkipBack}><Icon d={Icons.SkipBack} size={16} /></button>
      <button
        style={{ ...playerBtnStyle, width: 44, height: 44, background: 'var(--bq-gold-300)', color: 'var(--bq-paper-800)' }}
        onClick={onPlayPause}
      >
        <Icon d={playing ? Icons.Pause : Icons.Play} size={18} />
      </button>
      <button style={playerBtnStyle} onClick={onSkipForward}><Icon d={Icons.SkipForward} size={16} /></button>
    </div>
  </div>
);
