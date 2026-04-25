'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Input } from '@/presentation/components/ui/Input';
import { Badge } from '@/presentation/components/ui/Badge';
import { doaHarian, groupByKategori } from '@/infrastructure/data/doaHarian';

export default function DoaPage() {
  const [query, setQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const kategoris = useMemo(
    () => Array.from(new Set(doaHarian.map((d) => d.kategori))),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doaHarian.filter((d) => {
      const matchKategori = !selectedKategori || d.kategori === selectedKategori;
      const matchQuery =
        !q ||
        d.judul.toLowerCase().includes(q) ||
        d.arti.toLowerCase().includes(q) ||
        d.latin.toLowerCase().includes(q);
      return matchKategori && matchQuery;
    });
  }, [query, selectedKategori]);

  const grouped = useMemo(() => groupByKategori(filtered), [filtered]);

  const handleCopy = async (d: { id: string; arab: string; latin: string; arti: string; judul: string }) => {
    const text = `${d.judul}\n\n${d.arab}\n\n${d.latin}\n\nArtinya: ${d.arti}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(d.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-4 md:px-6">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 py-10 px-6 rounded-3xl bg-gradient-to-br from-[var(--bq-gold-400)] via-[var(--bq-brown-400)] to-[var(--bq-brown-500)] text-white relative overflow-hidden">
          <div className="absolute -left-16 -bottom-10 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12),transparent_70%)]" />
          <div className="relative z-10">
            <div className="text-[11px] tracking-[1.5px] uppercase opacity-70 mb-3 font-semibold">
              Kumpulan
            </div>
            <h1 className="bq-serif text-3xl md:text-4xl font-bold mb-2">Do'a Harian</h1>
            <p className="text-sm opacity-85 max-w-md mx-auto">
              Do'a-do'a pilihan untuk menemani aktivitas sehari-hari.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Cari do'a..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={Icons.Search}
          />
        </div>

        {/* Filter Kategori */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          <button
            onClick={() => setSelectedKategori(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              !selectedKategori
                ? 'bg-[var(--bq-brown-500)] text-white'
                : 'bg-white border border-[var(--bq-paper-200)] text-[var(--bq-paper-600)]'
            }`}
          >
            Semua
          </button>
          {kategoris.map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKategori(k)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedKategori === k
                  ? 'bg-[var(--bq-brown-500)] text-white'
                  : 'bg-white border border-[var(--bq-paper-200)] text-[var(--bq-paper-600)]'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-[var(--bq-paper-400)]">
            Tidak ada do'a yang cocok.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([kategori, items]) => (
              <div key={kategori}>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--bq-paper-500)] mb-3 px-1">
                  {kategori}
                </h2>
                <div className="space-y-4">
                  {items.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-5 md:p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge tone="brown">{d.kategori}</Badge>
                          <h3 className="text-base md:text-lg font-bold text-[var(--bq-paper-800)] mt-2">
                            {d.judul}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleCopy(d)}
                          title="Salin"
                          className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[var(--bq-paper-200)] text-[var(--bq-paper-500)] hover:bg-[var(--bq-paper-100)] transition-colors"
                        >
                          <Icon d={copiedId === d.id ? Icons.Check : Icons.Copy} size={16} />
                        </button>
                      </div>

                      <div
                        className="bq-arabic text-right text-[28px] md:text-[32px] text-[var(--bq-paper-900)] leading-[2] mb-4"
                        dir="rtl"
                      >
                        {d.arab}
                      </div>

                      <div className="text-[13px] italic text-[var(--bq-paper-500)] mb-3 leading-relaxed">
                        {d.latin}
                      </div>

                      <div className="text-sm text-[var(--bq-paper-700)] leading-relaxed border-l-[3px] border-[var(--bq-gold-300)] pl-3">
                        {d.arti}
                      </div>
                    </div>
                  ))}
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
