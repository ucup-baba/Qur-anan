'use client';

import React from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { LastReadCard } from '@/presentation/components/quran/LastReadCard';
import { useSurahList, useLastRead } from '@/presentation/hooks/useQuran';
import type { Surah } from '@/domain/entities/surah';

// ─── Daily Verse (random ayat from popular surahs) ───
function DailyVerseHero() {
  return (
    <section className="bg-gradient-to-br from-[var(--bq-brown-500)] via-[var(--bq-brown-400)] to-[var(--bq-gold-400)] text-[var(--bq-paper-50)] pt-16 md:pt-20 pb-12 md:pb-[60px] px-4 md:px-6 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(201,162,78,0.15),transparent_70%)]" />
      <div className="absolute -left-10 -bottom-16 w-50 h-50 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.05),transparent_70%)]" />

      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <div className="text-[11px] tracking-[1.5px] uppercase opacity-70 mb-5 font-semibold">
          Ayat Hari Ini
        </div>
        <div className="bq-arabic text-4xl md:text-5xl mb-4 md:mb-6 leading-relaxed">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </div>
        <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-[600px] mx-auto mb-2">
          Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
        </p>
        <div className="text-[13px] opacity-60 font-mono">
          Al-Fatihah · Ayat 1
        </div>
      </div>
    </section>
  );
}

// ─── Quick Actions Grid ───
function QuickActions() {
  const actions = [
    { icon: Icons.Book, label: "Baca Qur'an", desc: '114 Surah lengkap', href: '/quran', color: 'var(--bq-brown-400)' },
    { icon: Icons.Search, label: 'Cari Ayat', desc: 'Terjemah & tafsir', href: '/quran', color: 'var(--bq-gold-400)' },
    { icon: Icons.Compass, label: 'Jadwal Sholat', desc: 'Berdasarkan lokasi', href: '/sholat', color: 'var(--bq-brown-300)' },
    { icon: Icons.Heart, label: 'Asmaul Husna', desc: '99 Nama Allah', href: '#', color: 'var(--bq-gold-500)' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {actions.map((a) => (
        <Link key={a.label} href={a.href} className="no-underline">
          <Card hover className="p-4 md:p-5 text-center h-full">
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg text-[var(--bq-paper-50)] inline-flex items-center justify-center mb-3"
              style={{ background: a.color }}
            >
              <Icon d={a.icon} size={20} className="md:w-[22px] md:h-[22px]" />
            </div>
            <div className="text-[13px] md:text-sm font-semibold text-[var(--bq-paper-800)] mb-1">{a.label}</div>
            <div className="text-[11px] md:text-xs text-[var(--bq-paper-500)]">{a.desc}</div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

// ─── Popular Surahs Carousel ───
function PopularSurahs({ surahs }: { surahs: Surah[] }) {
  const popular = [1, 2, 18, 36, 55, 56, 67, 78, 112, 114];
  const items = surahs.filter(s => popular.includes(s.nomor));

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(s => (
        <Link key={s.nomor} href={`/quran/${s.nomor}`} className="no-underline">
          <div className="bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-lg p-3 md:p-4 transition-all duration-200 cursor-pointer hover:border-[var(--bq-brown-300)] hover:shadow-sm">
            <div className="flex justify-between items-start mb-2.5">
              <span className="w-6 h-6 md:w-[26px] md:h-[26px] flex items-center justify-center bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)] rounded text-[10px] md:text-[11px] font-bold font-mono">
                {s.nomor}
              </span>
              <span className="bq-arabic text-lg md:text-xl text-[var(--bq-paper-700)] leading-none">
                {s.nama}
              </span>
            </div>
            <div className="text-xs md:text-[13px] font-semibold text-[var(--bq-paper-800)] mb-0.5">{s.namaLatin}</div>
            <div className="text-[10px] md:text-[11px] text-[var(--bq-paper-500)]">{s.arti} · {s.jumlahAyat} ayat</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Main Home Page ───
export default function HomePage() {
  const { surahs, loading } = useSurahList();
  const { lastRead } = useLastRead();

  return (
    <div className="min-h-screen">
      <DailyVerseHero />

      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Last Read + Quick Actions */}
        <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="w-full">
            {lastRead ? (
              <Link href={`/quran/${lastRead.surah}`} className="no-underline block h-full">
                <LastReadCard
                  surah={lastRead.surahName}
                  ayat={`${lastRead.ayat} / ${lastRead.total}`}
                  progress={lastRead.ayat / lastRead.total}
                />
              </Link>
            ) : (
              <LastReadCard surah="Mulai Membaca" ayat="Belum ada" progress={0} />
            )}
          </div>
          <div className="w-full">
            <QuickActions />
          </div>
        </div>

        {/* Surah Populer */}
        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-4 md:mb-5">
            <div>
              <div className="text-[10px] md:text-[11px] tracking-[1.2px] uppercase text-[var(--bq-gold-400)] font-semibold">
                Pilihan
              </div>
              <h2 className="bq-serif text-2xl md:text-[28px] font-medium m-0 mt-1 tracking-[-0.3px] text-[var(--bq-paper-800)]">
                Surah Populer
              </h2>
            </div>
            <Link href="/quran" className="no-underline">
              <Button variant="ghost" size="sm" iconRight={Icons.ChevronRight}>
                Lihat Semua
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="text-center p-10 text-[var(--bq-paper-400)] text-sm">
              Memuat data surah...
            </div>
          ) : (
            <PopularSurahs surahs={surahs} />
          )}
        </div>

        {/* CTA Section */}
        <section className="bg-[var(--bq-paper-100)] border border-[var(--bq-paper-200)] rounded-xl md:rounded-[24px] p-8 md:p-12 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-[var(--bq-brown-500)] text-[var(--bq-gold-200)] inline-flex items-center justify-center mb-4 md:mb-5">
            <span className="bq-arabic text-2xl md:text-[32px] leading-none">ب</span>
          </div>
          <h2 className="bq-serif text-2xl md:text-[32px] font-medium m-0 mb-2 md:mb-2 text-[var(--bq-paper-800)] tracking-[-0.3px]">
            Dari Baitul Qowwam untuk Ummat
          </h2>
          <p className="text-sm md:text-[15px] text-[var(--bq-paper-500)] max-w-[480px] mx-auto mb-5 md:mb-6 leading-relaxed">
            Yayasan Baitul Qowwam bergerak di bidang pendidikan, sosial, dan dakwah. Mari bersama menebar manfaat.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/yayasan" className="no-underline">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">Tentang Yayasan</Button>
            </Link>
            <Link href="/donasi" className="no-underline">
              <Button variant="outline" size="lg" icon={Icons.Heart} className="w-full sm:w-auto">Donasi</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
