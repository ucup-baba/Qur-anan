'use client';

import React, { useEffect, useCallback, useState, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import { Badge } from '@/presentation/components/ui/Badge';
import { AyatCard } from '@/presentation/components/quran/AyatCard';
import { TafsirModal } from '@/presentation/components/quran/TafsirModal';
import { DownloadSurahButton } from '@/presentation/components/quran/DownloadSurahButton';
import { useSurahDetail, useLastRead } from '@/presentation/hooks/useQuran';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import { useAudioStore, type AudioTrack } from '@/presentation/hooks/useAudioStore';
import { usePreferences } from '@/presentation/hooks/usePreferences';
import { quranApi } from '@/infrastructure/api/quranApi';
import { TAJWID_LEGEND } from '@/infrastructure/utils/tajwid';
import { useToast } from '@/presentation/components/ui/Toast';
import { Skeleton, SkeletonAyat } from '@/presentation/components/ui/Skeleton';
import { Breadcrumb } from '@/presentation/components/ui/Breadcrumb';

interface PageParams {
  params: Promise<{ nomor: string }>;
}

export default function SurahReadingPage({ params }: PageParams) {
  const resolvedParams = use(params);
  const nomor = parseInt(resolvedParams.nomor, 10);
  const router = useRouter();
  const { surah, loading, error } = useSurahDetail(nomor);
  const { updateLastRead } = useLastRead();
  const { toggleSurah, toggleAyat, isSurahFavorite, isAyatFavorite } = useFavorites();
  const [showTransliteration, setShowTransliteration] = useState(true);
  const { prefs, update: updatePref } = usePreferences();
  const toast = useToast();

  // Tafsir modal state
  const [tafsirAyat, setTafsirAyat] = useState<number | null>(null);

  // Zustand global audio
  const audioStore = useAudioStore();
  const currentTrack = audioStore.currentIndex >= 0 && audioStore.currentIndex < audioStore.tracks.length
    ? audioStore.tracks[audioStore.currentIndex]
    : null;

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

  // Auto-continue to next surah when current playlist ends
  useEffect(() => {
    if (!surah) return;
    const setOnPlaylistEnd = useAudioStore.getState().setOnPlaylistEnd;
    setOnPlaylistEnd(async () => {
      const nextNum = surah.nomor + 1;
      if (nextNum > 114) return null;
      try {
        const nextSurah = await quranApi.getSurah(nextNum);
        const tracks: AudioTrack[] = nextSurah.ayat
          .filter(a => a.audio['05'] || a.audio['01'] || a.audio['02'] || a.audio['03'] || a.audio['04'])
          .map(a => ({
            surahNomor: nextSurah.nomor,
            surahName: nextSurah.namaLatin,
            ayatNomor: a.nomorAyat,
            audioByQori: a.audio,
          }));
        if (tracks.length === 0) return null;
        router.push(`/quran/${nextNum}`);
        return { tracks, startIndex: 0 };
      } catch (err) {
        console.warn('Failed to load next surah:', err);
        return null;
      }
    });
    return () => setOnPlaylistEnd(null);
  }, [surah, router]);

  // Build playlist from surah ayat
  const handlePlayAyat = useCallback((ayatNum: number) => {
    if (!surah) return;
    const tracks: AudioTrack[] = surah.ayat
      .filter(a => a.audio['05'] || a.audio['01'] || a.audio['02'] || a.audio['03'] || a.audio['04'])
      .map(a => ({
        surahNomor: surah.nomor,
        surahName: surah.namaLatin,
        ayatNomor: a.nomorAyat,
        audioByQori: a.audio,
      }));

    const startIndex = tracks.findIndex(t => t.ayatNomor === ayatNum);
    if (startIndex < 0) return;

    // If the same track is already playing, toggle
    if (
      currentTrack &&
      currentTrack.surahNomor === surah.nomor &&
      currentTrack.ayatNomor === ayatNum &&
      audioStore.playing
    ) {
      audioStore.pause();
    } else if (
      currentTrack &&
      currentTrack.surahNomor === surah.nomor &&
      currentTrack.ayatNomor === ayatNum
    ) {
      audioStore.resume();
    } else {
      audioStore.setPlaylist(tracks, startIndex);
    }
  }, [surah, audioStore, currentTrack]);

  const handleBookmark = useCallback((ayatNum: number) => {
    if (!surah) return;
    toggleAyat(surah.nomor, ayatNum);
  }, [surah, toggleAyat]);

  const handleCopy = useCallback((arabic: string, translation: string, ayatNum: number) => {
    const text = `${arabic}\n\n${translation}\n\n— ${surah?.namaLatin} : ${ayatNum}`;
    navigator.clipboard.writeText(text).catch(() => {});
  }, [surah]);

  const handleShare = useCallback(async (arabic: string, translation: string, ayatNum: number) => {
    if (!surah) return;
    const url = `${window.location.origin}/quran/${surah.nomor}#ayat-${ayatNum}`;
    const title = `${surah.namaLatin} : ${ayatNum}`;
    const text = `${arabic}\n\n"${translation}"\n\n— QS. ${surah.namaLatin} : ${ayatNum}`;

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      toast.show('Teks ayat disalin ke clipboard.', 'success');
    } catch {
      toast.show('Gagal membagikan ayat.', 'error');
    }
  }, [surah, toast]);

  // Check if a specific ayat is currently playing
  const isAyatPlaying = useCallback((ayatNum: number) => {
    return (
      currentTrack !== null &&
      currentTrack.surahNomor === nomor &&
      currentTrack.ayatNomor === ayatNum &&
      audioStore.playing
    );
  }, [currentTrack, nomor, audioStore.playing]);

  // Auto-scroll to currently playing ayat
  useEffect(() => {
    if (currentTrack && currentTrack.surahNomor === nomor) {
      const el = document.getElementById(`ayat-${currentTrack.ayatNomor}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTrack?.ayatNomor, currentTrack?.surahNomor, nomor]);

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-10">
          <Skeleton width={120} height={14} rounded="sm" className="mx-auto mb-4" />
          <Skeleton width={240} height={36} rounded="md" className="mx-auto mb-3" />
          <Skeleton width={180} height={14} rounded="sm" className="mx-auto" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonAyat key={i} />
        ))}
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
    <div
      className="max-w-[800px] mx-auto pt-8 pb-24 md:pb-[100px] px-4 md:px-6"
      onTouchStart={(e) => {
        const t = e.touches[0];
        (e.currentTarget as HTMLDivElement & { _bqSwipeStart?: { x: number; y: number; t: number } })._bqSwipeStart = {
          x: t.clientX, y: t.clientY, t: Date.now(),
        };
      }}
      onTouchEnd={(e) => {
        const start = (e.currentTarget as HTMLDivElement & { _bqSwipeStart?: { x: number; y: number; t: number } })._bqSwipeStart;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        const dt = Date.now() - start.t;
        if (dt > 600) return;
        if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        if (dx < 0 && surah.suratSelanjutnya) {
          router.push(`/quran/${surah.suratSelanjutnya.nomor}`);
        } else if (dx > 0 && surah.suratSebelumnya) {
          router.push(`/quran/${surah.suratSebelumnya.nomor}`);
        }
      }}
    >
      <Breadcrumb
        className="mb-4"
        items={[
          { label: 'Beranda', href: '/' },
          { label: "Qur'an", href: '/quran' },
          { label: surah.namaLatin },
        ]}
      />
      {/* Surah Header */}
      <div className="text-center mb-8 md:mb-10 py-8 px-6 rounded-2xl relative overflow-hidden group" style={{ background: 'linear-gradient(135deg, var(--bq-paper-100) 0%, #fff 100%)', border: '1px solid var(--bq-paper-200)' }}>
        <button 
          onClick={() => toggleSurah(surah.nomor)}
          className="absolute top-4 right-4 p-3 rounded-full hover:bg-white/50 transition-all z-20 group"
          title={isSurahFavorite(surah.nomor) ? "Hapus dari Pilihan" : "Tambahkan ke Pilihan"}
        >
          <Icon 
            d={Icons.Bookmark} 
            size={24} 
            style={{ 
              color: isSurahFavorite(surah.nomor) ? 'var(--bq-gold-500)' : 'var(--bq-paper-300)',
              fill: isSurahFavorite(surah.nomor) ? 'var(--bq-gold-500)' : 'none'
            }} 
          />
        </button>

        <div className="flex justify-center gap-2 mb-5">
          <Badge tone="brown">{surah.tempatTurun === 'Mekah' ? 'Makkiyyah' : surah.tempatTurun === 'Madinah' ? 'Madaniyyah' : surah.tempatTurun}</Badge>
          <Badge tone="neutral">{surah.jumlahAyat} ayat</Badge>
        </div>
        <div className="bq-arabic text-5xl md:text-6xl text-[var(--bq-paper-800)] mb-3 md:mb-4" style={{ lineHeight: 1.4 }}>
          {surah.nama}
        </div>
        <h1 className="bq-serif text-3xl md:text-[38px] font-medium m-0 mb-2 text-[var(--bq-paper-800)] tracking-[-0.5px]">
          {surah.namaLatin}
        </h1>
        <p className="text-[14px] md:text-[15px] text-[var(--bq-paper-500)] m-0 mb-4">
          {surah.arti}
        </p>
        <DownloadSurahButton surah={surah} />
      </div>

      {/* Navigation + Controls */}
      <div className="flex justify-between items-center gap-2 mb-6 px-3 py-2.5 md:px-4 md:py-3 bg-[var(--bq-paper-100)] rounded-md">
        {/* Prev — desktop only */}
        <div className="hidden sm:flex gap-2">
          {surah.suratSebelumnya && (
            <Link href={`/quran/${surah.suratSebelumnya.nomor}`} className="no-underline">
              <Button variant="ghost" size="sm" icon={Icons.ChevronLeft}>
                {surah.suratSebelumnya.namaLatin}
              </Button>
            </Link>
          )}
        </div>

        {/* Mode toggles */}
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
          <button
            onClick={() => updatePref('tajwidMode', !prefs.tajwidMode)}
            className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border rounded-sm transition-colors ${
              prefs.tajwidMode
                ? 'border-[var(--bq-gold-300)] bg-[var(--bq-gold-50)] text-[var(--bq-gold-700)]'
                : 'border-[var(--bq-paper-200)] bg-[var(--bq-paper-50)] text-[var(--bq-paper-600)]'
            }`}
            title="Warnai hukum tajwid"
          >
            Tajwid
          </button>
        </div>

        {/* Next — always visible */}
        <div className="flex gap-2">
          {surah.suratSelanjutnya && (
            <Link href={`/quran/${surah.suratSelanjutnya.nomor}`} className="no-underline">
              <Button variant="ghost" size="sm" iconRight={Icons.ChevronRight}>
                {surah.suratSelanjutnya.namaLatin}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Tajwid legend */}
      {prefs.tajwidMode && (
        <div className="mb-6 p-3 rounded-xl bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)]">
          <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--bq-paper-500)] mb-2">Legenda Tajwid</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {TAJWID_LEGEND.map((l) => (
              <div key={l.rule} className="flex items-center gap-1.5 text-[11px]" title={l.description}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                <span className="text-[var(--bq-paper-700)] font-medium">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
            tajwid={prefs.tajwidMode}
            bookmarked={isAyatFavorite(surah.nomor, a.nomorAyat)}
            isPlaying={isAyatPlaying(a.nomorAyat)}
            onPlay={() => handlePlayAyat(a.nomorAyat)}
            onBookmark={() => handleBookmark(a.nomorAyat)}
            onCopy={() => handleCopy(a.teksArab, a.teksIndonesia, a.nomorAyat)}
            onShare={() => handleShare(a.teksArab, a.teksIndonesia, a.nomorAyat)}
            onTafsir={() => setTafsirAyat(a.nomorAyat)}
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

      {/* Tafsir Modal */}
      {tafsirAyat !== null && (
        <TafsirModal
          surahNomor={surah.nomor}
          surahName={surah.namaLatin}
          ayatNomor={tafsirAyat}
          onClose={() => setTafsirAyat(null)}
        />
      )}
    </div>
  );
}
