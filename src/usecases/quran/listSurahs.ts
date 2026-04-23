import type { Surah } from '@/domain/entities/surah';
import type { IQuranRepository } from '@/domain/repositories/quranRepository';

export class ListSurahsUseCase {
  constructor(private repository: IQuranRepository) {}

  async execute(): Promise<Surah[]> {
    return this.repository.listSurahs();
  }
}
