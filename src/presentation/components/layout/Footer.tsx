import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  explore: ['Beranda', "Baca Qur'an", 'Jadwal Sholat', "Do'a Harian", 'Asmaul Husna'],
  yayasan: ['Tentang Kami', 'Program', 'Donasi', 'Laporan', 'Kontak'],
};

export const Footer: React.FC = () => (
  <footer className="hidden md:block bg-[var(--bq-paper-700)] text-[var(--bq-paper-200)] mt-16 pt-12 pb-6 px-4 md:px-6">
    <div className="max-w-7xl mx-auto">
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-9 h-9 overflow-hidden rounded-lg">
              <Image 
                src="/logo.png" 
                alt="Logo Qur'anan" 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--bq-paper-50)] leading-tight">Qur&apos;anan</div>
              <div className="text-[10px] text-[var(--bq-paper-400)] tracking-[1.2px] uppercase leading-tight">BAITUL QOWWAM</div>
            </div>
          </div>
          <p className="text-[13px] text-[var(--bq-paper-300)] leading-relaxed m-0 max-w-[280px]">
            Membaca Qur&apos;an, mengenal yayasan, menebar manfaat. Dari keluarga besar Baitul Qowwam untuk ummat.
          </p>
        </div>

        {/* Explore */}
        <div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--bq-paper-400)] mb-3">Jelajahi</div>
          {footerLinks.explore.map(x => (
            <div key={x} className="text-[13px] py-1 text-[var(--bq-paper-200)] hover:text-white transition-colors cursor-pointer">{x}</div>
          ))}
        </div>

        {/* Yayasan */}
        <div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--bq-paper-400)] mb-3">Yayasan</div>
          {footerLinks.yayasan.map(x => (
            <div key={x} className="text-[13px] py-1 text-[var(--bq-paper-200)] hover:text-white transition-colors cursor-pointer">{x}</div>
          ))}
        </div>

        {/* Contact */}
        <div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--bq-paper-400)] mb-3">Kontak</div>
          <div className="text-[13px] text-[var(--bq-paper-200)] leading-relaxed">
            Jl. Baitul Qowwam No. 1<br />
            Cilegon, Banten<br />
            info@baitulqowwam.or.id
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between flex-wrap gap-3 text-[11px] text-[var(--bq-paper-400)]">
        <div>© 2026 Yayasan Baitul Qowwam · Semua hak dilindungi</div>
        <div>Qur&apos;an data: equran.id &amp; alquran.cloud</div>
      </div>
    </div>
  </footer>
);
