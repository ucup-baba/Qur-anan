'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon, Icons } from '../icons';
import type { SurahDetail } from '@/domain/entities/surah';
import { useAudioStore, QORI_LIST, type QoriId } from '@/presentation/hooks/useAudioStore';

interface Props {
  surah: SurahDetail;
}

const STORAGE_KEY = 'bq-downloaded-surahs';

function loadDownloaded(): Record<string, true> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
}

function markDownloaded(surahNo: number, qoriId: QoriId) {
  if (typeof window === 'undefined') return;
  try {
    const cur = loadDownloaded();
    cur[`${surahNo}_${qoriId}`] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cur));
  } catch {}
}

export function DownloadSurahButton({ surah }: Props) {
  const qoriId = useAudioStore(s => s.qoriId);
  const qori = QORI_LIST.find(q => q.id === qoriId) ?? QORI_LIST[4];
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [downloaded, setDownloaded] = useState<Record<string, true>>({});
  const cancelRef = useRef(false);

  useEffect(() => {
    setDownloaded(loadDownloaded());
  }, []);

  const isDownloaded = downloaded[`${surah.nomor}_${qoriId}`] === true;

  const handleDownload = async () => {
    setOpen(false);
    cancelRef.current = false;

    const urls = surah.ayat
      .map(a => a.audio[qoriId])
      .filter((u): u is string => Boolean(u));

    if (urls.length === 0) return;

    setProgress(0);
    let done = 0;

    for (const url of urls) {
      if (cancelRef.current) {
        setProgress(null);
        return;
      }
      try {
        await fetch(url, { mode: 'no-cors', cache: 'force-cache' });
      } catch {}
      done++;
      setProgress(done / urls.length);
    }

    markDownloaded(surah.nomor, qoriId);
    setDownloaded(loadDownloaded());
    setProgress(null);
  };

  const handleCancel = () => {
    cancelRef.current = true;
  };

  if (progress !== null) {
    const pct = Math.round(progress * 100);
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--bq-paper-50)', border: '1px solid var(--bq-paper-200)',
        borderRadius: 999, padding: '6px 6px 6px 12px',
        fontSize: 12, fontWeight: 600, color: 'var(--bq-paper-700)',
        minWidth: 180,
      }}>
        <span style={{ flexShrink: 0 }}>Mengunduh</span>
        <div style={{ flex: 1, height: 4, background: 'var(--bq-paper-200)', borderRadius: 2, overflow: 'hidden', minWidth: 60 }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--bq-gold-300), var(--bq-gold-500))',
            transition: 'width 0.2s ease',
          }} />
        </div>
        <span style={{ fontSize: 11, fontVariantNumeric: 'tabular-nums', color: 'var(--bq-paper-500)' }}>{pct}%</span>
        <button
          onClick={handleCancel}
          aria-label="Batal"
          style={{
            background: 'var(--bq-paper-200)', border: 'none', color: 'var(--bq-paper-600)',
            width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon d={Icons.X} size={11} />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={isDownloaded ? `Sudah diunduh — ${qori.short}` : `Unduh murottal ${qori.short}`}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: isDownloaded ? 'var(--bq-gold-50)' : 'var(--bq-paper-50)',
          border: `1px solid ${isDownloaded ? 'var(--bq-gold-300)' : 'var(--bq-paper-200)'}`,
          color: isDownloaded ? 'var(--bq-gold-600)' : 'var(--bq-paper-700)',
          borderRadius: 999, padding: '7px 13px',
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.18s',
        }}
      >
        <Icon d={isDownloaded ? Icons.Check : Icons.Download} size={14} />
        {isDownloaded ? 'Tersimpan offline' : 'Unduh untuk offline'}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(8,5,2,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16, animation: 'bq-dl-bg 0.2s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bq-paper-50)', borderRadius: 20,
              padding: 24, maxWidth: 380, width: '100%',
              boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
              animation: 'bq-dl-pop 0.28s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--bq-gold-400), var(--bq-gold-600))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14, color: '#fff',
            }}>
              <Icon d={Icons.Download} size={22} />
            </div>
            <h3 className="bq-serif" style={{ fontSize: 20, fontWeight: 500, margin: '0 0 6px', color: 'var(--bq-paper-800)' }}>
              Unduh {surah.namaLatin}?
            </h3>
            <p style={{ fontSize: 13, color: 'var(--bq-paper-500)', lineHeight: 1.55, margin: '0 0 16px' }}>
              Murottal <strong style={{ color: 'var(--bq-paper-700)' }}>{qori.short}</strong> sebanyak {surah.jumlahAyat} ayat akan disimpan ke perangkat untuk diputar tanpa internet.
            </p>
            <div style={{
              fontSize: 11, color: 'var(--bq-paper-500)', background: 'var(--bq-paper-100)',
              padding: '10px 12px', borderRadius: 10, marginBottom: 18, lineHeight: 1.5,
            }}>
              💡 Untuk mengubah qori, tutup dialog ini lalu buka pengaturan murottal di pemutar audio.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  padding: '10px 16px', borderRadius: 12,
                  background: 'transparent', border: 'none',
                  color: 'var(--bq-paper-600)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                onClick={handleDownload}
                style={{
                  padding: '10px 18px', borderRadius: 12,
                  background: 'linear-gradient(135deg, var(--bq-brown-500), var(--bq-brown-600))',
                  border: 'none', color: '#fff',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(108,82,54,0.3)',
                }}
              >
                Unduh sekarang
              </button>
            </div>
          </div>
          <style>{`
            @keyframes bq-dl-bg { from{opacity:0} to{opacity:1} }
            @keyframes bq-dl-pop { from{opacity:0;transform:translateY(20px) scale(0.94)} to{opacity:1;transform:translateY(0) scale(1)} }
          `}</style>
        </div>
      )}
    </>
  );
}
