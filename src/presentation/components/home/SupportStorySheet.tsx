'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Slide {
  arabic?: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    arabic: 'بِسْمِ ٱللَّهِ',
    eyebrow: 'Salam dari kami',
    title: 'Aplikasi ini\ndibuat dengan hati.',
    body: 'Setiap baris kode, setiap pilihan warna — kami niatkan agar lebih banyak hati dapat dekat dengan Al-Qur’an, kapan pun, di mana pun ia berada.',
    accent: 'linear-gradient(135deg, #6c5236 0%, #8b6f4a 100%)',
  },
  {
    arabic: 'ٱقْرَأْ',
    eyebrow: 'Niat kami',
    title: 'Mempermudah\nmembaca firman-Nya.',
    body: 'Di sela perjalanan, di waktu istirahat, atau di tengah kesibukan harian — semoga aplikasi ini menjadi pintu kecil menuju ayat-ayat yang menenangkan.',
    accent: 'linear-gradient(135deg, #8b6f4a 0%, #c9a24e 100%)',
  },
  {
    arabic: '❦',
    eyebrow: 'Permohonan kami',
    title: 'Bantu kami\nmenyempurnakannya.',
    body: 'Saran, kritik, atau sekadar cerita pengalaman Anda — semua sangat berarti. Kami terus belajar agar aplikasi ini bisa lebih bermanfaat untuk umat.',
    accent: 'linear-gradient(135deg, #c9a24e 0%, #e0bc6a 100%)',
  },
  {
    arabic: 'دُعَاء',
    eyebrow: 'Yang kami harapkan',
    title: 'Cukup do’a\ndan masukan Anda.',
    body: 'Kami tidak meminta apa-apa. Sebait do’a yang Anda titipkan jauh lebih bernilai dari apa pun yang dapat kami terima di dunia ini.',
    accent: 'linear-gradient(135deg, #6c5236 0%, #c9a24e 100%)',
  },
  {
    arabic: '۝',
    eyebrow: 'Jika berkenan',
    title: 'Bantulah\nyayasan kami.',
    body: 'Yayasan Baitul Qowwam — yang menampung dan merawat para santri yatim. Tempat tumbuhnya niat baik, termasuk lahirnya aplikasi yang sedang Anda baca ini.',
    accent: 'linear-gradient(135deg, #4a3a26 0%, #6c5236 100%)',
  },
  {
    arabic: 'جَزَاكُمُ ٱللَّهُ خَيْرًا',
    eyebrow: 'Terima kasih',
    title: 'Mari berkenalan\nlebih dekat.',
    body: 'Yuk lihat profil yayasan, kegiatan santri, dan cara Anda dapat ikut serta dalam langkah kecil ini.',
    accent: 'linear-gradient(135deg, #c9a24e 0%, #6c5236 100%)',
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SupportStorySheet({ open, onClose }: Props) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const isLast = idx === SLIDES.length - 1;
  const slide = SLIDES[idx];

  const close = useCallback(() => {
    onClose();
    setTimeout(() => setIdx(0), 280);
  }, [onClose]);

  const next = useCallback(() => {
    if (isLast) {
      close();
      router.push('/yayasan');
      return;
    }
    setDirection('forward');
    setIdx(i => i + 1);
  }, [isLast, close, router]);

  const prev = useCallback(() => {
    if (idx === 0) return;
    setDirection('back');
    setIdx(i => i - 1);
  }, [idx]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [open]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, next, prev, close]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next(); else prev();
    } else if (dy > 80) {
      close();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(8, 5, 2, 0.6)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'sheet-bg-in 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      onClick={close}
    >
      <div
        onClick={e => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: 'relative',
          width: '100%', maxWidth: 440, height: 'min(720px, 92vh)',
          borderRadius: 28,
          overflow: 'hidden',
          background: '#FBF8F2',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(201, 162, 78, 0.15)',
          animation: 'sheet-card-in 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Top accent header */}
        <div style={{
          position: 'relative',
          height: 220,
          background: slide.accent,
          transition: 'background 0.6s ease',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -60, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -30, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%)' }} />

          {/* Close */}
          <button
            onClick={close}
            aria-label="Tutup"
            style={{
              position: 'absolute', top: 14, right: 14,
              background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M11 3L3 11" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {/* Progress dots */}
          <div style={{ position: 'absolute', top: 18, left: 18, right: 70, display: 'flex', gap: 4 }}>
            {SLIDES.map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: i <= idx ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.25)',
                  transition: 'background 0.4s ease',
                }}
              />
            ))}
          </div>

          {/* Arabic ornament */}
          <div
            key={`arabic-${idx}`}
            className="bq-arabic"
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 56, color: 'rgba(255,255,255,0.96)',
              letterSpacing: 0,
              textShadow: '0 4px 20px rgba(0,0,0,0.18)',
              animation: 'sheet-arabic-in 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
              pointerEvents: 'none',
            }}
          >
            {slide.arabic}
          </div>

          {/* Eyebrow chip */}
          <div style={{ position: 'absolute', bottom: 14, left: 18 }}>
            <div
              key={`eb-${idx}`}
              style={{
                display: 'inline-block',
                fontSize: 10, fontWeight: 800, letterSpacing: 1.6, textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.95)',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.22)',
                padding: '5px 10px', borderRadius: 999,
                backdropFilter: 'blur(8px)',
                animation: 'sheet-fade-up 0.5s 0.05s both cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {slide.eyebrow}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{
          flex: 1,
          padding: '28px 26px 22px',
          display: 'flex', flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}>
          <div
            key={`title-${idx}`}
            className="bq-serif"
            style={{
              fontSize: 26, fontWeight: 500, lineHeight: 1.18,
              color: '#3a2d1d', letterSpacing: -0.5,
              whiteSpace: 'pre-line', marginBottom: 14,
              animation: `sheet-${direction === 'forward' ? 'slide-in-r' : 'slide-in-l'} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both`,
            }}
          >
            {slide.title}
          </div>

          <p
            key={`body-${idx}`}
            style={{
              fontSize: 14.5, lineHeight: 1.65, color: '#6B5A44', margin: 0,
              animation: 'sheet-fade-up 0.55s 0.08s both cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {slide.body}
          </p>

          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 18 }}>
            <button
              onClick={prev}
              disabled={idx === 0}
              style={{
                padding: '10px 14px', borderRadius: 12,
                background: 'transparent', border: 'none',
                color: idx === 0 ? '#C8BFA8' : '#6c5236',
                fontSize: 13, fontWeight: 700,
                cursor: idx === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'color 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 3L4 7L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Kembali
            </button>

            <button
              onClick={next}
              style={{
                padding: '12px 22px', borderRadius: 14,
                background: isLast ? 'linear-gradient(135deg, #6c5236, #8b6f4a)' : '#3a2d1d',
                border: 'none',
                color: '#FBF8F2',
                fontSize: 13.5, fontWeight: 700, letterSpacing: 0.2,
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: isLast ? '0 8px 22px rgba(108, 82, 54, 0.4)' : '0 4px 14px rgba(58, 45, 29, 0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              {isLast ? 'Lihat Yayasan' : 'Lanjut'}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7H11M11 7L7 3M11 7L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <style>{`
          @keyframes sheet-bg-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes sheet-card-in {
            from { opacity: 0; transform: scale(0.92) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes sheet-slide-in-r {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes sheet-slide-in-l {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes sheet-fade-up {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes sheet-arabic-in {
            from { opacity: 0; transform: scale(0.85); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
