import type { LastRead } from '../entities/bookmark';

export interface IStorageRepository {
  getLastRead(): LastRead | null;
  setLastRead(data: LastRead): void;
}
