'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Input } from '@/presentation/components/ui/Input';
import { Badge } from '@/presentation/components/ui/Badge';
import { SurahListItem } from '@/presentation/components/quran/SurahListItem';
import { useSurahList } from '@/presentation/hooks/useQuran';
import { useFavorites } from '@/presentation/hooks/useFavorites';

type FilterType = 'all' | 'Mekah' | 'Madinah' | 'favorite';

export default function QuranListPage() {
  const { surahs, loading, error } = useSurahList();
  const { favorites, toggleSurah, isSurahFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    let list = surahs;
    if (filter === 'Mekah' || filter === 'Madinah') {
      list = list.filter(s => s.tempatTurun === filter);
    } else if (filter === 'favorite') {
      list = list.filter(s => isSurahFavorite(s.nomor));
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nama.includes(q) ||
        s.nomor.toString() === q
      );
    }
    return list;
  }, [surahs, search, filter, favorites, isSurahFavorite]);

  return (
    <div className="max-w-[1100px] mx-auto px-4 md:px-6 pt-10 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[11px] md:text-[12px] tracking-[1.4px] uppercase text-[var(--bq-gold-400)] font-semibold mb-2">
          AL-QUR&apos;AN
        </div>
        <h1 className="bq-serif text-[40px] md:text-[48px] font-medium m-0 tracking-[-0.5px] text-[var(--bq-paper-800)]">
          Daftar Surah
        </h1>
        <p className="text-[14px] md:text-[15px] text-[var(--bq-paper-500)] mt-3 mb-0">
          114 surah &middot; 30 juz &middot; 6236 ayat
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-8 items-stretch md:items-center">
        <div className="flex-1">
          <Input
            icon={Icons.Search}
            placeholder="Cari surah, arti, atau nomor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0">
          {(['all', 'Mekah', 'Madinah', 'favorite'] as FilterType[]).map(f => {
            const label = f === 'all' ? 'Semua' : f === 'Mekah' ? 'Makkiyyah' : f === 'Madinah' ? 'Madaniyyah' : 'Pilihan';
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-[13px] md:text-[14px] font-semibold border rounded-lg cursor-pointer transition-colors whitespace-nowrap ${
                  filter === f
                    ? 'border-[var(--bq-brown-500)] bg-[var(--bq-brown-500)] text-white'
                    : 'border-[var(--bq-paper-200)] bg-white text-[var(--bq-paper-800)] hover:bg-[var(--bq-paper-50)]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surah List */}
      {loading ? (
        <div className="text-center p-12 md:p-16 text-[var(--bq-paper-400)]">
          <div className="bq-arabic text-3xl md:text-4xl mb-3">بِسْمِ ٱللَّهِ</div>
          <div className="text-[13px] md:text-sm">Memuat daftar surah...</div>
        </div>
      ) : error ? (
        <div className="text-center p-12 md:p-16 text-red-500">
          <div className="text-[13px] md:text-sm">Gagal memuat data: {error}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {filtered.map((s, index) => (
            <Link 
              key={s.nomor} 
              href={`/quran/${s.nomor}`} 
              className="no-underline block animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <SurahListItem
                num={s.nomor}
                name={s.nama}
                transliteration={s.namaLatin}
                meaning={s.arti}
                ayatCount={s.jumlahAyat}
                revelation={s.tempatTurun === 'Mekah' ? 'Makkiyyah' : s.tempatTurun === 'Madinah' ? 'Madaniyyah' : s.tempatTurun}
                bookmarked={isSurahFavorite(s.nomor)}
                onToggleBookmark={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSurah(s.nomor);
                }}
              />
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center p-10 text-[var(--bq-paper-400)] text-[13px] md:text-sm">
              Tidak ada surah yang cocok dengan pencarian &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
