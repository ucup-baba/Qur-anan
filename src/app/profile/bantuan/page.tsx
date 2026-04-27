'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Breadcrumb } from '@/presentation/components/ui/Breadcrumb';

interface FAQ {
  q: string;
  a: string;
}

const faqs: FAQ[] = [
  {
    q: 'Bagaimana cara menyimpan surah pilihan?',
    a: 'Tekan ikon bookmark di pojok kanan atas halaman baca surah atau di daftar surah. Surah tersimpan akan muncul di beranda bagian "Surah Pilihan".',
  },
  {
    q: 'Apakah aplikasi bisa digunakan offline?',
    a: 'Ya. Qur\'anan menyimpan data surah yang pernah dibuka ke perangkat Anda sehingga bisa dibaca tanpa koneksi internet.',
  },
  {
    q: 'Bagaimana cara mengganti lokasi jadwal sholat?',
    a: 'Buka halaman Sholat, lalu ketuk nama kota untuk memilih lokasi lain. Anda juga bisa mengizinkan akses lokasi agar deteksi otomatis.',
  },
  {
    q: 'Kenapa notifikasi sholat tidak muncul?',
    a: 'Pastikan Anda sudah mengizinkan notifikasi di Profil → Notifikasi, lalu di pengaturan browser/perangkat. Notifikasi bergantung pada browser Anda.',
  },
  {
    q: 'Bagaimana cara memutar audio semua ayat dalam satu surah?',
    a: 'Tekan ikon putar pada ayat pertama. Pemutar audio akan otomatis lanjut ke ayat berikutnya. Anda juga bisa mengaktifkan mode ulang di pemutar.',
  },
  {
    q: 'Data saya hilang setelah ganti browser/perangkat. Kenapa?',
    a: 'Saat ini surah pilihan dan last read disimpan di perangkat masing-masing. Masuk dengan Google agar data bisa disinkronisasi di semua perangkat.',
  },
  {
    q: 'Dari mana sumber teks Al-Qur\'an dan tafsir?',
    a: 'Kami menggunakan API publik dari equran.id (teks Qur\'an + tafsir Kemenag) dan myquran.com (jadwal sholat).',
  },
];

export default function BantuanPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-4 md:px-6">
      <div className="max-w-[700px] mx-auto">
        <BackLink />

        <h1 className="text-2xl font-bold text-[var(--bq-paper-800)] mb-1">Pusat Bantuan</h1>
        <p className="text-sm text-[var(--bq-paper-500)] mb-6">
          Pertanyaan yang sering ditanyakan tentang Qur'anan.
        </p>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div
              key={idx}
              className="bg-white border border-[var(--bq-paper-200)] rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[var(--bq-paper-50)] transition-colors"
              >
                <span className="text-sm font-semibold text-[var(--bq-paper-800)]">{f.q}</span>
                <Icon
                  d={Icons.ChevronRight}
                  size={16}
                  className={`text-[var(--bq-paper-400)] shrink-0 transition-transform ${
                    openIdx === idx ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-sm text-[var(--bq-paper-600)] leading-relaxed border-t border-[var(--bq-paper-100)] pt-4">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-white border border-[var(--bq-paper-200)]">
          <div className="text-sm font-bold text-[var(--bq-paper-800)] mb-2">
            Masih butuh bantuan?
          </div>
          <p className="text-xs text-[var(--bq-paper-500)] leading-relaxed mb-3">
            Hubungi kami untuk pertanyaan, saran, atau kritik.
          </p>
          <a
            href="mailto:info@baitulqowwam.id"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--bq-brown-500)] hover:underline"
          >
            <Icon d={Icons.Info} size={14} />
            info@baitulqowwam.id
          </a>
        </div>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Breadcrumb
      className="mb-4"
      items={[
        { label: 'Beranda', href: '/' },
        { label: 'Profil', href: '/profile' },
        { label: 'Bantuan' },
      ]}
    />
  );
}
