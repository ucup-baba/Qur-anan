'use client';

import React, { useEffect, useCallback, useState, use } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import { AyatCard } from '@/presentation/components/quran/AyatCard';
import { AudioPlayer } from '@/presentation/components/quran/AudioPlayer';
import { useSurahDetail, useLastRead, useAudioPlayer } from '@/presentation/hooks/useQuran';
import { storageService } from '@/infrastructure/storage/localStorageService';

interface PageParams {
  params: Promise<{ nomor: string }>;
}

export default function SurahReadingPage({ params }: PageParams) {
  const resolvedParams = use(params);
  const nomor = parseInt(resolvedParams.nomor, 10);
  const { surah, loading, error } = useSurahDetail(nomor);
  const { updateLastRead } = useLastRead();
  const audio = useAudioPlayer();
  const [currentAyat, setCurrentAyat] = useState<number | null>(null);
  const [showTransliteration, setShowTransliteration] = useState(true);

  // Update last read when user scrolls
  useEffect(() => {
    if (surah && surah.ayat.length > 0) {
      updateLastRead({
        surah: surah.nomor,
        surahName: surah.namaLatin,
        ayat: 1,
        total: surah.jumlahAyat,
      });
    }
  }, [surah, updateLastRead]);

  const handlePlayAyat = useCallback((ayatNum: number, audioUrl?: string) => {
    if (!audioUrl) return;
    setCurrentAyat(ayatNum);
    audio.toggle(audioUrl);
  }, [audio]);

  const handleBookmark = useCallback((ayatNum: number) => {
    if (!surah) return;
    storageService.toggleBookmark(`${surah.nomor}:${ayatNum}`, {
      surahName: surah.namaLatin,
      ayat: ayatNum,
    });
  }, [surah]);

  const handleCopy = useCallback((arabic: string, translation: string, ayatNum: number) => {
    const text = `${arabic}\n\n${translation}\n\n— ${surah?.namaLatin} : ${ayatNum}`;
    navigator.clipboard.writeText(text).catch(() => {});
  }, [surah]);

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto py-20 px-4 md:px-6 text-center">
        <div className="bq-arabic text-4xl md:text-5xl text-[var(--bq-paper-300)] mb-4">بِسْمِ ٱللَّهِ</div>
        <div className="text-sm text-[var(--bq-paper-400)]">Memuat surah...</div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="max-w-[900px] mx-auto py-20 px-4 md:px-6 text-center">
        <div className="text-sm text-red-500">
          {error || 'Surah tidak ditemukan'}
        </div>
        <Link href="/quran" className="no-underline">
          <Button variant="ghost" size="sm" icon={Icons.ChevronLeft} className="mt-4">
            Kembali
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto pt-8 pb-24 md:pb-[100px] px-4 md:px-6">
      {/* Surah Header */}
      <div className="text-center mb-8 md:mb-10">
        <div className="flex justify-center gap-2 mb-4">
          <Badge tone="brown">{surah.tempatTurun}</Badge>
          <Badge tone="neutral">{surah.jumlahAyat} ayat</Badge>
        </div>
        <div className="bq-arabic text-4xl md:text-5xl text-[var(--bq-paper-800)] mb-2 md:mb-3">
          {surah.nama}
        </div>
        <h1 className="bq-serif text-2xl md:text-[32px] font-medium m-0 mb-1 text-[var(--bq-paper-800)] tracking-[-0.3px]">
          {surah.namaLatin}
        </h1>
        <p className="text-[13px] md:text-sm text-[var(--bq-paper-500)] m-0">
          {surah.arti}
        </p>
      </div>

      {/* Navigation + Controls */}
      <div className="flex justify-between items-center mb-6 px-3 py-2.5 md:px-4 md:py-3 bg-[var(--bq-paper-100)] rounded-md">
        <div className="flex gap-2">
          {surah.suratSebelumnya && (
            <Link href={`/quran/${surah.suratSebelumnya.nomor}`} className="no-underline">
              <Button variant="ghost" size="sm" icon={Icons.ChevronLeft} className="hidden sm:inline-flex">
                {surah.suratSebelumnya.namaLatin}
              </Button>
              <Button variant="ghost" size="sm" icon={Icons.ChevronLeft} className="sm:hidden" />
            </Link>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTransliteration(v => !v)}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border rounded-sm transition-colors ${
              showTransliteration 
                ? 'border-[var(--bq-brown-200)] bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)]' 
                : 'border-[var(--bq-paper-200)] bg-[var(--bq-paper-50)] text-[var(--bq-paper-600)]'
            }`}
          >
            Latin
          </button>
        </div>
        <div className="flex gap-2">
          {surah.suratSelanjutnya && (
            <Link href={`/quran/${surah.suratSelanjutnya.nomor}`} className="no-underline">
              <Button variant="ghost" size="sm" iconRight={Icons.ChevronRight} className="hidden sm:inline-flex">
                {surah.suratSelanjutnya.namaLatin}
              </Button>
              <Button variant="ghost" size="sm" iconRight={Icons.ChevronRight} className="sm:hidden" />
            </Link>
          )}
        </div>
      </div>

      {/* Bismillah (except Al-Fatihah and At-Tawbah) */}
      {surah.nomor !== 1 && surah.nomor !== 9 && (
        <div className="text-center py-6 mb-6 border-b border-[var(--bq-paper-200)]">
          <div className="bq-arabic text-3xl md:text-[44px] text-[var(--bq-paper-700)] leading-relaxed">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}

      {/* Ayat List */}
      <div className="flex flex-col gap-4">
        {surah.ayat.map(a => (
          <AyatCard
            key={a.nomorAyat}
            surah={surah.namaLatin}
            ayat={a.nomorAyat}
            arabic={a.teksArab}
            translation={a.teksIndonesia}
            transliteration={showTransliteration ? a.teksLatin : undefined}
            onPlay={() => handlePlayAyat(a.nomorAyat, a.audio['05'])}
            onBookmark={() => handleBookmark(a.nomorAyat)}
            onCopy={() => handleCopy(a.teksArab, a.teksIndonesia, a.nomorAyat)}
          />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-10 pt-6 border-t border-[var(--bq-paper-200)]">
        {surah.suratSebelumnya ? (
          <Link href={`/quran/${surah.suratSebelumnya.nomor}`} className="no-underline w-full sm:w-auto">
            <Button variant="secondary" icon={Icons.ChevronLeft} className="w-full sm:w-auto justify-center">
              {surah.suratSebelumnya.namaLatin}
            </Button>
          </Link>
        ) : <div className="hidden sm:block" />}
        <Link href="/quran" className="no-underline w-full sm:w-auto">
          <Button variant="ghost" className="w-full sm:w-auto justify-center">Daftar Surah</Button>
        </Link>
        {surah.suratSelanjutnya ? (
          <Link href={`/quran/${surah.suratSelanjutnya.nomor}`} className="no-underline w-full sm:w-auto">
            <Button variant="secondary" iconRight={Icons.ChevronRight} className="w-full sm:w-auto justify-center">
              {surah.suratSelanjutnya.namaLatin}
            </Button>
          </Link>
        ) : <div className="hidden sm:block" />}
      </div>

      {/* Sticky Audio Player */}
      {currentAyat && (
        <div className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[600px] z-[100]">
          <AudioPlayer
            surah={`${surah.namaLatin} : ${currentAyat}`}
            reciter="Misyari Rasyid Al-Afasi"
            playing={audio.playing}
            progress={audio.progress}
            onPlayPause={() => {
              const ayat = surah.ayat.find(a => a.nomorAyat === currentAyat);
              if (ayat?.audio['05']) audio.toggle(ayat.audio['05']);
            }}
          />
        </div>
      )}
    </div>
  );
}
