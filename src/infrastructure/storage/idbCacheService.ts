/**
 * idbCacheService.ts — IndexedDB-based persistent cache for API responses.
 * Replaces sessionStorage so data survives tab close → true offline PWA.
 */
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'quranan-cache';
const DB_VERSION = 1;
const STORE = 'api-cache';

interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

/** Get a cached value by key */
export async function idbGet<T>(key: string): Promise<T | null> {
  try {
    const db = await getDB();
    const entry = await db.get(STORE, key) as CacheEntry<T> | undefined;
    return entry?.data ?? null;
  } catch {
    return null;
  }
}

/** Store a value in the cache */
export async function idbSet<T>(key: string, data: T): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE, { key, data, timestamp: Date.now() } satisfies CacheEntry<T>);
  } catch {
    // IndexedDB write failed — ignore (quota, etc.)
  }
}

/** Delete a cached entry */
export async function idbDel(key: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(STORE, key);
  } catch {
    // ignore
  }
}

/** Clear all cached entries */
export async function idbClear(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear(STORE);
  } catch {
    // ignore
  }
}
