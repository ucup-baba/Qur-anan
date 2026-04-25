'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Input } from '@/presentation/components/ui/Input';
import { asmaulHusna } from '@/infrastructure/data/asmaulHusna';

export default function AsmaulHusnaPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return asmaulHusna;
    return asmaulHusna.filter(
      (a) =>
        a.latin.toLowerCase().includes(q) ||
        a.arti.toLowerCase().includes(q) ||
        String(a.nomor).includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-4 md:px-6">
      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 py-10 px-6 rounded-3xl bg-gradient-to-br from-[var(--bq-brown-500)] via-[var(--bq-brown-400)] to-[var(--bq-gold-400)] text-white relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <div className="text-[11px] tracking-[1.5px] uppercase opacity-70 mb-3 font-semibold">
              99 Nama Allah
            </div>
            <h1 className="bq-serif text-3xl md:text-4xl font-bold mb-2">Asmaul Husna</h1>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              Nama-nama indah Allah yang mencerminkan sifat-sifatNya Yang Maha Sempurna.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Cari nama atau arti..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={Icons.Search}
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--bq-paper-400)]">
            Tidak ditemukan nama yang cocok.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((a) => (
              <div
                key={a.nomor}
                className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5 hover:border-[var(--bq-gold-300)] hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-[var(--bq-brown-50)] text-[var(--bq-brown-600)] rounded-lg text-xs font-bold font-mono">
                    {a.nomor}
                  </span>
                  <div
                    className="bq-arabic text-[28px] text-[var(--bq-paper-800)] leading-tight text-right"
                    dir="rtl"
                  >
                    {a.arab}
                  </div>
                </div>
                <div className="text-sm font-bold text-[var(--bq-paper-800)] mb-1">
                  {a.latin}
                </div>
                <div className="text-xs text-[var(--bq-paper-500)] leading-relaxed">
                  {a.arti}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-xs text-[var(--bq-paper-500)] hover:text-[var(--bq-brown-500)] inline-flex items-center gap-1"
          >
            <Icon d={Icons.ChevronLeft} size={14} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
