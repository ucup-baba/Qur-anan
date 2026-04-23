import type { LastRead, Bookmark } from '../entities/bookmark';

export interface IStorageRepository {
  getLastRead(): LastRead | null;
  setLastRead(data: LastRead): void;
  getBookmarks(): Bookmark[];
  toggleBookmark(key: string, meta?: Partial<Bookmark>): boolean;
  isBookmarked(key: string): boolean;
}
