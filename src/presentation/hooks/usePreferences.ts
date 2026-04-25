'use client';

import { useEffect, useState, useCallback } from 'react';
import { bumpLocalUpdatedAt } from '@/infrastructure/firebase/sync';

const KEY = 'qu:preferences:v1';

export interface Preferences {
  arabicSize: 'sm' | 'md' | 'lg';
  showTransliteration: boolean;
  tajwidMode: boolean;
  theme: 'light' | 'system';
  notifSubuh: boolean;
  notifDzuhur: boolean;
  notifAshar: boolean;
  notifMaghrib: boolean;
  notifIsya: boolean;
  notifAyatHarian: boolean;
}

const defaults: Preferences = {
  arabicSize: 'md',
  showTransliteration: true,
  tajwidMode: false,
  theme: 'light',
  notifSubuh: true,
  notifDzuhur: true,
  notifAshar: true,
  notifMaghrib: true,
  notifIsya: true,
  notifAyatHarian: false,
};

function readStored(): Preferences {
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const load = () => {
      setPrefs(readStored());
      setHydrated(true);
    };
    load();
    const onSync = () => load();
    window.addEventListener('bq-sync-applied', onSync);
    return () => window.removeEventListener('bq-sync-applied', onSync);
  }, []);

  const update = useCallback(<K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      bumpLocalUpdatedAt();
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setPrefs(defaults);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
    bumpLocalUpdatedAt();
  }, []);

  return { prefs, update, reset, hydrated };
}
