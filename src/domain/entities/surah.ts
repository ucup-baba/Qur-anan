// ─── Surah & Ayat entities ───
// Based on equran.id API v2 response shape

export interface AudioFull {
  '01': string;
  '02': string;
  '03': string;
  '04': string;
  '05': string;
}

export interface Surah {
  nomor: number;
  nama: string;        // Arabic script, e.g. "الفاتحة"
  namaLatin: string;   // Latin transliteration, e.g. "Al-Fatihah"
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;        // Indonesian meaning, e.g. "Pembukaan"
  deskripsi: string;   // HTML description
  audioFull: AudioFull;
}

export interface AyatAudio {
  '01'?: string;
  '02'?: string;
  '03'?: string;
  '04'?: string;
  '05'?: string;
}

export interface Ayat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: AyatAudio;
}

export interface SurahLink {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}

export interface SurahDetail extends Surah {
  ayat: Ayat[];
  suratSebelumnya: SurahLink | false;
  suratSelanjutnya: SurahLink | false;
}

export interface TafsirAyat {
  ayat: number;
  teks: string;
}

export interface TafsirData {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tafsir: TafsirAyat[];
}
