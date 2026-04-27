import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  explore: [
    { label: 'Beranda', href: '/' },
    { label: "Baca Qur'an", href: '/quran' },
    { label: 'Jadwal Sholat', href: '/sholat' },
    { label: "Do'a Harian", href: '/doa' },
    { label: 'Asmaul Husna', href: '/asmaul-husna' },
  ],
  yayasan: [
    { label: 'Tentang Kami', href: '/yayasan' },
    { label: 'Program', href: '/yayasan#program' },
    { label: 'Donasi', href: '/donasi' },
    { label: 'Berita', href: '/yayasan/berita' },
    { label: 'Kontak', href: 'https://wa.me/6285643386134', external: true },
  ],
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
            <Link
              key={x.href}
              href={x.href}
              className="block text-[13px] py-1 text-[var(--bq-paper-200)] hover:text-white transition-colors no-underline"
            >
              {x.label}
            </Link>
          ))}
        </div>

        {/* Yayasan */}
        <div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--bq-paper-400)] mb-3">Yayasan</div>
          {footerLinks.yayasan.map(x => (
            x.external ? (
              <a
                key={x.href}
                href={x.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] py-1 text-[var(--bq-paper-200)] hover:text-white transition-colors no-underline"
              >
                {x.label}
              </a>
            ) : (
              <Link
                key={x.href}
                href={x.href}
                className="block text-[13px] py-1 text-[var(--bq-paper-200)] hover:text-white transition-colors no-underline"
              >
                {x.label}
              </Link>
            )
          ))}
        </div>

        {/* Contact */}
        <div>
          <div className="text-[11px] font-semibold tracking-widest uppercase text-[var(--bq-paper-400)] mb-3">Kontak</div>
          <div className="text-[13px] text-[var(--bq-paper-200)] leading-relaxed flex flex-col gap-2">
            <a
              href="https://maps.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIPCAEQLhgTGK8BGMcBGIAEMgoIAhAAGBMYFhgeMgcIAxAAGO8FMgcIBBAAGO8FMgYIBRBFGD0yBggGEEUYPTIGCAcQRRg90gEINDYzOWowajeoAgCwAgA&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=KediOoKC9XouMZGlyBmhB6uO&daddr=Area+Sawah,+Mororejo,+Kec.+Tempel,+Kabupaten+Sleman,+Daerah+Istimewa+Yogyakarta+55552"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors group"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className="group-hover:underline">
                Plumbon Kidul, Mororejo,<br />
                Tempel, Sleman,<br />
                Yogyakarta 55552
              </span>
              <span className="ml-1 text-[var(--bq-paper-400)] text-[11px]">↗ Rute</span>
            </a>
            <a
              href="https://wa.me/6285643386134"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors hover:underline"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              +62 856-4338-6134
            </a>
            <a
              href="mailto:info@baitulqowwam.or.id"
              className="hover:text-white transition-colors hover:underline"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              info@baitulqowwam.or.id
            </a>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between flex-wrap gap-3 text-[11px] text-[var(--bq-paper-400)]">
        <div>© 2026 Yayasan Baitul Qowwam · Semua hak dilindungi</div>
        <div className="flex flex-wrap gap-4 items-center">
          <Link href="/privacy-policy" className="hover:text-white transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            Kebijakan Privasi
          </Link>
          <Link href="/terms-of-service" className="hover:text-white transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            Syarat &amp; Ketentuan
          </Link>
          <span>Qur&apos;an data: equran.id &amp; alquran.cloud</span>
        </div>
      </div>
    </div>
  </footer>
);
