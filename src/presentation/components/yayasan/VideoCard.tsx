'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { YoutubeVideo } from '@/infrastructure/api/youtubeApi';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function VideoModal({ video, onClose }: { video: YoutubeVideo; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(10,7,3,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'bq-modal-bg-in 0.2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 800,
          animation: 'bq-modal-scale-in 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--bq-gold-400)', fontWeight: 700, letterSpacing: 0.8, marginBottom: 4 }}>
              {formatDate(video.publishedAt)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', lineHeight: 1.4 }}>
              {video.title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.12)', border: 'none',
              borderRadius: '50%', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Embed */}
        <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
          />
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
          >
            Tonton di YouTube ↗
          </a>
        </div>
      </div>

      <style>{`
        @keyframes bq-modal-bg-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes bq-modal-scale-in {
          from { transform: scale(0.94); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export function VideoCard({ video }: { video: YoutubeVideo }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          background: '#fff',
          border: '1px solid var(--bq-paper-200)',
          borderRadius: 16,
          overflow: 'hidden',
          transition: 'all 0.22s cubic-bezier(0.2,0,0,1)',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(108,82,54,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--bq-paper-100)' }}>
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="var(--bq-paper-200)" />
                <path d="M16 13.5L28 20L16 26.5V13.5Z" fill="var(--bq-paper-400)" />
              </svg>
            </div>
          )}
          {/* Play button always visible */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.12)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 4L16 10L6 16V4Z" fill="var(--bq-brown-600)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--bq-gold-500)', fontWeight: 700, letterSpacing: 0.6, marginBottom: 6 }}>
            {formatDate(video.publishedAt)}
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: 'var(--bq-paper-800)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {video.title}
          </div>
        </div>
      </div>

      {open && <VideoModal video={video} onClose={() => setOpen(false)} />}
    </>
  );
}
