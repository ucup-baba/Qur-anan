'use client';

import React, { useState, useRef, useCallback } from 'react';

interface BannerSliderProps {
  images: { src: string; alt?: string }[];
  aspect?: string;
  className?: string;
}

export function BannerSlider({ images, aspect = '4/3', className = '' }: BannerSliderProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isDragging = useRef(false);

  const goTo = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
    setActiveIdx(idx);
  }, []);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIdx(Math.round(el.scrollLeft / el.offsetWidth));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 8) isDragging.current = true;
  };

  const handleTouchEnd = () => { isDragging.current = false; };

  const handleClick = (idx: number) => {
    if (!isDragging.current) setLightbox(idx);
  };

  const closeLightbox = () => setLightbox(null);

  const lightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(i => (i !== null ? (i - 1 + images.length) % images.length : null));
  };
  const lightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox(i => (i !== null ? (i + 1) % images.length : null));
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ aspectRatio: aspect }}>
        {/* Scrollable strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none', height: '100%',
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => handleClick(i)}
              style={{
                flex: '0 0 100%', scrollSnapAlign: 'start',
                cursor: 'zoom-in', overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt ?? `Banner ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>

        {/* Arrows (only when >1 image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo((activeIdx - 1 + images.length) % images.length)}
              aria-label="Sebelumnya"
              style={{
                position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="#5c4033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => goTo((activeIdx + 1) % images.length)}
              aria-label="Berikutnya"
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="#5c4033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === activeIdx ? 20 : 6, height: 6,
                  borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
                  background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(10,7,3,0.88)',
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, animation: 'bq-lb-in 0.2s ease',
          }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: 38, height: 38,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '85vh', animation: 'bq-lb-scale 0.25s cubic-bezier(0.22,1,0.36,1)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightbox].src}
              alt={images[lightbox].alt ?? `Banner ${lightbox + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12, display: 'block' }}
            />
          </div>

          {/* Prev/Next in lightbox */}
          {images.length > 1 && (
            <>
              <button onClick={lightboxPrev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={lightboxNext} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                {lightbox + 1} / {images.length}
              </div>
            </>
          )}

          <style>{`
            @keyframes bq-lb-in { from{opacity:0} to{opacity:1} }
            @keyframes bq-lb-scale { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
          `}</style>
        </div>
      )}
    </>
  );
}
