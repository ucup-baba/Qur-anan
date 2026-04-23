'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Input } from '@/presentation/components/ui/Input';
import { Badge } from '@/presentation/components/ui/Badge';
import { SurahListItem } from '@/presentation/components/quran/SurahListItem';
import { useSurahList } from '@/presentation/hooks/useQuran';

type FilterType = 'all' | 'Mekah' | 'Madinah';

export default function QuranListPage() {
  const { surahs, loading, error } = useSurahList();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = useMemo(() => {
    let list = surahs;
    if (filter !== 'all') list = list.filter(s => s.tempatTurun === filter);
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
  }, [surahs, search, filter]);

  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-6 pt-10 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] md:text-[11px] tracking-[1.2px] uppercase text-[var(--bq-gold-400)] font-semibold">
          Al-Qur&apos;an Al-Karim
        </div>
        <h1 className="bq-serif text-3xl md:text-[36px] font-medium mt-1.5 mb-2 tracking-[-0.3px] text-[var(--bq-paper-800)]">
          Daftar Surah
        </h1>
        <p className="text-[13px] md:text-sm text-[var(--bq-paper-500)] m-0">
          114 Surah · Lengkap dengan terjemah, transliterasi, dan murottal
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
        <div className="flex-1">
          <Input
            icon={Icons.Search}
            placeholder="Cari surah... (nama, arti, atau nomor)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {(['all', 'Mekah', 'Madinah'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 text-xs md:text-[13px] font-semibold border rounded-md cursor-pointer transition-colors whitespace-nowrap ${
                filter === f
                  ? 'border-[var(--bq-brown-400)] bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)]'
                  : 'border-[var(--bq-paper-200)] bg-[var(--bq-paper-50)] text-[var(--bq-paper-600)] hover:bg-[var(--bq-paper-100)]'
              }`}
            >
              {f === 'all' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-[11px] md:text-xs text-[var(--bq-paper-500)] mb-3.5 font-mono">
        {loading ? 'Memuat...' : `${filtered.length} surah ditemukan`}
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
        <div className="flex flex-col gap-2 md:gap-2.5">
          {filtered.map(s => (
            <Link key={s.nomor} href={`/quran/${s.nomor}`} className="no-underline block">
              <SurahListItem
                num={s.nomor}
                name={s.nama}
                transliteration={s.namaLatin}
                meaning={s.arti}
                ayatCount={s.jumlahAyat}
                revelation={s.tempatTurun}
              />
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="text-center p-10 text-[var(--bq-paper-400)] text-[13px] md:text-sm">
              Tidak ada surah yang cocok dengan pencarian &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
