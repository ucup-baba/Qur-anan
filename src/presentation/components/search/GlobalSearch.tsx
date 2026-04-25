'use client';

/**
 * GlobalSearch.tsx — Floating search overlay (Command+K / Ctrl+K style).
 * Searches surah names, numbers, and terjemahan across all 114 surahs.
 */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Icons } from '../icons';
import { quranApi } from '@/infrastructure/api/quranApi';
import type { Surah } from '@/domain/entities/surah';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Load surah list on first open
  useEffect(() => {
    if (open) {
      quranApi.listSurahs().then(setSurahs).catch(() => {});
      setQuery('');
      setSelectedIdx(0);
      // Focus input after mount animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!open) {
          // This component doesn't control open state, parent does
        }
      }
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return surahs.slice(0, 15); // Show first 15 when no query
    const q = query.toLowerCase().trim();
    return surahs.filter(s =>
      s.namaLatin.toLowerCase().includes(q) ||
      s.arti.toLowerCase().includes(q) ||
      s.nama.includes(q) ||
      s.nomor.toString() === q
    ).slice(0, 20);
  }, [surahs, query]);

  // Reset selection when results change
  useEffect(() => { setSelectedIdx(0); }, [results]);

  // Navigate to result
  const navigateTo = useCallback((nomor: number) => {
    onClose();
    router.push(`/quran/${nomor}`);
  }, [router, onClose]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIdx]) {
      navigateTo(results[selectedIdx].nomor);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="bq-search-backdrop" onClick={onClose} />

      {/* Search dialog */}
      <div className="bq-search-dialog" onKeyDown={handleKeyDown}>
        {/* Search input */}
        <div className="bq-search-input-wrap">
          <Icon d={Icons.Search} size={20} style={{ color: 'var(--bq-paper-400)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari surah, arti, atau nomor..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="bq-search-input"
            autoComplete="off"
          />
          <kbd className="bq-search-kbd">ESC</kbd>
        </div>

        {/* Results */}
        <div className="bq-search-results">
          {results.length === 0 ? (
            <div className="bq-search-empty">
              Tidak ditemukan surah yang cocok dengan &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((s, idx) => (
              <button
                key={s.nomor}
                className={`bq-search-item ${idx === selectedIdx ? 'bq-search-item-active' : ''}`}
                onClick={() => navigateTo(s.nomor)}
                onMouseEnter={() => setSelectedIdx(idx)}
              >
                <span className="bq-search-item-num">{s.nomor}</span>
                <div className="bq-search-item-info">
                  <div className="bq-search-item-name">{s.namaLatin}</div>
                  <div className="bq-search-item-meta">{s.arti} · {s.jumlahAyat} ayat · {s.tempatTurun === 'Mekah' ? 'Makkiyyah' : 'Madaniyyah'}</div>
                </div>
                <span className="bq-arabic bq-search-item-arabic">{s.nama}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bq-search-footer">
          <span>↑↓ untuk navigasi</span>
          <span>↵ untuk membuka</span>
          <span>ESC untuk menutup</span>
        </div>
      </div>

      <style>{`
        .bq-search-backdrop {
          position: fixed; inset: 0; z-index: 300;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          animation: bq-search-fade 0.2s ease;
        }
        @keyframes bq-search-fade {
          from { opacity: 0; } to { opacity: 1; }
        }

        .bq-search-dialog {
          position: fixed;
          top: 10vh; left: 50%; transform: translateX(-50%);
          width: 94%; max-width: 580px;
          z-index: 301;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          border: 1px solid var(--bq-paper-200);
          overflow: hidden;
          display: flex; flex-direction: column;
          max-height: 70vh;
          animation: bq-search-pop 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes bq-search-pop {
          from { opacity: 0; transform: translateX(-50%) scale(0.95) translateY(-10px); }
          to   { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }

        .bq-search-input-wrap {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--bq-paper-200);
        }
        .bq-search-input {
          flex: 1; border: none; outline: none;
          font-size: 16px; font-weight: 500;
          color: var(--bq-paper-800);
          background: transparent;
        }
        .bq-search-input::placeholder {
          color: var(--bq-paper-400);
        }
        .bq-search-kbd {
          font-size: 10px; font-weight: 600;
          color: var(--bq-paper-500);
          background: var(--bq-paper-100);
          border: 1px solid var(--bq-paper-200);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: var(--bq-font-mono);
        }

        .bq-search-results {
          flex: 1; overflow-y: auto; padding: 8px;
          -webkit-overflow-scrolling: touch;
        }
        .bq-search-empty {
          padding: 32px; text-align: center;
          color: var(--bq-paper-400); font-size: 13px;
        }

        .bq-search-item {
          display: flex; align-items: center; gap: 12px;
          width: 100%; padding: 10px 12px;
          border: none; background: transparent;
          border-radius: 12px; cursor: pointer;
          text-align: left; transition: background 0.1s;
        }
        .bq-search-item:hover,
        .bq-search-item-active {
          background: var(--bq-paper-100);
        }
        .bq-search-item-num {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--bq-brown-500), var(--bq-brown-400));
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          font-family: var(--bq-font-mono);
          flex-shrink: 0;
        }
        .bq-search-item-info {
          flex: 1; min-width: 0;
        }
        .bq-search-item-name {
          font-size: 14px; font-weight: 600;
          color: var(--bq-paper-800);
        }
        .bq-search-item-meta {
          font-size: 11px; color: var(--bq-paper-500); margin-top: 1px;
        }
        .bq-search-item-arabic {
          font-size: 20px; color: var(--bq-paper-600);
          flex-shrink: 0;
        }

        .bq-search-footer {
          display: flex; gap: 16px; justify-content: center;
          padding: 10px; border-top: 1px solid var(--bq-paper-200);
          font-size: 11px; color: var(--bq-paper-400);
        }
        @media (max-width: 640px) {
          .bq-search-footer { display: none; }
          .bq-search-kbd { display: none; }
        }
      `}</style>
    </>
  );
};
