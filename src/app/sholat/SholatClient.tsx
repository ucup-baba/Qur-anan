'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/presentation/components/ui/Button';
import { Icon, Icons } from '@/presentation/components/icons';
import { Moon, Sun, CloudSun, Sunset, Star, Loader2, LocateFixed, Navigation } from 'lucide-react';
import type { SholatJadwal } from '@/infrastructure/api/sholatApi';

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
    <div style={{
      background: 'linear-gradient(180deg, var(--bq-paper-100) 0%, var(--bq-paper-50) 100%)',
      border: '1px solid var(--bq-paper-200)',
      borderRadius: 'var(--bq-radius-xl)',
      padding: '32px 28px 28px',
      position: 'relative',
      overflow: 'hidden',
      marginBottom: 24,
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
  const [jadwalData, setJadwalData] = useState<SholatJadwal | null>(initialJadwal);
  const [lokasi, setLokasi] = useState<string>(initialLokasi);
  const [dateStr, setDateStr] = useState<string>(initialDateStr);
  const [isLoadingGPS, setIsLoadingGPS] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Compass / Qibla state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [compassActive, setCompassActive] = useState(false);
  const [compassError, setCompassError] = useState<string>('');
  const orientationHandler = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const PRAYER_TIMES = jadwalData ? [
    { name: 'Subuh',   time: jadwalData.subuh,   LucideIcon: Moon },
    { name: 'Dzuhur',  time: jadwalData.dzuhur,  LucideIcon: Sun },
    { name: 'Ashar',   time: jadwalData.ashar,   LucideIcon: CloudSun },
    { name: 'Maghrib', time: jadwalData.maghrib, LucideIcon: Sunset },
    { name: 'Isya',    time: jadwalData.isya,    LucideIcon: Star },
  ] : [
    { name: 'Subuh',   time: '--:--', LucideIcon: Moon },
    { name: 'Dzuhur',  time: '--:--', LucideIcon: Sun },
    { name: 'Ashar',   time: '--:--', LucideIcon: CloudSun },
    { name: 'Maghrib', time: '--:--', LucideIcon: Sunset },
    { name: 'Isya',    time: '--:--', LucideIcon: Star },
  ];

  const getNextPrayer = () => {
    if (!jadwalData) return PRAYER_TIMES[0];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    for (const p of PRAYER_TIMES) {
      if (!p.time || p.time === '--:--') continue;
      const [h, m] = p.time.split(':').map(Number);
      if (h * 60 + m > currentTime) return p;
    }
    return PRAYER_TIMES[0];
  };

  const nextPrayer = getNextPrayer();

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
          const searchKeyword = geoData.city || geoData.locality || geoData.principalSubdivision;
          if (!searchKeyword) throw new Error('Tidak dapat menemukan nama kota dari lokasi Anda.');

          const kotaRes = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(searchKeyword)}`);
          const kotaData = await kotaRes.json();
          if (!kotaData.status || kotaData.data.length === 0)
            throw new Error(`Kota "${searchKeyword}" tidak ditemukan di database.`);

          const kotaId = kotaData.data[0].id;
          const targetDate = new Date();
          const year = targetDate.getFullYear();
          const month = String(targetDate.getMonth() + 1).padStart(2, '0');
          const day = String(targetDate.getDate()).padStart(2, '0');

          const jadwalRes = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${kotaId}/${year}/${month}/${day}`);
          const jadwalDataRes = await jadwalRes.json();
          if (!jadwalDataRes.status) throw new Error('Gagal mengambil jadwal sholat untuk lokasi tersebut.');

          setJadwalData(jadwalDataRes.data.jadwal);
          setLokasi(jadwalDataRes.data.lokasi);
          setDateStr(jadwalDataRes.data.jadwal.tanggal);
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
  }, []);

  const hasRequestedLoc = useRef(false);
  useEffect(() => {
    if (!hasRequestedLoc.current) {
      hasRequestedLoc.current = true;
      handleUseLocation();
    }
  }, [handleUseLocation]);

  // ── Activate compass ──
  const activateCompass = useCallback(async () => {
    setCompassError('');

    // iOS 13+ requires permission
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

    if (orientationHandler.current) {
      window.removeEventListener('deviceorientation', orientationHandler.current);
    }

    const handler = (e: DeviceOrientationEvent) => {
      // alpha = compass heading (0-360, degrees from North)
      if (e.alpha !== null) {
        setDeviceHeading(e.alpha);
      }
    };

    orientationHandler.current = handler;
    window.addEventListener('deviceorientation', handler, true);
    setCompassActive(true);
  }, []);

  useEffect(() => {
    return () => {
      if (orientationHandler.current) {
        window.removeEventListener('deviceorientation', orientationHandler.current);
      }
    };
  }, []);



  return (
    <div className="min-h-[80vh] py-10 md:py-14 px-4 md:px-6 max-w-[800px] mx-auto">

      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-500)', fontWeight: 600, marginBottom: 8 }}>
          Jadwal
        </div>
        <h1 className="bq-serif" style={{ fontSize: 36, fontWeight: 500, margin: '0 0 14px', color: 'var(--bq-paper-800)', letterSpacing: -0.5 }}>
          Waktu Sholat
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
            <Icon d={Icons.MapPin} size={16} style={{ color: 'var(--bq-paper-400)' }} />
            <span style={{ color: 'var(--bq-paper-700)', fontWeight: 500 }}>{lokasi}</span>
          </div>
          <button
            onClick={handleUseLocation}
            disabled={isLoadingGPS}
            style={{
              background: 'none', border: '1px solid var(--bq-paper-200)',
              padding: '3px 10px', borderRadius: 20, fontSize: 12,
              color: 'var(--bq-brown-600)', cursor: isLoadingGPS ? 'wait' : 'pointer',
              fontWeight: 600, transition: 'all 0.15s',
            }}
          >
            {isLoadingGPS
              ? <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Loader2 size={11} className="animate-spin" /> Mencari...</span>
              : <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LocateFixed size={11} /> Perbarui</span>
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
          return (
            <div
              key={prayer.name}
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
              }}
            >
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

      {/* ── Qibla Compass ── */}
      <QiblaCompass
        qiblaBearing={qiblaAngle}
        city={lokasi}
        deviceHeading={deviceHeading}
        compassActive={compassActive}
        compassError={compassError}
        onActivate={activateCompass}
      />

    </div>
  );
}
