'use client';

import React, { useState, useRef } from 'react';
import { Icon, Icons } from '../icons';
import { Badge } from '../ui/Badge';
import type { YoutubeVideo } from '@/infrastructure/api/youtubeApi';

function VideoModal({ video, onClose }: { video: YoutubeVideo; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,7,3,0.85)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        animation: 'bq-bg-in 0.2s ease',
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 800, animation: 'bq-scale-in 0.25s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.4, flex: 1 }}>{video.title}</p>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <a href={video.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            Tonton di YouTube ↗
          </a>
        </div>
      </div>
      <style>{`
        @keyframes bq-bg-in { from{opacity:0} to{opacity:1} }
        @keyframes bq-scale-in { from{transform:scale(0.94);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}

interface KajianCardProps {
  videos: YoutubeVideo[];
}

export function KajianCard({ videos }: KajianCardProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [modalVideo, setModalVideo] = useState<YoutubeVideo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIdx(idx);
  };

  const goTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.offsetWidth, behavior: 'smooth' });
    setActiveIdx(idx);
  };

  const activeVideo = videos[activeIdx];

  return (
    <>
      <div style={{ background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)', borderRadius: 'var(--bq-radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* ── Swipeable thumbnails ── */}
        <div style={{ position: 'relative' }}>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none', msOverflowStyle: 'none',
            }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setModalVideo(video)}
                style={{
                  flex: '0 0 100%', scrollSnapAlign: 'start',
                  position: 'relative', aspectRatio: '16/10',
                  cursor: 'pointer', background: 'var(--bq-paper-100)',
                }}
              >
                {video.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {/* Play button */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6 4L16 10L6 16V4Z" fill="var(--bq-brown-600)" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          {videos.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
              {videos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === activeIdx ? 20 : 6, height: 6,
                    borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
                    background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.25s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Card body ── */}
        <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <div><Badge tone="gold">Kajian</Badge></div>
          <div>
            <h3 className="bq-serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px', color: 'var(--bq-paper-800)', letterSpacing: -0.2 }}>
              Kajian Sabtu Pagi
            </h3>
            <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', margin: 0, lineHeight: 1.5, minHeight: 38, transition: 'opacity 0.2s' }}>
              {activeVideo?.title ?? 'Kajian tafsir rutin bersama Ust. Ahmad Faisal setiap pekan.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--bq-paper-600)', paddingTop: 4, borderTop: '1px dashed var(--bq-paper-200)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <Icon d={Icons.Clock} size={14} style={{ color: 'var(--bq-paper-400)' }} />
              Setiap Sabtu · 06:00 – 07:00 WIB
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon d={Icons.MapPin} size={14} style={{ color: 'var(--bq-paper-400)' }} />
              Masjid Baitul Qowwam
            </div>
          </div>
        </div>
      </div>

      {modalVideo && <VideoModal video={modalVideo} onClose={() => setModalVideo(null)} />}

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
