import type { Surah, SurahDetail, TafsirData } from '../entities/surah';

export interface IQuranRepository {
  listSurahs(): Promise<Surah[]>;
  getSurah(nomor: number): Promise<SurahDetail>;
  getTafsir(nomor: number): Promise<TafsirData>;
}
