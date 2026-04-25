import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface SyncPayload {
  lastRead: unknown | null;
  favorites: unknown | null;
  preferences: unknown | null;
  audioPrefs: unknown | null;
  updatedAt: number;
}

const LOCAL_KEYS = {
  lastRead: 'bq:lastRead',
  favorites: 'bq_favorites_v2',
  preferences: 'qu:preferences:v1',
  audioPrefs: 'bq-audio-prefs',
  syncAt: 'bq:sync:updatedAt',
} as const;

function readJSON<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota
  }
}

function localUpdatedAt(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(LOCAL_KEYS.syncAt);
  return raw ? Number(raw) || 0 : 0;
}

function markLocalUpdated(ts: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_KEYS.syncAt, String(ts));
}

export function snapshotLocal(): SyncPayload {
  return {
    lastRead: readJSON(LOCAL_KEYS.lastRead),
    favorites: readJSON(LOCAL_KEYS.favorites),
    preferences: readJSON(LOCAL_KEYS.preferences),
    audioPrefs: readJSON(LOCAL_KEYS.audioPrefs),
    updatedAt: localUpdatedAt() || Date.now(),
  };
}

export function applyToLocal(payload: Partial<SyncPayload>) {
  if (payload.lastRead !== undefined && payload.lastRead !== null) writeJSON(LOCAL_KEYS.lastRead, payload.lastRead);
  if (payload.favorites !== undefined && payload.favorites !== null) writeJSON(LOCAL_KEYS.favorites, payload.favorites);
  if (payload.preferences !== undefined && payload.preferences !== null) writeJSON(LOCAL_KEYS.preferences, payload.preferences);
  if (payload.audioPrefs !== undefined && payload.audioPrefs !== null) writeJSON(LOCAL_KEYS.audioPrefs, payload.audioPrefs);
  if (typeof payload.updatedAt === 'number') markLocalUpdated(payload.updatedAt);
}

export async function pullCloud(uid: string): Promise<SyncPayload | null> {
  const ref = doc(db, 'userSync', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as Record<string, unknown>;
  const updatedAtRaw = data.updatedAt;
  let updatedAt = 0;
  if (updatedAtRaw instanceof Timestamp) updatedAt = updatedAtRaw.toMillis();
  else if (typeof updatedAtRaw === 'number') updatedAt = updatedAtRaw;
  return {
    lastRead: (data.lastRead as SyncPayload['lastRead']) ?? null,
    favorites: (data.favorites as SyncPayload['favorites']) ?? null,
    preferences: (data.preferences as SyncPayload['preferences']) ?? null,
    audioPrefs: (data.audioPrefs as SyncPayload['audioPrefs']) ?? null,
    updatedAt,
  };
}

export async function pushCloud(uid: string, payload: SyncPayload): Promise<void> {
  const ref = doc(db, 'userSync', uid);
  await setDoc(
    ref,
    {
      lastRead: payload.lastRead,
      favorites: payload.favorites,
      preferences: payload.preferences,
      audioPrefs: payload.audioPrefs,
      updatedAt: serverTimestamp(),
      updatedAtMs: payload.updatedAt,
    },
    { merge: true }
  );
}

export function bumpLocalUpdatedAt() {
  markLocalUpdated(Date.now());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bq-data-change'));
  }
}
