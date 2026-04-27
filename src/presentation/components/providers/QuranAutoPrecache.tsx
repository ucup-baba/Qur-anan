'use client';

import { useEffect } from 'react';
import { useOfflineSurah } from '@/presentation/hooks/useOfflineSurah';

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  type?: 'wifi' | 'cellular' | 'ethernet' | 'none' | 'unknown' | string;
}

function isFreeNetwork(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!conn) return true;
  if (conn.saveData) return false;
  if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') return false;
  if (conn.type === 'cellular') return false;
  return true;
}

export function QuranAutoPrecache() {
  const { autoPrecacheText } = useOfflineSurah();

  useEffect(() => {
    if (!isFreeNetwork()) return;
    const t = setTimeout(() => {
      autoPrecacheText();
    }, 4000);
    return () => clearTimeout(t);
  }, [autoPrecacheText]);

  return null;
}
