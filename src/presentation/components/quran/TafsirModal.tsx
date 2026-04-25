'use client';

/**
 * TafsirModal.tsx — Full-screen modal overlay for reading Tafsir per ayat.
 * Uses equran.id API v2 via quranApi.getTafsir().
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Icon, Icons } from '../icons';
import { quranApi } from '@/infrastructure/api/quranApi';
import type { TafsirAyat } from '@/domain/entities/surah';
import { sanitizeHtml } from '@/infrastructure/utils/sanitizeHtml';

interface TafsirModalProps {
  surahNomor: number;
  surahName: string;
  ayatNomor: number;
  onClose: () => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({ surahNomor, surahName, ayatNomor, onClose }) => {
  const [tafsir, setTafsir] = useState<TafsirAyat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    quranApi.getTafsir(surahNomor)
      .then(data => {
        const found = data.tafsir.find(t => t.ayat === ayatNomor);
        setTafsir(found ?? null);
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [surahNomor, ayatNomor]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div className="bq-tafsir-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="bq-tafsir-modal">
        {/* Header */}
        <div className="bq-tafsir-header">
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: 'var(--bq-gold-400)', fontWeight: 600, marginBottom: 4 }}>
              TAFSIR KEMENAG
            </div>
            <h2 className="bq-serif" style={{ fontSize: 24, fontWeight: 500, margin: 0, color: 'var(--bq-paper-800)' }}>
              {surahName} : {ayatNomor}
            </h2>
          </div>
          <button className="bq-tafsir-close" onClick={onClose}>
            <Icon d={Icons.X} size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="bq-tafsir-body">
          {loading && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--bq-paper-400)' }}>
              <div className="bq-arabic" style={{ fontSize: 28, marginBottom: 12, opacity: 0.5 }}>بِسْمِ ٱللَّهِ</div>
              <div style={{ fontSize: 13 }}>Memuat tafsir...</div>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: 40, color: '#e53e3e', fontSize: 13 }}>
              Gagal memuat tafsir: {error}
            </div>
          )}

          {!loading && !error && !tafsir && (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--bq-paper-400)', fontSize: 13 }}>
              Tafsir untuk ayat ini tidak tersedia.
            </div>
          )}

          {tafsir && (
            <SafeTafsirBody text={tafsir.teks} />
          )}
        </div>
      </div>

      <style>{`
        .bq-tafsir-backdrop {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(4px);
          animation: bq-tafsir-fade-in 0.25s ease;
        }
        @keyframes bq-tafsir-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .bq-tafsir-modal {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          z-index: 201;
          max-height: 85vh;
          background: #fff;
          border-radius: 24px 24px 0 0;
          display: flex; flex-direction: column;
          box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
          animation: bq-tafsir-slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (min-width: 768px) {
          .bq-tafsir-modal {
            max-width: 680px;
            margin: 0 auto;
            bottom: 40px;
            border-radius: 24px;
            max-height: 80vh;
          }
        }
        @keyframes bq-tafsir-slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }

        .bq-tafsir-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 24px 24px 16px;
          border-bottom: 1px solid var(--bq-paper-200);
          flex-shrink: 0;
        }
        .bq-tafsir-close {
          width: 36px; height: 36px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--bq-paper-100); border: none;
          border-radius: 50%; cursor: pointer;
          color: var(--bq-paper-600);
          transition: all 0.15s;
        }
        .bq-tafsir-close:hover {
          background: var(--bq-paper-200);
          color: var(--bq-paper-800);
        }

        .bq-tafsir-body {
          flex: 1; overflow-y: auto;
          padding: 24px;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </>
  );
};

function SafeTafsirBody({ text }: { text: string }) {
  const sanitized = useMemo(() => sanitizeHtml(text), [text]);
  return (
    <div
      style={{
        fontSize: 15,
        lineHeight: 1.9,
        color: 'var(--bq-paper-700)',
        letterSpacing: 0.2,
      }}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
