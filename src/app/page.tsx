'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import { LastReadCard } from '@/presentation/components/quran/LastReadCard';
import { useSurahList, useLastRead, useSurahDetail } from '@/presentation/hooks/useQuran';
import { useSholat } from '@/presentation/hooks/useSholat';
import { useFavorites } from '@/presentation/hooks/useFavorites';
import type { Surah } from '@/domain/entities/surah';

// ─── Helper: Section Header ───
function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex justify-between items-end px-4 md:px-0 mb-4">
      <div>
        <h2 className="text-[18px] md:text-xl font-bold text-[var(--bq-paper-800)] m-0 tracking-tight">{title}</h2>
        {subtitle && <p className="text-[11px] text-[var(--bq-paper-500)] m-0 mt-0.5 uppercase tracking-wider font-medium">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-[12px] font-bold text-[var(--bq-brown-600)] no-underline flex items-center gap-1 hover:gap-1.5 transition-all">
          Semua <Icon d={Icons.ArrowRight} size={14} />
        </Link>
      )}
    </div>
  );
}

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

// ─── Mobile Components ───
function MobileGreeting() {
  return (
    <div className="md:hidden flex justify-between items-center mb-6 mt-4 px-4">
      <div>
        <div className="text-xs text-[var(--bq-paper-500)]">Assalamu'alaikum,</div>
        <div className="text-base font-bold text-[var(--bq-paper-800)]">Ahmad</div>
      </div>
      <div className="flex gap-2">
        <Link href="/quran" className="w-9 h-9 bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] flex items-center justify-center rounded-lg text-[var(--bq-paper-600)]">
          <Icon d={Icons.Search} size={16} />
        </Link>
        <button className="w-9 h-9 bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] flex items-center justify-center rounded-lg text-[var(--bq-paper-600)]">
          <Icon d={Icons.Bookmark} size={16} />
        </button>
      </div>
    </div>
  );
}

function MobileQuickGrid() {
  const actions = [
    { icon: Icons.Sparkle, label: "Qur'an", href: '/quran' }, // Changed from Book to Sparkle
    { icon: Icons.Compass, label: 'Kiblat', href: '/sholat' },
    { icon: Icons.Clock, label: 'Sholat', href: '/sholat' },
    { icon: Icons.Heart, label: "Do'a", href: '#' },
  ];

  return (
    <div className="md:hidden grid grid-cols-4 gap-2 my-6 px-4">
      {actions.map((q) => (
        <Link key={q.label} href={q.href} className="no-underline">
          <div className="flex flex-col items-center gap-1.5 py-2.5 bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-xl">
            <Icon d={q.icon} size={18} className="text-[var(--bq-brown-400)]" />
            <span className="text-[10px] font-semibold text-[var(--bq-paper-600)]">{q.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}


function MobilePrayerCard() {
  const { nextPrayer, lokasi, loading } = useSholat();

  if (loading || !nextPrayer) {
    return (
      <div className="md:hidden bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5 mb-6 mx-4 animate-pulse">
        <div className="h-3 w-20 bg-[var(--bq-paper-200)] rounded mb-2"></div>
        <div className="h-8 w-32 bg-[var(--bq-paper-200)] rounded"></div>
      </div>
    );
  }

  const getCountdown = () => {
    const now = new Date();
    const [h, m] = nextPrayer.time.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0);
    
    let diff = target.getTime() - now.getTime();
    if (diff < 0) {
      target.setDate(target.getDate() + 1);
      diff = target.getTime() - now.getTime();
    }
    
    const mins = Math.floor(diff / (1000 * 60));
    const hLeft = Math.floor(mins / 60);
    const mLeft = mins % 60;
    
    if (hLeft > 0) return `${hLeft}j ${mLeft}m lagi`;
    return `${mLeft}m lagi`;
  };

  const getPrayerIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('subuh')) return Icons.Sunrise;
    if (n.includes('dzuhur')) return Icons.Sun;
    if (n.includes('ashar')) return Icons.Cloud;
    if (n.includes('maghrib')) return Icons.Sunset;
    if (n.includes('isya')) return Icons.Moon;
    return Icons.Clock;
  };

  return (
    <div className="md:hidden bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5 mb-6 mx-4 flex justify-between items-center shadow-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bq-gold-50)] to-transparent opacity-40" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] font-bold tracking-[1.2px] uppercase text-[var(--bq-gold-600)]">{nextPrayer.name}</span>
          <span className="text-[11px] text-[var(--bq-paper-400)] font-medium">• {lokasi}</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="bq-serif text-[32px] font-bold text-[var(--bq-paper-900)] leading-none">{nextPrayer.time}</span>
          <span className="text-[11px] font-bold text-[var(--bq-gold-700)] bg-[var(--bq-gold-50)] px-2 py-1 rounded-lg">
            {getCountdown()}
          </span>
        </div>
      </div>
      <div className="relative z-10 w-12 h-12 flex items-center justify-center bg-[var(--bq-gold-50)] text-[var(--bq-gold-600)] rounded-2xl bq-float">
        <Icon d={getPrayerIcon(nextPrayer.name)} size={24} stroke={2} />
      </div>
    </div>
  );
}

// ─── Ayat Preview (Interactive & Inline) ───
function AyatPreview({ surahNo, ayatNo, surahName, arabicName }: { surahNo: number; ayatNo: number; surahName: string; arabicName: string }) {
  const { surah, loading } = useSurahDetail(surahNo);
  const [expanded, setExpanded] = useState(false);
  const ayat = surah?.ayat.find(a => a.nomorAyat === ayatNo);

  return (
    <div 
      onClick={() => setExpanded(!expanded)}
      className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5 h-full flex flex-col justify-between transition-all duration-300 hover:border-[var(--bq-gold-300)] hover:shadow-lg cursor-pointer shrink-0 snap-center w-[300px] md:w-full group relative"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${expanded ? 'bg-[var(--bq-gold-500)] text-white' : 'bg-[var(--bq-gold-50)] text-[var(--bq-gold-600)]'}`}>
            <Icon d={Icons.Sparkle} size={16} />
          </div>
          <div>
            <div className="text-[13px] font-bold text-[var(--bq-paper-800)]">{surahName}</div>
            <div className="text-[11px] text-[var(--bq-paper-500)] uppercase tracking-wider">Ayat {ayatNo}</div>
          </div>
        </div>
        <div className="bq-arabic text-xl text-[var(--bq-paper-400)] group-hover:text-[var(--bq-gold-500)] transition-colors">{arabicName}</div>
      </div>
      
      {loading ? (
        <div className="space-y-2 py-2">
          <div className="h-4 bg-[var(--bq-paper-100)] rounded animate-pulse w-full" />
          <div className="h-3 bg-[var(--bq-paper-100)] rounded animate-pulse w-3/4" />
        </div>
      ) : ayat ? (
        <div className="flex flex-col gap-3">
          <div className={`bq-arabic text-right text-lg text-[var(--bq-paper-800)] leading-loose transition-all duration-500 ${expanded ? '' : 'line-clamp-2 opacity-80'}`}>
            {ayat.teksArab}
          </div>
          {expanded && (
            <div className="text-[12px] text-[var(--bq-paper-500)] leading-relaxed italic animate-fade-in border-t border-[var(--bq-paper-100)] pt-3">
              "{ayat.teksIndonesia}"
            </div>
          )}
          {!expanded && (
            <div className="text-[10px] text-[var(--bq-gold-600)] font-bold text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Tap untuk baca terjemahan
            </div>
          )}
        </div>
      ) : (
        <div className="text-[11px] text-red-400">Gagal memuat ayat</div>
      )}
    </div>
  );
}

// ─── Surah Pilihan (Swipable) ───
function FavoriteSurahs({ surahs }: { surahs: Surah[] }) {
  const { favorites } = useFavorites();
  const items = surahs.filter(s => favorites.surahs.includes(s.nomor));

  if (items.length === 0) return (
    <div className="px-4 md:px-0 py-8 text-center text-[var(--bq-paper-400)] text-sm border-2 border-dashed border-[var(--bq-paper-200)] rounded-2xl mx-4 md:mx-0">
      Belum ada surah pilihan.
    </div>
  );

  return (
    <div className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-2 snap-x no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(s => (
        <Link key={s.nomor} href={`/quran/${s.nomor}`} className="no-underline shrink-0 snap-center w-[280px] md:w-full group">
          <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5 transition-all duration-300 hover:border-[var(--bq-brown-300)] hover:shadow-xl hover:-translate-y-1 relative overflow-hidden active:scale-95 md:active:scale-100">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="w-10 h-10 flex items-center justify-center bg-[var(--bq-brown-50)] text-[var(--bq-brown-600)] rounded-xl text-sm font-bold font-mono group-hover:bg-[var(--bq-brown-500)] group-hover:text-white transition-colors">
                {s.nomor}
              </div>
              <div className="bq-arabic text-2xl text-[var(--bq-paper-700)] group-hover:text-[var(--bq-brown-600)] transition-colors">
                {s.nama}
              </div>
            </div>
            <div className="text-[15px] font-bold text-[var(--bq-paper-800)] mb-1">{s.namaLatin}</div>
            <div className="text-xs text-[var(--bq-paper-500)] font-medium uppercase tracking-wider">{s.arti} · {s.jumlahAyat} ayat</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── Ayat Pilihan (Swipable) ───
function FavoriteAyats({ surahs }: { surahs: Surah[] }) {
  const { favorites } = useFavorites();
  
  if (favorites.ayats.length === 0) return (
    <div className="px-4 md:px-0 py-8 text-center text-[var(--bq-paper-400)] text-sm border-2 border-dashed border-[var(--bq-paper-200)] rounded-2xl mx-4 md:mx-0">
      Belum ada ayat pilihan.
    </div>
  );

  return (
    <div className="flex overflow-x-auto gap-4 px-4 md:px-0 pb-2 snap-x no-scrollbar md:grid md:grid-cols-1 lg:grid-cols-2">
      {favorites.ayats.map(key => {
        const [sNo, aNo] = key.split(':').map(Number);
        const surah = surahs.find(s => s.nomor === sNo);
        if (!surah) return null;

        return <AyatPreview key={key} surahNo={sNo} ayatNo={aNo} surahName={surah.namaLatin} arabicName={surah.nama} />;
      })}
    </div>
  );
}

// ─── Main Home Page ───
export default function HomePage() {
  const { surahs, loading } = useSurahList();
  const { lastRead } = useLastRead();

  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] md:bg-transparent pb-24 md:pb-0">
      <div className="hidden md:block">
        <DailyVerseHero />
      </div>

      <div className="max-w-[1200px] mx-auto md:px-6 md:py-10">
        <MobileGreeting />

        {/* Last Read + Quick Actions */}
        <div className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] gap-6 md:gap-8 mb-10 px-4 md:px-0">
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
          <div className="hidden md:block w-full">
            <QuickActions />
          </div>
        </div>

        <div className="mb-2">
          <MobileQuickGrid />
          <MobilePrayerCard />
        </div>

        {/* Section 1: Surah Pilihan */}
        <div className="mb-4">
          <SectionHeader title="Surah Pilihan" subtitle="Favorit Anda" href="/quran" />
          {loading ? (
            <div className="px-4 py-4 flex gap-4 overflow-hidden">
               {[1,2,3].map(i => <div key={i} className="w-[280px] h-[160px] bg-[var(--bq-paper-200)] rounded-2xl animate-pulse shrink-0" />)}
            </div>
          ) : (
            <FavoriteSurahs surahs={surahs} />
          )}
        </div>

        {/* Section 2: Ayat Pilihan */}
        <div className="mb-8">
          <SectionHeader title="Ayat Pilihan" subtitle="Inspirasi Harian" />
          {loading ? (
             <div className="px-4 py-4 flex gap-4 overflow-hidden">
               {[1,2].map(i => <div key={i} className="w-[300px] h-[120px] bg-[var(--bq-paper-200)] rounded-2xl animate-pulse shrink-0" />)}
             </div>
          ) : (
            <FavoriteAyats surahs={surahs} />
          )}
        </div>

        {/* CTA Section */}
        <div className="hidden md:block">
          <section className="bg-[var(--bq-paper-100)] border border-[var(--bq-paper-200)] rounded-[32px] p-10 md:p-16 text-center shadow-sm">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[var(--bq-brown-500)] text-[var(--bq-gold-200)] inline-flex items-center justify-center mb-6 shadow-lg shadow-brown-900/20">
              <span className="bq-arabic text-[40px] leading-none">ب</span>
            </div>
            <h2 className="bq-serif text-3xl md:text-[42px] font-medium m-0 mb-4 text-[var(--bq-paper-800)] tracking-[-0.8px]">
              Baitul Qowwam untuk Ummat
            </h2>
            <p className="text-[15px] md:text-lg text-[var(--bq-paper-500)] max-w-[540px] mx-auto mb-8 leading-relaxed opacity-80">
              Mari bersama menebar manfaat melalui pendidikan, sosial, dan dakwah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/yayasan" className="no-underline">
                <Button variant="primary" size="lg" className="w-full sm:w-auto px-10 h-14 rounded-full">Tentang Kami</Button>
              </Link>
              <Link href="/donasi" className="no-underline">
                <Button variant="outline" size="lg" icon={Icons.Heart} className="w-full sm:w-auto px-10 h-14 rounded-full">Donasi Sekarang</Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
