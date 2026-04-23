import type { IQuranRepository } from '@/domain/repositories/quranRepository';
import type { Surah, SurahDetail, TafsirData } from '@/domain/entities/surah';

// ─── In-memory + sessionStorage cache ───
const cache = new Map<string, unknown>();

async function fetchJson<T>(url: string, cacheKey?: string): Promise<T> {
  if (cacheKey && cache.has(cacheKey)) {
    return cache.get(cacheKey) as T;
  }

  if (cacheKey && typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem('bq:' + cacheKey);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        cache.set(cacheKey, parsed);
        return parsed;
      }
    } catch {
      // ignore parse errors
    }
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  const json = await res.json();

  if (cacheKey) {
    cache.set(cacheKey, json);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('bq:' + cacheKey, JSON.stringify(json));
      } catch {
        // sessionStorage full — ignore
      }
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
