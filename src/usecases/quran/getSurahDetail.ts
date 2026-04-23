import type { SurahDetail } from '@/domain/entities/surah';
import type { IQuranRepository } from '@/domain/repositories/quranRepository';

export class GetSurahDetailUseCase {
  constructor(private repository: IQuranRepository) {}

  async execute(nomor: number): Promise<SurahDetail> {
    return this.repository.getSurah(nomor);
  }
}
