import type { IStorageRepository } from '@/domain/repositories/storageRepository';
import type { LastRead } from '@/domain/entities/bookmark';

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
}

// Singleton instance
export const storageService = new LocalStorageService();
