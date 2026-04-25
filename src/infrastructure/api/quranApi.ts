import type { IQuranRepository } from '@/domain/repositories/quranRepository';
import type { Surah, SurahDetail, TafsirData } from '@/domain/entities/surah';
import { idbGet, idbSet } from '@/infrastructure/storage/idbCacheService';

// ─── In-memory fast cache (per page session) + IndexedDB (persistent offline) ───
const memCache = new Map<string, unknown>();

async function fetchJson<T>(url: string, cacheKey?: string): Promise<T> {
  // 1) Check in-memory first (fastest)
  if (cacheKey && memCache.has(cacheKey)) {
    return memCache.get(cacheKey) as T;
  }

  // 2) Check IndexedDB (persistent, survives tab close)
  if (cacheKey && typeof window !== 'undefined') {
    const cached = await idbGet<T>(cacheKey);
    if (cached !== null) {
      memCache.set(cacheKey, cached);
      return cached;
    }
  }

  // 3) Fetch from network
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  const json = await res.json();

  // 4) Store in both caches
  if (cacheKey) {
    memCache.set(cacheKey, json);
    if (typeof window !== 'undefined') {
      idbSet(cacheKey, json); // fire-and-forget
    }
  }

  return json as T;
}

// ─── API response wrapper ───
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ─── Implementation ───
export class QuranApi implements IQuranRepository {
  private baseUrl = 'https://equran.id/api/v2';

  async listSurahs(): Promise<Surah[]> {
    const res = await fetchJson<ApiResponse<Surah[]>>(
      `${this.baseUrl}/surat`,
      'surah-list'
    );
    return res.data;
  }

  async getSurah(nomor: number): Promise<SurahDetail> {
    const res = await fetchJson<ApiResponse<SurahDetail>>(
      `${this.baseUrl}/surat/${nomor}`,
      `surah-${nomor}`
    );
    return res.data;
  }

  async getTafsir(nomor: number): Promise<TafsirData> {
    const res = await fetchJson<ApiResponse<TafsirData>>(
      `${this.baseUrl}/tafsir/${nomor}`,
      `tafsir-${nomor}`
    );
    return res.data;
  }
}

// Singleton instance
export const quranApi = new QuranApi();
