'use client';

import React, { useState, useRef } from 'react';
import { Icon, Icons } from '../icons';
import { Badge } from '../ui/Badge';
import type { YoutubeVideo } from '@/infrastructure/api/youtubeApi';

import { useAuth } from '@/presentation/hooks/useAuth';

function VideoModal({ video, onClose }: { video: YoutubeVideo; onClose: () => void }) {
  const { user, signInWithGoogle } = useAuth();

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

        {user ? (
          <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: '#000' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        ) : (
          <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: '#1a1a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Icon d={Icons.Lock} size={32} style={{ color: 'var(--bq-gold-500)' }} />
            </div>
            <h3 style={{ color: '#fff', margin: '0 0 12px', fontSize: 20, fontWeight: 600 }}>Konten Terkunci</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: '0 0 24px', maxWidth: 400, lineHeight: 1.6 }}>
              Jika ingin menonton kajian di aplikasi ini maka Anda harus masuk terlebih dahulu.
            </p>
            <button 
              onClick={signInWithGoogle} 
              style={{ 
                background: '#fff', color: '#000', border: 'none', borderRadius: 8, 
                padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Masuk dengan Google
            </button>
          </div>
        )}

        {!user && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 12, margin: '0 0 12px 0' }}>
              Anda masih bisa menonton video ini melalui channel YouTube kami di bawah ini:
            </p>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 8, 
                background: 'rgba(255,255,255,0.1)', color: '#fff', textDecoration: 'none', 
                padding: '10px 20px', borderRadius: 24, fontSize: 14, fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Buka Channel YouTube
            </a>
          </div>
        )}
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
  const { user, isYoutubeSubscribed } = useAuth();
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
          
          {/* Subscribe CTA for Logged In Users */}
          {user && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--bq-paper-200)', textAlign: 'center' }}>
              {isYoutubeSubscribed ? (
                <div style={{ padding: '8px 16px', background: 'rgba(52, 168, 83, 0.1)', borderRadius: 12, border: '1px solid rgba(52, 168, 83, 0.2)' }}>
                  <p style={{ fontSize: 13, color: '#2d8641', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
                    Jazakallahu Khairan! Terima kasih telah subscribe ke channel YouTube Yayasan.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, color: 'var(--bq-paper-600)', marginBottom: 12, lineHeight: 1.5 }}>
                    Bagi yang belum subscribe, dukung channel YouTube Yayasan.
                  </p>
                  <a 
                    href="https://www.youtube.com/@yayasanbaitulqowwam9014?sub_confirmation=1" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 6, 
                      background: '#FF0000', color: '#fff', textDecoration: 'none', 
                      padding: '8px 16px', borderRadius: 24, fontSize: 13, fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(255,0,0,0.2)', transition: 'transform 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.498 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    Subscribe ke YouTube
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {modalVideo && <VideoModal video={modalVideo} onClose={() => setModalVideo(null)} />}

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
