'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { useSholat } from '@/presentation/hooks/useSholat';

function Countdown({ time }: { time: string }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const tick = () => {
      const [h, m] = time.split(':').map(Number);
      const target = new Date();
      target.setHours(h, m, 0, 0);
      let diff = target.getTime() - Date.now();
      if (diff < 0) {
        target.setDate(target.getDate() + 1);
        diff = target.getTime() - Date.now();
      }
      const mins = Math.floor(diff / 60000);
      const hLeft = Math.floor(mins / 60);
      const mLeft = mins % 60;
      setText(hLeft > 0 ? `${hLeft}j ${mLeft}m lagi` : `${mLeft}m lagi`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [time]);
  return <>{text}</>;
}

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatGregorian(d: Date) {
  return `${DAYS_ID[d.getDay()]}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

const HIJRI_MONTHS_ID = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', "Sya'ban",
  'Ramadhan', 'Syawal', "Dzulqa'dah", 'Dzulhijjah',
];

function formatHijri(d: Date) {
  try {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(d);
    const get = (type: string) => parts.find(p => p.type === type)?.value ?? '';
    const day = get('day');
    const monthIdx = Math.max(0, Math.min(11, parseInt(get('month'), 10) - 1));
    const year = get('year').replace(/[^0-9]/g, '');
    return `${day} ${HIJRI_MONTHS_ID[monthIdx]} ${year} H`;
  } catch {
    return '';
  }
}

function getPrayerIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('subuh')) return Icons.Sunrise;
  if (n.includes('dzuhur')) return Icons.Sun;
  if (n.includes('ashar')) return Icons.Cloud;
  if (n.includes('maghrib')) return Icons.Sunset;
  if (n.includes('isya')) return Icons.Moon;
  return Icons.Clock;
}

export function TodayCard() {
  const { jadwal, lokasi, loading, nextPrayer } = useSholat();
  const now = new Date();

  const times = jadwal
    ? [
        { name: 'Subuh', time: jadwal.subuh },
        { name: 'Dzuhur', time: jadwal.dzuhur },
        { name: 'Ashar', time: jadwal.ashar },
        { name: 'Maghrib', time: jadwal.maghrib },
        { name: 'Isya', time: jadwal.isya },
      ]
    : [];

  return (
    <div className="mx-4 md:mx-0 mb-6 rounded-2xl bg-gradient-to-br from-[var(--bq-brown-500)] to-[var(--bq-brown-400)] text-[var(--bq-paper-50)] p-5 md:p-6 shadow-md relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(201,162,78,0.2),transparent_70%)]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
        <div>
          <div className="text-[11px] uppercase tracking-[1.5px] opacity-70 font-semibold mb-1">Hari ini</div>
          <div className="text-base md:text-lg font-bold leading-tight">{formatGregorian(now)}</div>
          <div className="text-[12px] opacity-80 mt-0.5">{formatHijri(now)}</div>
        </div>
        <div className="flex items-center gap-2 text-[12px] opacity-90">
          <Icon d={Icons.MapPin} size={14} />
          <span className="font-medium">{loading ? 'Memuat lokasi…' : lokasi}</span>
        </div>
      </div>

      {loading ? (
        <>
          <div className="md:hidden h-20 rounded-xl bg-white/10 animate-pulse relative z-10" />
          <div className="hidden md:grid grid-cols-5 gap-2 relative z-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-white/10 animate-pulse" />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Mobile: next prayer only */}
          {nextPrayer && (
            <div className="md:hidden rounded-xl bg-[var(--bq-gold-400)] text-[var(--bq-paper-900)] p-4 flex items-center justify-between shadow-lg relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/30 flex items-center justify-center">
                  <Icon d={getPrayerIcon(nextPrayer.name)} size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Sholat berikutnya</div>
                  <div className="text-lg font-bold leading-tight">{nextPrayer.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono leading-none">{nextPrayer.time}</div>
                <div className="text-[10px] font-semibold opacity-80 mt-1"><Countdown time={nextPrayer.time} /></div>
              </div>
            </div>
          )}

          {/* Desktop: all 5 */}
          <div className="hidden md:grid grid-cols-5 gap-2 relative z-10">
            {times.map((t) => {
              const isNext = nextPrayer?.name === t.name;
              return (
                <div
                  key={t.name}
                  className={`rounded-xl p-3 text-center transition-all ${
                    isNext
                      ? 'bg-[var(--bq-gold-400)] text-[var(--bq-paper-900)] shadow-lg scale-105'
                      : 'bg-white/10 text-[var(--bq-paper-50)]'
                  }`}
                >
                  <Icon d={getPrayerIcon(t.name)} size={14} className="mx-auto mb-1 opacity-90" />
                  <div className="text-[11px] font-semibold uppercase tracking-wide opacity-90">{t.name}</div>
                  <div className="text-sm font-bold font-mono mt-0.5">{t.time}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="relative z-10 mt-4 flex justify-end">
        <Link href="/sholat" className="text-[11px] font-bold text-[var(--bq-gold-200)] hover:text-[var(--bq-gold-100)] flex items-center gap-1 no-underline">
          Lihat jadwal lengkap <Icon d={Icons.ArrowRight} size={12} />
        </Link>
      </div>
    </div>
  );
}
