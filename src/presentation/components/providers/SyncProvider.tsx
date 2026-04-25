'use client';

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';
import { applyToLocal, pullCloud, pushCloud, snapshotLocal } from '@/infrastructure/firebase/sync';

interface SyncState {
  syncing: boolean;
  lastSyncedAt: number | null;
  error: string | null;
  syncNow: () => Promise<void>;
}

const Ctx = createContext<SyncState | undefined>(undefined);

const DEBOUNCE_MS = 4_000;

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initialPulledRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = useCallback(async (uid: string) => {
    setSyncing(true);
    setError(null);
    try {
      const local = snapshotLocal();
      await pushCloud(uid, local);
      setLastSyncedAt(Date.now());
    } catch (e) {
      setError((e as Error)?.message ?? 'Gagal sinkron');
    } finally {
      setSyncing(false);
    }
  }, []);

  const pullAndMerge = useCallback(async (uid: string) => {
    setSyncing(true);
    setError(null);
    try {
      const cloud = await pullCloud(uid);
      const local = snapshotLocal();
      if (!cloud) {
        await pushCloud(uid, local);
      } else if (cloud.updatedAt > local.updatedAt) {
        applyToLocal(cloud);
        window.dispatchEvent(new CustomEvent('bq-sync-applied'));
      } else if (local.updatedAt > cloud.updatedAt) {
        await pushCloud(uid, local);
      }
      setLastSyncedAt(Date.now());
    } catch (e) {
      setError((e as Error)?.message ?? 'Gagal sinkron');
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      initialPulledRef.current = null;
      return;
    }
    if (initialPulledRef.current !== user.uid) {
      initialPulledRef.current = user.uid;
      pullAndMerge(user.uid);
    }
  }, [user, pullAndMerge]);

  useEffect(() => {
    if (!user) return;
    const onChange = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => push(user.uid), DEBOUNCE_MS);
    };
    window.addEventListener('bq-data-change', onChange);
    return () => {
      window.removeEventListener('bq-data-change', onChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [user, push]);

  useEffect(() => {
    if (!user) return;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        push(user.uid);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [user, push]);

  const syncNow = useCallback(async () => {
    if (!user) return;
    await pullAndMerge(user.uid);
  }, [user, pullAndMerge]);

  return <Ctx.Provider value={{ syncing, lastSyncedAt, error, syncNow }}>{children}</Ctx.Provider>;
}

export function useSync() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSync must be used within SyncProvider');
  return ctx;
}
