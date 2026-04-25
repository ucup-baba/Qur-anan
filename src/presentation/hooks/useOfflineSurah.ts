'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface PrecacheProgress {
  done: number;
  total: number;
  cacheName: 'api' | 'audio';
}

const QURAN_API_BASE = 'https://equran.id/api/v2';

export function useOfflineSurah() {
  const [apiProgress, setApiProgress] = useState<PrecacheProgress | null>(null);
  const [audioProgress, setAudioProgress] = useState<PrecacheProgress | null>(null);
  const [apiDone, setApiDone] = useState(false);
  const [audioDone, setAudioDone] = useState(false);
  const workerRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker.ready.then((reg) => {
      workerRef.current = reg.active;
    });

    const handler = (e: MessageEvent) => {
      const d = e.data;
      if (!d) return;
      if (d.type === 'PRECACHE_PROGRESS') {
        const upd = { done: d.done, total: d.total, cacheName: d.cacheName };
        if (d.cacheName === 'audio') setAudioProgress(upd);
        else setApiProgress(upd);
      }
      if (d.type === 'PRECACHE_DONE') {
        if (d.cacheName === 'audio') setAudioDone(true);
        else setApiDone(true);
      }
      if (d.type === 'CACHE_CLEARED') {
        setApiProgress(null);
        setAudioProgress(null);
        setApiDone(false);
        setAudioDone(false);
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);
    return () => navigator.serviceWorker.removeEventListener('message', handler);
  }, []);

  const downloadAllSurahMeta = useCallback(async () => {
    const sw = workerRef.current;
    if (!sw) return;
    const urls = [QURAN_API_BASE + '/surat'];
    for (let i = 1; i <= 114; i++) {
      urls.push(`${QURAN_API_BASE}/surat/${i}`);
    }
    setApiDone(false);
    setApiProgress({ done: 0, total: urls.length, cacheName: 'api' });
    sw.postMessage({ type: 'PRECACHE_URLS', urls, cacheName: 'api' });
  }, []);

  const downloadAllAudio = useCallback(async (qoriId: string = '05') => {
    const sw = workerRef.current;
    if (!sw) return;
    // Fetch surah list to get each surah's full audio URL
    try {
      const res = await fetch(`${QURAN_API_BASE}/surat`);
      const json = await res.json();
      const surahs: Array<{ nomor: number; audioFull: Record<string, string> }> = json.data || [];
      const urls = surahs.map((s) => s.audioFull?.[qoriId]).filter(Boolean) as string[];
      setAudioDone(false);
      setAudioProgress({ done: 0, total: urls.length, cacheName: 'audio' });
      sw.postMessage({ type: 'PRECACHE_URLS', urls, cacheName: 'audio' });
    } catch {
      // ignore
    }
  }, []);

  const clearOfflineCache = useCallback(() => {
    const sw = workerRef.current;
    if (!sw) return;
    sw.postMessage({ type: 'CLEAR_OFFLINE_CACHE' });
  }, []);

  return {
    apiProgress,
    audioProgress,
    apiDone,
    audioDone,
    downloadAllSurahMeta,
    downloadAllAudio,
    clearOfflineCache,
  };
}
