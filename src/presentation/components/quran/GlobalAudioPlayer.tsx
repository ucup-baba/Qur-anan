'use client';

/**
 * GlobalAudioPlayer.tsx — Floating vinyl-style audio player.
 * Collapsed: compact pill with spinning disc art.
 * Expanded (hover): full controls with seekbar + settings.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  useAudioStore, QORI_LIST, PLAYBACK_RATES,
  type QoriId, type PlaybackRate,
} from '@/presentation/hooks/useAudioStore';
import { Icon, Icons } from '../icons';

/* ─── helpers ─────────────────────────────────────── */
function fmt(secs: number): string {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const SLEEP_OPTS = [5, 10, 15, 30, 45, 60];

function SleepCountdown({ endsAt }: { endsAt: number }) {
  const [rem, setRem] = useState(() => Math.max(0, endsAt - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setRem(Math.max(0, endsAt - Date.now())), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  return (
    <span className="bqvp-mono">
      {Math.floor(rem / 60000)}:{Math.floor((rem % 60000) / 1000).toString().padStart(2, '0')}
    </span>
  );
}

/* ─── Vinyl SVG disc ─────────────────────────────── */
function VinylDisc({ size = 128, spinning }: { size?: number; spinning?: boolean }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 128 128"
      className={spinning ? 'bqvp-spin' : ''}
      style={{ borderRadius: '50%', display: 'block' }}
    >
      {/* background */}
      <rect width="128" height="128" fill="#2d1f0e" rx="64" />
      {/* grooves */}
      {[48, 40, 33, 27, 22].map((r, i) => (
        <circle key={i} cx="64" cy="64" r={r}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
      ))}
      {/* gold wave at bottom */}
      <path d="M0 92 Q32 72 64 92 T128 92 L128 128 L0 128Z"
        fill="#A8842E" opacity="0.55" />
      <path d="M0 100 Q32 82 64 100 T128 100 L128 128 L0 128Z"
        fill="#C9A24E" opacity="0.45" />
      <path d="M0 108 Q32 96 64 108 T128 108 L128 128 L0 128Z"
        fill="#E5C77A" opacity="0.35" />
      {/* shimmer dots */}
      <circle cx="22" cy="22" r="1.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="44" cy="14" r="1.5" fill="rgba(255,255,255,0.2)" />
      <circle cx="68" cy="10" r="1.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="100" cy="18" r="1.5" fill="rgba(255,255,255,0.2)" />
      <circle cx="112" cy="40" r="1.5" fill="rgba(255,255,255,0.15)" />
      {/* label circle */}
      <circle cx="64" cy="64" r="18" fill="#7A5A30" />
      <circle cx="64" cy="64" r="15" fill="#5C4322" />
      {/* Arabic قرآن label */}
      <text x="64" y="67" textAnchor="middle" dominantBaseline="middle"
        fontSize="11" fontFamily="serif" fill="#E5C77A" opacity="0.9">
        قرآن
      </text>
      {/* center hole */}
      <circle cx="64" cy="64" r="4" fill="#2d1f0e" />
    </svg>
  );
}

/* ─── Settings sheet ─────────────────────────────── */
function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { qoriId, playbackRate, sleepTimerEndsAt, setQori, setPlaybackRate, startSleepTimer, cancelSleepTimer } = useAudioStore();
  return (
    <div className="bqvp-sheet-backdrop" onClick={onClose}>
      <div className="bqvp-sheet" onClick={e => e.stopPropagation()}>
        <div className="bqvp-sheet-head">
          <span>Pengaturan Murottal</span>
          <button onClick={onClose} className="bqvp-sheet-close" aria-label="Tutup">
            <Icon d={Icons.X} size={15} />
          </button>
        </div>

        <div className="bqvp-section">
          <div className="bqvp-section-label">Qori</div>
          <div className="bqvp-qori-grid">
            {QORI_LIST.map(q => (
              <button key={q.id}
                className={`bqvp-chip${qoriId === q.id ? ' bqvp-chip-active' : ''}`}
                onClick={() => setQori(q.id as QoriId)}>
                {q.short}
              </button>
            ))}
          </div>
        </div>

        <div className="bqvp-section">
          <div className="bqvp-section-label">Kecepatan</div>
          <div className="bqvp-row-wrap">
            {PLAYBACK_RATES.map(r => (
              <button key={r}
                className={`bqvp-chip${playbackRate === r ? ' bqvp-chip-active' : ''}`}
                onClick={() => setPlaybackRate(r as PlaybackRate)}>
                {r}x
              </button>
            ))}
          </div>
        </div>

        <div className="bqvp-section">
          <div className="bqvp-section-label">Sleep Timer</div>
          {sleepTimerEndsAt ? (
            <div className="bqvp-sleep-active">
              <span>Pause dalam <SleepCountdown endsAt={sleepTimerEndsAt} /></span>
              <button onClick={cancelSleepTimer} className="bqvp-chip">Batal</button>
            </div>
          ) : (
            <div className="bqvp-row-wrap">
              {SLEEP_OPTS.map(m => (
                <button key={m} onClick={() => startSleepTimer(m)} className="bqvp-chip">
                  {m}m
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
export const GlobalAudioPlayer: React.FC = () => {
  const {
    tracks, currentIndex, playing, progress, currentTime, duration,
    repeat, qoriId, playbackRate, sleepTimerEndsAt,
    togglePlay, next, prev, seek, toggleRepeat, close,
  } = useAudioStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const seekRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const track = currentIndex >= 0 && currentIndex < tracks.length ? tracks[currentIndex] : null;
  const qori = QORI_LIST.find(q => q.id === qoriId) ?? QORI_LIST[4];

  if (!track) return null;

  /* Expand on hover with small delay to avoid flicker */
  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => setExpanded(true), 100);
  };
  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setExpanded(false), 300);
  };

  /* Seek bar click */
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  return (
    <>
      {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}

      <div
        className={`bqvp-wrap${expanded ? ' bqvp-expanded' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Vinyl disc (visible in collapsed, slides up when expanded) ── */}
        <div className="bqvp-disc-anchor">
          <VinylDisc size={128} spinning={playing} />
          {/* Center hole overlay for depth */}
          <div className="bqvp-disc-hole" />
        </div>

        {/* ── Card body ── */}
        <div className="bqvp-card">

          {/* ── Close button — pojok kanan atas card ── */}
          <button className="bqvp-btn-close" onClick={close} title="Tutup">
            <Icon d={Icons.X} size={14} />
          </button>

          {/* Top row: album art (small) + track info — only when expanded */}
          <div className="bqvp-top-row">
            <div className="bqvp-disc-sm-wrap">
              <VinylDisc size={96} spinning={playing} />
              <div className="bqvp-disc-hole-sm" />
            </div>
            <div className="bqvp-track-info">
              <p className="bqvp-track-name">
                {track.surahName} · {track.ayatNomor}
              </p>
              <p className="bqvp-track-sub">
                {qori.short} · {playbackRate}x
                {sleepTimerEndsAt && <> · <SleepCountdown endsAt={sleepTimerEndsAt} /></>}
              </p>
            </div>
          </div>

          {/* Seek bar */}
          <div className="bqvp-seekbar-row">
            <span className="bqvp-time">{fmt(currentTime)}</span>
            <div className="bqvp-seekbar" ref={seekRef} onClick={handleSeek}>
              <div className="bqvp-seek-fill" style={{ width: `${Math.min(progress * 100, 100)}%` }} />
              <div className="bqvp-seek-thumb" style={{ left: `${Math.min(progress * 100, 100)}%` }} />
            </div>
            <span className="bqvp-time">{fmt(duration)}</span>
          </div>

          {/* Controls */}
          <div className="bqvp-controls">
            <button
              className={`bqvp-btn-icon bqvp-btn-side${repeat !== 'none' ? ' bqvp-btn-active' : ''}`}
              onClick={toggleRepeat}
              title={`Ulangi: ${repeat}`}
            >
              <Icon
                d={Icons.Repeat}
                size={18}
                style={{ opacity: repeat === 'none' ? 0.4 : 1 }}
              />
              {repeat === 'one' && <span className="bqvp-repeat-badge">1</span>}
            </button>

            <button className="bqvp-btn-icon" onClick={prev}>
              <Icon d={Icons.SkipBack} size={22} />
            </button>

            <button className="bqvp-btn-play" onClick={togglePlay}>
              <Icon d={playing ? Icons.Pause : Icons.Play} size={22} />
            </button>

            <button className="bqvp-btn-icon" onClick={next}>
              <Icon d={Icons.SkipForward} size={22} />
            </button>

            {/* Settings — posisi kanan, menggantikan X lama */}
            <button
              className="bqvp-btn-icon bqvp-btn-side"
              onClick={() => setSettingsOpen(true)}
              title="Pengaturan"
            >
              <Icon d={Icons.Settings} size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ══════════════════════════════════════════
           BQVP — Vinyl Audio Player
           Palette: warm brown #2d1f0e, gold #C9A24E
        ══════════════════════════════════════════ */

        @keyframes bqvp-spin { to { transform: rotate(360deg); } }
        @keyframes bqvp-up { from { opacity:0; transform:translateX(-50%) translateY(24px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes bqvp-fadein { from { opacity:0; } to { opacity:1; } }

        .bqvp-spin { animation: bqvp-spin 4s linear infinite; }

        /* ── Outer wrapper ── */
        .bqvp-wrap {
          position: fixed;
          bottom: calc(7.5rem + env(safe-area-inset-bottom, 0px));
          left: 50%;
          transform: translateX(-50%);
          z-index: 90;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: bqvp-up 0.4s cubic-bezier(0.22,1,0.36,1);
          /* prevent layout shift */
          width: 168px;
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .bqvp-wrap.bqvp-expanded { width: 300px; }
        @media (min-width: 768px) {
          .bqvp-wrap { bottom: 28px; }
        }

        /* ── Disc anchor: peeks above card ── */
        .bqvp-disc-anchor {
          position: relative;
          width: 128px;
          height: 64px;         /* half height — clips bottom half */
          overflow: visible;
          margin-bottom: -4px;
          z-index: 1;
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .bqvp-wrap.bqvp-expanded .bqvp-disc-anchor { height: 0; overflow: hidden; }

        .bqvp-disc-hole {
          position: absolute;
          width: 28px; height: 28px;
          background: #F5F0E6;
          border-radius: 50%;
          border: 3px solid #D9C9AE;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          top: 50px; left: 50px;
          z-index: 2;
        }

        /* ── Card ── */
        .bqvp-card {
          position: relative;
          z-index: 2;
          width: 100%;
          background: linear-gradient(145deg, #2d1f0e 0%, #4a3018 60%, #3a2410 100%);
          border-radius: 20px;
          padding: 12px 14px 14px;
          box-shadow:
            0 12px 40px rgba(0,0,0,0.45),
            0 2px 8px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.07);
          border: 1px solid rgba(201,162,78,0.2);
          color: #fff;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }
        .bqvp-wrap.bqvp-expanded .bqvp-card { border-color: rgba(201,162,78,0.35); }

        /* ── Top row (disc-sm + info) — hidden when collapsed ── */
        .bqvp-top-row {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 0;
          overflow: hidden;
          opacity: 0;
          transition: height 0.25s ease, opacity 0.2s ease;
          margin-bottom: 0;
        }
        .bqvp-wrap.bqvp-expanded .bqvp-top-row {
          height: 72px;
          opacity: 1;
          margin-bottom: 8px;
        }

        .bqvp-disc-sm-wrap {
          position: relative;
          flex-shrink: 0;
          margin-top: -8px;
          margin-left: -6px;
        }
        .bqvp-disc-hole-sm {
          position: absolute;
          width: 20px; height: 20px;
          background: #4a3018;
          border-radius: 50%;
          border: 2.5px solid #D9C9AE;
          top: 38px; left: 38px;
          z-index: 2;
        }

        .bqvp-track-info { min-width: 0; }
        .bqvp-track-name {
          font-size: 14px; font-weight: 700;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          color: #F5F0E6;
          margin: 0 0 2px;
        }
        .bqvp-track-sub {
          font-size: 11px;
          color: rgba(201,162,78,0.8);
          margin: 0;
        }

        /* ── Seek bar ── */
        .bqvp-seekbar-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px;
          /* collapsed: bar spans full width, no timestamps */
        }
        .bqvp-time {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          white-space: nowrap;
          width: 0; overflow: hidden; opacity: 0;
          transition: width 0.25s ease, opacity 0.2s ease;
        }
        .bqvp-wrap.bqvp-expanded .bqvp-time { width: 28px; opacity: 1; }

        .bqvp-seekbar {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.12);
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          overflow: visible;
        }
        .bqvp-seek-fill {
          height: 100%;
          background: linear-gradient(90deg, #C9A24E, #E5C77A);
          border-radius: 3px;
          transition: width 0.25s linear;
        }
        .bqvp-seek-thumb {
          position: absolute;
          top: 50%; transform: translate(-50%, -50%);
          width: 12px; height: 12px;
          background: #F5F0E6;
          border: 2px solid #C9A24E;
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          opacity: 0;
          transition: opacity 0.2s ease, left 0.25s linear;
          pointer-events: none;
        }
        .bqvp-wrap.bqvp-expanded .bqvp-seek-thumb { opacity: 1; }

        /* ── Controls row ── */
        .bqvp-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
        }

        .bqvp-btn-icon {
          width: 36px; height: 36px;
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; border: none;
          border-radius: 50%;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          position: relative;
          flex-shrink: 0;
        }
        .bqvp-btn-icon:hover { color: #fff; background: rgba(255,255,255,0.08); }
        .bqvp-btn-active { color: #C9A24E !important; }

        /* Side buttons (settings, repeat, close) — hidden in collapsed */
        .bqvp-btn-side {
          width: 0; overflow: hidden; opacity: 0;
          transition: width 0.25s ease, opacity 0.2s ease;
        }
        .bqvp-wrap.bqvp-expanded .bqvp-btn-side { width: 36px; opacity: 1; }

        /* Close button (top right) */
        .bqvp-btn-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.7);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 0;
          pointer-events: none;
          z-index: 10;
        }
        .bqvp-wrap.bqvp-expanded .bqvp-btn-close {
          opacity: 1;
          pointer-events: auto;
        }
        .bqvp-btn-close:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .bqvp-btn-play {
          width: 48px; height: 48px;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #C9A24E, #A8842E);
          border: none; border-radius: 50%;
          color: #2d1f0e; cursor: pointer;
          box-shadow: 0 3px 12px rgba(201,162,78,0.5);
          flex-shrink: 0;
          transition: filter 0.15s, transform 0.1s;
        }
        .bqvp-btn-play:hover { filter: brightness(1.12); transform: scale(1.05); }
        .bqvp-btn-play:active { transform: scale(0.97); }

        .bqvp-repeat-badge {
          position: absolute; top: 2px; right: 2px;
          font-size: 8px; font-weight: 800; color: #C9A24E;
          line-height: 1;
        }

        .bqvp-mono { font-family: 'JetBrains Mono', monospace; }

        /* ══ Settings Sheet ══ */
        .bqvp-sheet-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          display: flex; align-items: flex-end; justify-content: center;
          animation: bqvp-fadein 0.2s ease;
        }
        @media (min-width: 768px) { .bqvp-sheet-backdrop { align-items: center; } }

        .bqvp-sheet {
          width: 100%; max-width: 480px;
          background: linear-gradient(145deg, #2d1f0e, #4a3018);
          color: #fff;
          border-radius: 24px 24px 0 0;
          padding: 20px 20px calc(20px + env(safe-area-inset-bottom, 0px));
          box-shadow: 0 -8px 48px rgba(0,0,0,0.6);
          border-top: 1px solid rgba(201,162,78,0.25);
          animation: bqvp-up 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        @media (min-width: 768px) {
          .bqvp-sheet { border-radius: 24px; margin: 16px; }
        }

        .bqvp-sheet-head {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 14px; font-weight: 700; color: #F5F0E6;
          margin-bottom: 18px; padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .bqvp-sheet-close {
          background: rgba(255,255,255,0.1); border: none; color: #fff;
          width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .bqvp-sheet-close:hover { background: rgba(255,255,255,0.18); }

        .bqvp-section { margin-bottom: 20px; }
        .bqvp-section:last-child { margin-bottom: 0; }
        .bqvp-section-label {
          font-size: 10px; text-transform: uppercase; letter-spacing: 1.4px;
          color: rgba(201,162,78,0.7); font-weight: 700; margin-bottom: 10px;
        }
        .bqvp-qori-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
        .bqvp-row-wrap { display: flex; gap: 6px; flex-wrap: wrap; }

        .bqvp-chip {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          padding: 8px 14px; border-radius: 999px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .bqvp-chip:hover { background: rgba(255,255,255,0.13); }
        .bqvp-chip-active {
          background: linear-gradient(135deg, #C9A24E, #A8842E);
          color: #2d1f0e;
          border-color: transparent;
        }

        .bqvp-sleep-active {
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(201,162,78,0.12);
          padding: 10px 14px; border-radius: 12px;
          font-size: 12px;
          border: 1px solid rgba(201,162,78,0.25);
          color: rgba(255,255,255,0.9);
        }
      `}</style>
    </>
  );
};
