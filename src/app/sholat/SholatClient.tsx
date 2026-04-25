'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { Icon, Icons } from '@/presentation/components/icons';
import { Moon, Sun, CloudSun, Sunset, Star, Loader2, LocateFixed, VolumeX, Volume2, Smartphone, X } from 'lucide-react';
import type { SholatJadwal } from '@/infrastructure/api/sholatApi';
import { CityPicker } from '@/presentation/components/sholat/CityPicker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useFCM } from '@/presentation/hooks/useFCM';
import { useSearchParams } from 'next/navigation';

const CITY_STORAGE_KEY = 'bq:sholat:city:v1';
const ADZAN_URL = process.env.NEXT_PUBLIC_ADZAN_URL ?? '/adzan.mp3';

interface SholatClientProps {
  initialJadwal: SholatJadwal | null;
  initialLokasi: string;
  initialDateStr: string;
}

// Mekkah coordinates
const MEKKAH_LAT = 21.3891;
const MEKKAH_LNG = 39.8579;

function getQiblaAngle(lat: number, lng: number): number {
  const φ1 = (lat * Math.PI) / 180;
  const φ2 = (MEKKAH_LAT * Math.PI) / 180;
  const Δλ = ((MEKKAH_LNG - lng) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360;
}

function QiblaCompass({
  qiblaBearing,
  city,
  deviceHeading,
  compassActive,
  compassError,
  onActivate,
}: {
  qiblaBearing: number | null;
  city: string;
  deviceHeading: number;
  compassActive: boolean;
  compassError: string;
  onActivate: () => void;
}) {
  const [internalState, setInternalState] = useState<'idle' | 'calibrating' | 'active'>('idle');

  useEffect(() => {
    if (compassActive && internalState === 'idle') {
      setInternalState('calibrating');
      const timer = setTimeout(() => setInternalState('active'), 1600);
      return () => clearTimeout(timer);
    }
    if (!compassActive) {
      setInternalState('idle');
    }
  }, [compassActive, internalState]);

  const bearing = qiblaBearing ?? 0;
  const heading = deviceHeading;

  const needleAngle = (bearing - heading + 360) % 360;
  const delta = Math.min(
    Math.abs(((bearing - heading + 540) % 360) - 180),
    360
  );
  const aligned = internalState === 'active' && delta < 4;

  const majorTicks = Array.from({ length: 36 }, (_, i) => i * 10);
  const dirs = [
    { label: 'U', ar: 'ش', angle: 0, strong: true },
    { label: 'T', ar: 'ق', angle: 90 },
    { label: 'S', ar: 'ج', angle: 180 },
    { label: 'B', ar: 'غ', angle: 270 },
  ];

  return (
    <div id="kiblat" style={{
      background: 'linear-gradient(180deg, var(--bq-paper-100) 0%, var(--bq-paper-50) 100%)',
      border: '1px solid var(--bq-paper-200)',
      borderRadius: 'var(--bq-radius-xl)',
      padding: '32px 28px 28px',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 24,
      scrollMarginTop: 80,
    }}>
      {/* decorative corner ornaments */}
      <svg aria-hidden style={{ position: 'absolute', top: 12, left: 12, opacity: 0.35 }} width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--bq-gold-300)" strokeWidth="1">
        <path d="M1 8 V1 H8 M14 1 L14 8 M1 14 L8 14" />
      </svg>
      <svg aria-hidden style={{ position: 'absolute', top: 12, right: 12, opacity: 0.35, transform: 'scaleX(-1)' }} width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--bq-gold-300)" strokeWidth="1">
        <path d="M1 8 V1 H8 M14 1 L14 8 M1 14 L8 14" />
      </svg>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 6 }}>Arah Kiblat</div>
        <h3 className="bq-serif" style={{ fontSize: 30, fontWeight: 500, margin: '0 0 6px', color: 'var(--bq-paper-800)', letterSpacing: -0.4 }}>Kompas Kiblat</h3>
        <div style={{ fontSize: 13, color: 'var(--bq-paper-500)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--bq-font-mono)', fontWeight: 500, color: 'var(--bq-paper-600)' }}>
            {qiblaBearing !== null ? `${Math.round(bearing)}°` : '—'}
          </span>
          <span style={{ opacity: 0.55 }}>dari Utara</span>
          <span style={{ margin: '0 4px', color: 'var(--bq-paper-300)' }}>·</span>
          <span>{city}</span>
        </div>
      </div>

      {/* Compass */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px' }}>
        <div
          className={`bq-compass ${internalState} ${aligned ? 'aligned' : ''}`}
          style={{
            width: 300, height: 300, position: 'relative',
          }}
        >
          {/* Outer breathing ring */}
          <div className="bq-compass-outer" />
          {/* Aligned glow ring (shows when pointing at qibla) */}
          <div className="bq-compass-aligned-ring" />
          {/* Radar sweep (calibrating state) */}
          <div className="bq-compass-radar" />

          {/* Face */}
          <svg viewBox="-150 -150 300 300" width="300" height="300" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <radialGradient id="bqFace" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="#FBF4E0" />
                <stop offset="60%" stopColor="#F5F0E6" />
                <stop offset="100%" stopColor="#EADFCC" />
              </radialGradient>
              <linearGradient id="bqNeedleQibla" x1="0" y1="-1" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A24E" />
                <stop offset="55%" stopColor="#A8842E" />
                <stop offset="100%" stopColor="#806318" />
              </linearGradient>
              <linearGradient id="bqNeedleTail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EADFCC" />
                <stop offset="100%" stopColor="#D9C9AE" />
              </linearGradient>
            </defs>

            {/* Face disc */}
            <circle cx="0" cy="0" r="130" fill="url(#bqFace)" stroke="#D9C9AE" strokeWidth="1" />
            {/* Inner hairline */}
            <circle cx="0" cy="0" r="118" fill="none" stroke="#EADFCC" strokeWidth="1" />
            {/* Decorative 8-point star */}
            <g className="bq-compass-star" stroke="#D9C9AE" fill="none" strokeWidth="0.8">
              {[0, 45, 90, 135].map(a => (
                <line key={a} x1="0" y1="-104" x2="0" y2="104" transform={`rotate(${a})`} strokeDasharray="2 4" />
              ))}
              <circle cx="0" cy="0" r="70" strokeDasharray="1 5" />
            </g>

            {/* Tick marks */}
            {majorTicks.map(deg => {
              const isCardinal = deg % 90 === 0;
              const isMid = deg % 30 === 0;
              const r1 = 118;
              const r2 = isCardinal ? 102 : isMid ? 108 : 113;
              const rad = (deg - 90) * Math.PI / 180;
              return (
                <line
                  key={deg}
                  x1={Math.cos(rad) * r1} y1={Math.sin(rad) * r1}
                  x2={Math.cos(rad) * r2} y2={Math.sin(rad) * r2}
                  stroke={isCardinal ? '#7A5A30' : isMid ? '#A89478' : '#D9C9AE'}
                  strokeWidth={isCardinal ? 1.6 : 0.8}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Qibla target marker (fixed on the rose at qiblaBearing relative to N, which rotates with heading) */}
            <g transform={`rotate(${needleAngle})`}>
              <g transform="translate(0,-122)">
                {/* small kaaba silhouette */}
                <rect x="-5.5" y="-6" width="11" height="10" fill="#7A5A30" rx="0.5" />
                <rect x="-5.5" y="-1.5" width="11" height="2" fill="#C9A24E" />
                <rect x="-5.5" y="-6" width="11" height="1.4" fill="#C9A24E" />
              </g>
            </g>

            {/* Direction letters (Latin + Arabic) — they counter-rotate with heading so they always show real compass headings */}
            <g transform={`rotate(${-heading})`}>
              {dirs.map(d => {
                const rad = (d.angle - 90) * Math.PI / 180;
                const xL = Math.cos(rad) * 88;
                const yL = Math.sin(rad) * 88;
                const xA = Math.cos(rad) * 73;
                const yA = Math.sin(rad) * 73;
                return (
                  <g key={d.label}>
                    <text
                      transform={`translate(${xL}, ${yL}) rotate(${heading})`}
                      x="0" y="2"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="var(--bq-font-serif)"
                      fontSize={d.strong ? 20 : 17}
                      fontWeight="500"
                      fill={d.strong ? '#7A5A30' : '#6B5A44'}
                    >{d.label}</text>
                    <text
                      transform={`translate(${xA}, ${yA}) rotate(${heading})`}
                      x="0" y="2"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily="var(--bq-font-arabic)"
                      fontSize="11"
                      fill="#A89478"
                    >{d.ar}</text>
                  </g>
                );
              })}
            </g>

            {/* Degree numerals at 30° */}
            <g transform={`rotate(${-heading})`}>
              {[30, 60, 120, 150, 210, 240, 300, 330].map(deg => {
                const rad = (deg - 90) * Math.PI / 180;
                const x = Math.cos(rad) * 90;
                const y = Math.sin(rad) * 90;
                return (
                  <text
                    key={deg}
                    x={x} y={y + 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--bq-font-mono)"
                    fontSize="9"
                    fill="#A89478"
                    transform={`rotate(${heading}, ${x}, ${y})`}
                  >{deg}</text>
                );
              })}
            </g>

            {/* Needle group (qibla needle) */}
            <g
              className="bq-compass-needle"
              style={{ transform: `rotate(${needleAngle}deg)` }}
            >
              {/* tail */}
              <path d="M -5 10 L 5 10 L 3 60 L 0 64 L -3 60 Z" fill="url(#bqNeedleTail)" opacity="0.9" />
              {/* main needle */}
              <path d="M -6 -10 L 6 -10 L 2 -100 L 0 -108 L -2 -100 Z" fill="url(#bqNeedleQibla)" />
              {/* needle highlight */}
              <path d="M -1.5 -12 L 1.5 -12 L 0.5 -100 L 0 -104 L -0.5 -100 Z" fill="#F2E1B0" opacity="0.5" />
            </g>

            {/* Center hub */}
            <circle cx="0" cy="0" r="11" fill="#F5F0E6" stroke="#7A5A30" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="5" fill="#3F2E17" />
            <circle cx="-1.5" cy="-1.8" r="1.4" fill="#C9A24E" opacity="0.7" />
          </svg>

          {/* Fixed top indicator (device-forward arrow outside the disc) */}
          <div className="bq-compass-indicator">
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path d="M9 1 L17 13 L9 9 L1 13 Z" fill="#7A5A30" />
            </svg>
          </div>
        </div>
      </div>

      {/* Readout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
        padding: '12px 14px',
        background: 'var(--bq-paper-50)',
        border: '1px solid var(--bq-paper-200)',
        borderRadius: 'var(--bq-radius-md)',
        marginBottom: 16,
      }}>
        {[
          ['Heading', internalState === 'active' ? `${Math.round(heading)}°` : '—'],
          ['Kiblat', qiblaBearing !== null ? `${Math.round(bearing)}°` : '—'],
          ['Selisih', internalState === 'active' ? `${Math.round(delta)}°` : '—'],
        ].map(([k, v]) => (
          <div key={k} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: 'var(--bq-paper-500)', fontWeight: 600, marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 16, fontFamily: 'var(--bq-font-mono)', fontWeight: 500, color: aligned && k === 'Selisih' ? 'var(--bq-gold-400)' : 'var(--bq-paper-800)' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* CTA / status */}
      <div style={{ textAlign: 'center' }}>
        {compassError && (
          <div style={{ fontSize: 12, color: '#e53e3e', marginBottom: 12 }}>{compassError}</div>
        )}
        {internalState === 'idle' && (
          <>
            <Button variant="outline" size="md" onClick={onActivate} disabled={qiblaBearing === null}>
              Aktifkan Kompas
            </Button>
            {qiblaBearing === null && (
              <div style={{ fontSize: 12, color: 'var(--bq-paper-500)', marginTop: 8 }}>
                Aktifkan lokasi terlebih dahulu
              </div>
            )}
          </>
        )}
        {internalState === 'calibrating' && (
          <div style={{ fontSize: 13, color: 'var(--bq-brown-500)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="bq-compass-dot" /> Mengkalibrasi… gerakkan HP membentuk angka 8
          </div>
        )}
        {internalState === 'active' && !aligned && (
          <div style={{ fontSize: 13, color: 'var(--bq-paper-500)' }}>
            Putar perangkat Anda hingga Ka'bah sejajar dengan panah di atas.
          </div>
        )}
        {aligned && (
          <div className="bq-compass-aligned-text" style={{ fontSize: 14, color: 'var(--bq-gold-400)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7.5 L5.5 11 L12 3.5" stroke="#A8842E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Tepat menghadap Kiblat · الحمد لله
          </div>
        )}
      </div>

      {/* styles */}
      <style>{`
        .bq-compass { user-select: none; }

        .bq-compass-outer {
          position: absolute; inset: -6px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201, 162, 78, 0.00) 62%, rgba(201, 162, 78, 0.22) 68%, rgba(201, 162, 78, 0.00) 75%);
          animation: bq-breath 4.4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes bq-breath {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.04); }
        }

        .bq-compass-aligned-ring {
          position: absolute; inset: -4px;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(201, 162, 78, 0);
          transition: box-shadow 600ms var(--bq-ease);
          pointer-events: none;
        }
        .bq-compass.aligned .bq-compass-aligned-ring {
          box-shadow:
            0 0 0 3px rgba(201, 162, 78, 0.35),
            0 0 32px 6px rgba(201, 162, 78, 0.35),
            inset 0 0 24px 2px rgba(201, 162, 78, 0.15);
          animation: bq-pulse 2.4s ease-in-out infinite;
        }
        @keyframes bq-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.015); }
        }

        .bq-compass-radar {
          position: absolute; inset: 0;
          border-radius: 50%;
          opacity: 0;
          background: conic-gradient(from 0deg,
            rgba(122, 90, 48, 0.0) 0deg,
            rgba(122, 90, 48, 0.0) 280deg,
            rgba(201, 162, 78, 0.28) 340deg,
            rgba(122, 90, 48, 0.45) 358deg,
            rgba(201, 162, 78, 0.0) 360deg);
          -webkit-mask: radial-gradient(circle, black 62%, transparent 63%);
                  mask: radial-gradient(circle, black 62%, transparent 63%);
          pointer-events: none;
          transition: opacity 380ms var(--bq-ease);
        }
        .bq-compass.calibrating .bq-compass-radar {
          opacity: 1;
          animation: bq-spin 1.4s linear infinite;
        }
        @keyframes bq-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .bq-compass-star {
          transform-origin: center;
          animation: bq-slow-spin 60s linear infinite;
          opacity: 0.7;
        }
        @keyframes bq-slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .bq-compass-needle {
          transform-origin: 0 0;
          transition: transform 900ms cubic-bezier(0.22, 1.15, 0.36, 1);
          filter: drop-shadow(0 2px 4px rgba(46, 38, 25, 0.18));
        }
        .bq-compass.idle .bq-compass-needle {
          transform: rotate(-40deg) !important;
        }

        .bq-compass-indicator {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          animation: bq-indicator-bob 2.2s ease-in-out infinite;
          filter: drop-shadow(0 1px 2px rgba(46, 38, 25, 0.2));
        }
        @keyframes bq-indicator-bob {
          0%, 100% { transform: translate(-50%, 0); }
          50%      { transform: translate(-50%, -3px); }
        }

        .bq-compass-dot {
          display: inline-block;
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--bq-brown-400);
          animation: bq-dot-pulse 1s ease-in-out infinite;
        }
        @keyframes bq-dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%      { opacity: 1;   transform: scale(1.15); }
        }

        .bq-compass-aligned-text {
          animation: bq-fade-up 400ms var(--bq-ease);
        }
        @keyframes bq-fade-up {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .bq-float {
          animation: bq-float 3.5s ease-in-out infinite;
        }
        @keyframes bq-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export function SholatClient({ initialJadwal, initialLokasi, initialDateStr }: SholatClientProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [jadwalData, setJadwalData] = useState<SholatJadwal | null>(initialJadwal);
  const [lokasi, setLokasi] = useState<string>(initialLokasi);
  const [dateStr, setDateStr] = useState<string>(initialDateStr);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [adzanPlaying, setAdzanPlaying] = useState(false);

  const playAdzan = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => null);
    setAdzanPlaying(true);
  }, []);

  useFCM({ onAdzan: () => playAdzan() });

  // Autoplay adzan when opened from notification tap
  useEffect(() => {
    if (searchParams.get('adzan') === '1') {
      const t = setTimeout(() => playAdzan(), 800);
      return () => clearTimeout(t);
    }
  }, [searchParams, playAdzan]);

  // Compass / Qibla state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [compassActive, setCompassActive] = useState(false);
  const [compassError, setCompassError] = useState<string>('');
  const cleanupCompass = useRef<(() => void) | null>(null);
  const lastHeading = useRef<number>(0);

  // Low-pass filter for smooth compass movement (reduces jitter)
  const smoothHeading = useCallback((raw: number) => {
    const prev = lastHeading.current;
    // Handle the 0°/360° wrap-around
    let diff = raw - prev;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    const SMOOTHING = 0.3; // lower = smoother but laggier
    const smoothed = ((prev + diff * SMOOTHING) + 360) % 360;
    lastHeading.current = smoothed;
    return smoothed;
  }, []);

  const PRAYER_TIMES = jadwalData ? [
    { name: 'Subuh',   time: jadwalData.subuh,   LucideIcon: Moon,     mobileOnly: false },
    { name: 'Dhuha',   time: jadwalData.dhuha,   LucideIcon: Sun,      mobileOnly: true  },
    { name: 'Dzuhur',  time: jadwalData.dzuhur,  LucideIcon: Sun,      mobileOnly: false },
    { name: 'Ashar',   time: jadwalData.ashar,   LucideIcon: CloudSun, mobileOnly: false },
    { name: 'Maghrib', time: jadwalData.maghrib, LucideIcon: Sunset,   mobileOnly: false },
    { name: 'Isya',    time: jadwalData.isya,    LucideIcon: Star,     mobileOnly: false },
  ] : [
    { name: 'Subuh',   time: '--:--', LucideIcon: Moon,     mobileOnly: false },
    { name: 'Dhuha',   time: '--:--', LucideIcon: Sun,      mobileOnly: true  },
    { name: 'Dzuhur',  time: '--:--', LucideIcon: Sun,      mobileOnly: false },
    { name: 'Ashar',   time: '--:--', LucideIcon: CloudSun, mobileOnly: false },
    { name: 'Maghrib', time: '--:--', LucideIcon: Sunset,   mobileOnly: false },
    { name: 'Isya',    time: '--:--', LucideIcon: Star,     mobileOnly: false },
  ];

  const [modalPrayer, setModalPrayer] = useState<(typeof PRAYER_TIMES)[0] | null>(null);
  const DEFAULT_NOTIF_MODES: Record<string, 'hening' | 'getar' | 'adzan'> = {
    Subuh: 'hening', Dzuhur: 'hening', Ashar: 'hening', Maghrib: 'hening', Isya: 'hening',
  };
  const [notifModes, setNotifModes] = useState<Record<string, 'hening' | 'getar' | 'adzan'>>(() => {
    if (typeof window === 'undefined') return DEFAULT_NOTIF_MODES;
    try {
      const saved = JSON.parse(localStorage.getItem('bq:notif-modes') || '{}');
      return { ...DEFAULT_NOTIF_MODES, ...saved };
    } catch { return DEFAULT_NOTIF_MODES; }
  });

  const getNextPrayer = () => {
    if (!jadwalData) return PRAYER_TIMES[0];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    for (const p of PRAYER_TIMES) {
      if (p.mobileOnly) continue;
      if (!p.time || p.time === '--:--') continue;
      const [h, m] = p.time.split(':').map(Number);
      if (h * 60 + m > currentTime) return p;
    }
    return PRAYER_TIMES[0];
  };

  const nextPrayer = getNextPrayer();

  const handleSelectNotifMode = (prayerName: string, mode: 'hening' | 'getar' | 'adzan') => {
    const updated = { ...notifModes, [prayerName]: mode };
    setNotifModes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bq:notif-modes', JSON.stringify(updated));
    }
    if (user) {
      setDoc(doc(db, 'users', user.uid), { notifModes: updated }, { merge: true }).catch(() => null);
    }
    setTimeout(() => setModalPrayer(null), 280);
  };

  const syncPrayerTimesToFirestore = useCallback((jadwal: SholatJadwal, cityId: string, cityName: string) => {
    if (!user) return;
    const prayerTimes: Record<string, string> = {
      Subuh: jadwal.subuh, Dzuhur: jadwal.dzuhur,
      Ashar: jadwal.ashar, Maghrib: jadwal.maghrib, Isya: jadwal.isya,
    };
    setDoc(doc(db, 'users', user.uid), { prayerTimes, cityId, cityName }, { merge: true }).catch(() => null);
  }, [user]);

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }
    setIsLoadingGPS(true);
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          setQiblaAngle(getQiblaAngle(lat, lng));

          const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
          const geoData = await geoRes.json();

          // Coba dari level paling spesifik → kabupaten → provinsi
          const candidates: string[] = [
            geoData.city,
            geoData.locality,
            geoData.countrySecondarySubdivision,
            geoData.principalSubdivision,
          ].filter(Boolean);

          if (!candidates.length) throw new Error('Tidak dapat menemukan nama kota dari lokasi Anda.');

          let kotaId: string | null = null;
          for (const keyword of candidates) {
            const res = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(keyword)}`);
            const data = await res.json();
            if (data.status && data.data.length > 0) {
              kotaId = data.data[0].id;
              break;
            }
          }
          if (!kotaId) throw new Error(`Lokasi tidak ditemukan di database. Gunakan pilih kota manual.`);
          const targetDate = new Date();
          const year = targetDate.getFullYear();
          const month = String(targetDate.getMonth() + 1).padStart(2, '0');
          const day = String(targetDate.getDate()).padStart(2, '0');

          const jadwalRes = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${year}/${month}/${day}`);
          const jadwalDataRes = await jadwalRes.json();
          if (!jadwalDataRes.status) throw new Error('Gagal mengambil jadwal sholat untuk lokasi tersebut.');

          const jadwal = jadwalDataRes.data.jadwal;
          const namaLokasi = jadwalDataRes.data.lokasi;
          setJadwalData(jadwal);
          setLokasi(namaLokasi);
          setDateStr(jadwal.tanggal);
          syncPrayerTimesToFirestore(jadwal, kotaId, namaLokasi);
        } catch (err: any) {
          setErrorMsg(err.message || 'Terjadi kesalahan saat mengambil lokasi.');
        } finally {
          setIsLoadingGPS(false);
        }
      },
      () => {
        setIsLoadingGPS(false);
        setErrorMsg('Gagal mengakses lokasi. Pastikan izin GPS diberikan.');
      }
    );
  }, [syncPrayerTimesToFirestore]);

  const fetchByKotaId = useCallback(async (kotaId: string, cityName?: string) => {
    setIsLoadingCity(true);
    setErrorMsg('');
    try {
      const targetDate = new Date();
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');

      const jadwalRes = await fetch(
        `https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${year}/${month}/${day}`
      );
      const jadwalDataRes = await jadwalRes.json();
      if (!jadwalDataRes.status) throw new Error('Gagal mengambil jadwal sholat.');

      const jadwal = jadwalDataRes.data.jadwal;
      const newLokasi = cityName || jadwalDataRes.data.lokasi;
      setJadwalData(jadwal);
      setLokasi(newLokasi);
      setDateStr(jadwal.tanggal);
      syncPrayerTimesToFirestore(jadwal, kotaId, newLokasi);

      try {
        localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify({ id: kotaId, lokasi: newLokasi }));
      } catch { /* ignore */ }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengambil jadwal sholat.';
      setErrorMsg(msg);
    } finally {
      setIsLoadingCity(false);
    }
  }, [syncPrayerTimesToFirestore]);

  const hasRequestedLoc = useRef(false);
  useEffect(() => {
    if (hasRequestedLoc.current) return;
    hasRequestedLoc.current = true;

    try {
      const raw = localStorage.getItem(CITY_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { id: string; lokasi: string };
        if (saved?.id) {
          fetchByKotaId(saved.id, saved.lokasi);
          return;
        }
      }
    } catch {
      // ignore
    }
    handleUseLocation();
  }, [handleUseLocation, fetchByKotaId]);

  // ── Activate compass (TRUE NORTH on all platforms) ──
  const activateCompass = useCallback(async () => {
    setCompassError('');

    // iOS 13+ requires explicit permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setCompassError('Izin sensor orientasi ditolak.');
          return;
        }
      } catch {
        setCompassError('Gagal meminta izin sensor orientasi.');
        return;
      }
    }

    if (!window.DeviceOrientationEvent) {
      setCompassError('Sensor orientasi tidak tersedia di perangkat ini.');
      return;
    }

    // Clean up any previous listeners
    if (cleanupCompass.current) {
      cleanupCompass.current();
      cleanupCompass.current = null;
    }

    let gotAbsolute = false;
    const removers: (() => void)[] = [];

    // Handler that extracts true-north heading from the event
    const processOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // 1) iOS Safari: webkitCompassHeading gives degrees from magnetic north (0 = N, 90 = E)
      //    This is already referenced to north — use directly.
      if (typeof (e as any).webkitCompassHeading === 'number') {
        heading = (e as any).webkitCompassHeading as number;
      }
      // 2) Android / Chrome: when using 'deviceorientationabsolute' or e.absolute === true,
      //    alpha is degrees from TRUE north, but measured counter-clockwise.
      //    Convert to clockwise compass bearing: heading = (360 - alpha) % 360
      else if (e.alpha !== null && (e.absolute === true || gotAbsolute)) {
        heading = (360 - e.alpha) % 360;
      }
      // 3) Fallback: non-absolute alpha. Still counter-clockwise from an arbitrary reference.
      //    Convert the same way — better than nothing.
      else if (e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      }

      if (heading !== null) {
        setDeviceHeading(smoothHeading(heading));
      }
    };

    // Strategy A: Try 'deviceorientationabsolute' first (Chrome / Android — gives true north)
    const absoluteHandler = (e: DeviceOrientationEvent) => {
      gotAbsolute = true;
      processOrientation(e);
    };

    // Strategy B: Fallback to standard 'deviceorientation' (iOS, or non-Chrome)
    const standardHandler = (e: DeviceOrientationEvent) => {
      // If we already got absolute readings, ignore the non-absolute fallback
      if (gotAbsolute) return;
      processOrientation(e);
    };

    // Listen for absolute orientation (Android Chrome)
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute' as any, absoluteHandler, true);
      removers.push(() => window.removeEventListener('deviceorientationabsolute' as any, absoluteHandler, true));
    }

    // Always also listen for standard orientation (iOS, fallback)
    window.addEventListener('deviceorientation', standardHandler, true);
    removers.push(() => window.removeEventListener('deviceorientation', standardHandler, true));

    cleanupCompass.current = () => {
      removers.forEach(fn => fn());
    };

    setCompassActive(true);
  }, [smoothHeading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupCompass.current) {
        cleanupCompass.current();
      }
    };
  }, []);

  // Auto-scroll to #kiblat if hash present on load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash === '#kiblat') {
      const tryScroll = () => {
        const el = document.getElementById('kiblat');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      const t = setTimeout(tryScroll, 120);
      return () => clearTimeout(t);
    }
  }, []);



  return (
    <div className="min-h-[80vh] py-10 md:py-14 px-4 md:px-6 max-w-[800px] mx-auto">

      {/* Hidden audio player */}
      <audio
        ref={audioRef}
        src={ADZAN_URL}
        onEnded={() => setAdzanPlaying(false)}
        style={{ display: 'none' }}
      />

      {/* Adzan playing banner */}
      {adzanPlaying && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, var(--bq-brown-600), var(--bq-gold-400))',
          color: '#fff', borderRadius: 40, padding: '12px 22px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 32px rgba(108,82,54,0.35)',
          zIndex: 500, fontSize: 14, fontWeight: 600,
          animation: 'bq-fade-up 0.3s ease',
          whiteSpace: 'nowrap',
        }}>
          <Volume2 size={18} strokeWidth={2} />
          Adzan sedang diputar
          <button
            onClick={() => { audioRef.current?.pause(); setAdzanPlaying(false); }}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', marginLeft: 4 }}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-500)', fontWeight: 600, marginBottom: 8 }}>
          Jadwal
        </div>
        <h1 className="bq-serif" style={{ fontSize: 36, fontWeight: 500, margin: '0 0 14px', color: 'var(--bq-paper-800)', letterSpacing: -0.5 }}>
          Waktu Sholat
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setCityPickerOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 14, background: 'none',
              border: '1px solid var(--bq-paper-200)',
              padding: '5px 12px', borderRadius: 20,
              color: 'var(--bq-paper-800)', fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Ganti kota"
          >
            <Icon d={Icons.MapPin} size={14} style={{ color: 'var(--bq-paper-400)' }} />
            <span>{lokasi}</span>
            <Icon d={Icons.ChevronDown} size={12} style={{ color: 'var(--bq-paper-400)' }} />
          </button>
          <button
            onClick={handleUseLocation}
            disabled={isLoadingGPS || isLoadingCity}
            style={{
              background: 'none', border: '1px solid var(--bq-paper-200)',
              padding: '3px 10px', borderRadius: 20, fontSize: 12,
              color: 'var(--bq-brown-600)', cursor: (isLoadingGPS || isLoadingCity) ? 'wait' : 'pointer',
              fontWeight: 600, transition: 'all 0.15s',
            }}
            title="Gunakan GPS"
          >
            {isLoadingGPS
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Loader2 size={11} className="animate-spin" /> Mencari...</span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LocateFixed size={11} /> GPS</span>
            }
          </button>
          {dateStr && (
            <span style={{ fontSize: 12, color: 'var(--bq-paper-400)', marginLeft: 4 }}>{dateStr}</span>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
          {errorMsg}
        </div>
      )}

      {/* ── Next Prayer Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bq-brown-600) 0%, var(--bq-brown-400) 60%, var(--bq-gold-400) 100%)',
        borderRadius: 20,
        padding: '32px 36px',
        color: '#fff',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(108, 82, 54, 0.2)',
      }}>
        {/* decorative blob */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />
        <div style={{ position: 'absolute', left: -20, bottom: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600, marginBottom: 6, opacity: 0.7 }}>
              Sholat Berikutnya
            </div>
            <div className="bq-serif" style={{ fontSize: 44, fontWeight: 500, margin: '0 0 4px', letterSpacing: -0.5 }}>
              {nextPrayer.name}
            </div>
            <div style={{ fontFamily: 'var(--bq-font-mono)', fontSize: 38, fontWeight: 700, color: 'var(--bq-gold-200)', letterSpacing: 3 }}>
              {nextPrayer.time}
            </div>
          </div>
          <div className="bq-float" style={{ opacity: 0.9 }}>
            <nextPrayer.LucideIcon size={72} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* ── Prayer Times Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
        {PRAYER_TIMES.map((prayer) => {
          const isActive = prayer.name === nextPrayer.name;
          const mode = prayer.mobileOnly ? null : notifModes[prayer.name];
          const clickable = !prayer.mobileOnly;
          return (
            <div
              key={prayer.name}
              onClick={clickable ? () => setModalPrayer(prayer) : undefined}
              className={prayer.mobileOnly ? 'md:hidden' : ''}
              style={{
                background: isActive ? 'var(--bq-gold-100)' : '#fff',
                border: isActive ? '2px solid var(--bq-gold-400)' : '1px solid var(--bq-paper-200)',
                borderRadius: 14,
                padding: '20px 14px',
                textAlign: 'center',
                transition: 'all 0.25s cubic-bezier(0.2, 0, 0, 1)',
                transform: isActive ? 'scale(1.06)' : 'scale(1)',
                zIndex: isActive ? 2 : 1,
                boxShadow: isActive ? '0 10px 25px rgba(201,162,78,0.2)' : '0 1px 3px rgba(0,0,0,0.03)',
                cursor: clickable ? 'pointer' : 'default',
                position: 'relative',
              }}
            >
              {mode && (
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  {mode === 'hening' && <VolumeX size={11} strokeWidth={2} style={{ color: 'var(--bq-paper-400)' }} />}
                  {mode === 'getar' && <Smartphone size={11} strokeWidth={2} style={{ color: 'var(--bq-paper-400)' }} />}
                  {mode === 'adzan' && <Volume2 size={11} strokeWidth={2} style={{ color: 'var(--bq-gold-400)' }} />}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8, color: isActive ? 'var(--bq-brown-600)' : 'var(--bq-paper-400)' }}>
                <prayer.LucideIcon size={isActive ? 24 : 20} strokeWidth={isActive ? 2 : 1.75} />
              </div>
              <div style={{ fontSize: 11, letterSpacing: 1.1, textTransform: 'uppercase', color: isActive ? 'var(--bq-brown-600)' : 'var(--bq-paper-500)', fontWeight: 700, marginBottom: 4 }}>
                {prayer.name}
              </div>
              <div style={{ fontFamily: 'var(--bq-font-mono)', fontSize: 20, fontWeight: 700, color: isActive ? 'var(--bq-brown-700)' : 'var(--bq-paper-800)' }}>
                {prayer.time}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Notification Modal ── */}
      {modalPrayer && (
        <NotifModal
          prayer={modalPrayer}
          currentMode={notifModes[modalPrayer.name] ?? null}
          onSelect={(mode) => handleSelectNotifMode(modalPrayer.name, mode)}
          onClose={() => setModalPrayer(null)}
        />
      )}

      {/* ── Qibla Compass ── */}
      <QiblaCompass
        qiblaBearing={qiblaAngle}
        city={lokasi}
        deviceHeading={deviceHeading}
        compassActive={compassActive}
        compassError={compassError}
        onActivate={activateCompass}
      />

      <CityPicker
        open={cityPickerOpen}
        onClose={() => setCityPickerOpen(false)}
        onSelect={(kota) => fetchByKotaId(kota.id, kota.lokasi)}
      />
    </div>
  );
}

// ─── Notification Modal Component ───
function NotifModal({
  prayer,
  currentMode,
  onSelect,
  onClose,
}: {
  prayer: { name: string; time: string; LucideIcon: React.ComponentType<{ size?: number; strokeWidth?: number }> };
  currentMode: 'hening' | 'getar' | 'adzan' | null;
  onSelect: (mode: 'hening' | 'getar' | 'adzan') => void;
  onClose: () => void;
}) {
  const options: { id: 'hening' | 'getar' | 'adzan'; label: string; desc: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }> }[] = [
    { id: 'hening', label: 'Hening',       desc: 'Tidak ada suara atau getar',    Icon: VolumeX   },
    { id: 'getar',  label: 'Getar',        desc: 'Hanya getaran perangkat',       Icon: Smartphone },
    { id: 'adzan',  label: 'Suara Adzan',  desc: 'Putar adzan saat waktu tiba',   Icon: Volume2   },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 10, 5, 0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0 12px 20px',
        animation: 'bq-modal-bg-in 0.25s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg, #FFFDF7 0%, #FBF6EC 100%)',
          borderRadius: '28px 28px 20px 20px',
          width: '100%', maxWidth: 420,
          overflow: 'hidden',
          boxShadow: '0 -4px 60px rgba(108, 82, 54, 0.18), 0 0 0 1px rgba(201,162,78,0.12)',
          animation: 'bq-modal-slide-up 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--bq-paper-300)' }} />
        </div>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bq-brown-600) 0%, var(--bq-brown-400) 60%, var(--bq-gold-400) 100%)',
          margin: '14px 18px 0',
          borderRadius: 18,
          padding: '20px 22px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent 70%)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.6, textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                Pengingat Sholat
              </div>
              <div className="bq-serif" style={{ fontSize: 26, fontWeight: 500, color: '#fff', letterSpacing: -0.3 }}>
                {prayer.name}
              </div>
              <div style={{ fontFamily: 'var(--bq-font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--bq-gold-200)', marginTop: 2 }}>
                {prayer.time}
              </div>
            </div>
            <div style={{ opacity: 0.8 }}>
              <prayer.LucideIcon size={48} strokeWidth={1.25} />
            </div>
          </div>
        </div>

        {/* Options */}
        <div style={{ padding: '18px 18px 8px' }}>
          <div style={{ fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', fontWeight: 700, color: 'var(--bq-paper-400)', marginBottom: 12 }}>
            Pilih Mode Pengingat
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {options.map((opt) => {
              const active = currentMode === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => onSelect(opt.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 18px',
                    background: active
                      ? 'linear-gradient(135deg, rgba(201,162,78,0.18), rgba(139,103,55,0.12))'
                      : 'rgba(255,255,255,0.7)',
                    border: active
                      ? '2px solid var(--bq-gold-400)'
                      : '1.5px solid var(--bq-paper-200)',
                    borderRadius: 16,
                    cursor: 'pointer',
                    transition: 'all 0.18s cubic-bezier(0.2, 0, 0, 1)',
                    textAlign: 'left',
                    boxShadow: active ? '0 4px 18px rgba(201,162,78,0.18)' : '0 1px 4px rgba(0,0,0,0.04)',
                    transform: active ? 'scale(1.015)' : 'scale(1)',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                    background: active
                      ? 'linear-gradient(135deg, var(--bq-brown-500), var(--bq-gold-400))'
                      : 'var(--bq-paper-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: active ? '0 4px 12px rgba(139,103,55,0.3)' : 'none',
                    transition: 'all 0.18s',
                  }}>
                    <opt.Icon size={20} strokeWidth={1.75} style={{ color: active ? '#fff' : 'var(--bq-paper-500)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: active ? 'var(--bq-brown-700)' : 'var(--bq-paper-800)', marginBottom: 2 }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 12, color: active ? 'var(--bq-brown-500)' : 'var(--bq-paper-400)', fontWeight: 400 }}>
                      {opt.desc}
                    </div>
                  </div>
                  {active && (
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bq-gold-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6.5L4.5 9L10 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: 'calc(100% - 36px)', margin: '12px 18px 22px',
            padding: '14px',
            background: 'none', border: '1.5px solid var(--bq-paper-200)',
            borderRadius: 14, fontSize: 14, fontWeight: 600,
            color: 'var(--bq-paper-500)', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bq-paper-100)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          <X size={15} strokeWidth={2} />
          Tutup
        </button>
      </div>

      <style>{`
        @keyframes bq-modal-bg-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bq-modal-slide-up {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
