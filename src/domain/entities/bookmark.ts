// ─── Bookmark & Last Read entities ───

export interface LastRead {
  surah: number;
  surahName: string;
  ayat: number;
  total: number;
}

export interface Bookmark {
  key: string;
  surahName?: string;
  ayat?: number;
  createdAt: number;
}
