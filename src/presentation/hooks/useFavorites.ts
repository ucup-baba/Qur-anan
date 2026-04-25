'use client';

import { useState, useEffect } from 'react';
import { bumpLocalUpdatedAt } from '@/infrastructure/firebase/sync';

const FAVORITES_KEY = 'bq_favorites_v2';

interface FavoritesData {
  surahs: number[];
  ayats: string[]; // "surah:ayat" format
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesData>({
    surahs: [1, 18, 36, 67], // Default popular surahs
    ayats: ["1:1", "18:10", "2:255"] // Default popular ayats (Al-Fatihah 1, Kahf 10, Ayat Kursi)
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
      setIsLoaded(true);
    };
    load();
    const onSync = () => load();
    window.addEventListener('bq-sync-applied', onSync);
    return () => window.removeEventListener('bq-sync-applied', onSync);
  }, []);

  const save = (data: FavoritesData) => {
    setFavorites(data);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(data));
    bumpLocalUpdatedAt();
  };

  const toggleSurah = (surahNumber: number) => {
    const next = favorites.surahs.includes(surahNumber)
      ? favorites.surahs.filter(n => n !== surahNumber)
      : [...favorites.surahs, surahNumber];
    save({ ...favorites, surahs: next });
  };

  const toggleAyat = (surahNumber: number, ayatNumber: number) => {
    const key = `${surahNumber}:${ayatNumber}`;
    const next = favorites.ayats.includes(key)
      ? favorites.ayats.filter(k => k !== key)
      : [...favorites.ayats, key];
    save({ ...favorites, ayats: next });
  };

  const isSurahFavorite = (n: number) => favorites.surahs.includes(n);
  const isAyatFavorite = (s: number, a: number) => favorites.ayats.includes(`${s}:${a}`);

  return {
    favorites,
    toggleSurah,
    toggleAyat,
    isSurahFavorite,
    isAyatFavorite,
    isLoaded
  };
}
