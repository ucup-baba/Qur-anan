import type { IStorageRepository } from '@/domain/repositories/storageRepository';
import type { LastRead, Bookmark } from '@/domain/entities/bookmark';

export class LocalStorageService implements IStorageRepository {
  getLastRead(): LastRead | null {
    if (typeof window === 'undefined') return null;
    try {
      return JSON.parse(localStorage.getItem('bq:lastRead') || 'null');
    } catch {
      return null;
    }
  }

  setLastRead(data: LastRead): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('bq:lastRead', JSON.stringify(data));
  }

  getBookmarks(): Bookmark[] {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('bq:bookmarks') || '[]');
    } catch {
      return [];
    }
  }

  toggleBookmark(key: string, meta?: Partial<Bookmark>): boolean {
    const list = this.getBookmarks();
    const idx = list.findIndex((b) => b.key === key);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push({ key, ...meta, createdAt: Date.now() });
    }
    localStorage.setItem('bq:bookmarks', JSON.stringify(list));
    return idx < 0; // true = added, false = removed
  }

  isBookmarked(key: string): boolean {
    return this.getBookmarks().some((b) => b.key === key);
  }
}

// Singleton instance
export const storageService = new LocalStorageService();
