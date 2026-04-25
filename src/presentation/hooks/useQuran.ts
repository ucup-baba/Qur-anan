'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Surah, SurahDetail } from '@/domain/entities/surah';
import type { LastRead } from '@/domain/entities/bookmark';
import { quranApi } from '@/infrastructure/api/quranApi';
import { storageService } from '@/infrastructure/storage/localStorageService';
import { bumpLocalUpdatedAt } from '@/infrastructure/firebase/sync';

// ─── Hook: Surah List ───
export function useSurahList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    quranApi.listSurahs()
      .then(setSurahs)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { surahs, loading, error };
}

// ─── Hook: Surah Detail ───
export function useSurahDetail(nomor: number) {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (nomor < 1 || nomor > 114) return;
    setLoading(true);
    quranApi.getSurah(nomor)
      .then(setSurah)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [nomor]);

  return { surah, loading, error };
}

// ─── Hook: Last Read ───
export function useLastRead() {
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  useEffect(() => {
    const load = () => setLastRead(storageService.getLastRead());
    load();
    const onSync = () => load();
    window.addEventListener('bq-sync-applied', onSync);
    return () => window.removeEventListener('bq-sync-applied', onSync);
  }, []);

  const updateLastRead = useCallback((data: LastRead) => {
    storageService.setLastRead(data);
    setLastRead(data);
    bumpLocalUpdatedAt();
  }, []);

  return { lastRead, updateLastRead };
}

// ─── Hook: Audio Player ───
export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => { setPlaying(false); setProgress(0); });

    return () => { audio.pause(); audio.src = ''; };
  }, []);

  const play = useCallback((src: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.src !== src) {
      audio.src = src;
      audio.load();
    }
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback((src: string) => {
    if (playing && audioRef.current?.src === src) {
      pause();
    } else {
      play(src);
    }
  }, [playing, play, pause]);

  return { playing, progress, currentTime, duration, play, pause, toggle };
}
