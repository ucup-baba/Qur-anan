import React from 'react';
import Link from 'next/link';
import { Button } from '@/presentation/components/ui/Button';
import { SectionHeader } from '@/presentation/components/ui/SectionHeader';
import { Icon, Icons, Placeholder } from '@/presentation/components/icons';
import { ProgramCard } from '@/presentation/components/yayasan/ProgramCard';
import { TestimonialCard } from '@/presentation/components/yayasan/TestimonialCard';
import { KajianCard } from '@/presentation/components/yayasan/KajianCard';
import { getLatestKajianVideos } from '@/infrastructure/api/youtubeApi';

export const metadata = {
  title: 'Tentang Yayasan - Qur-anan',
  description: 'Profil Yayasan Baitul Qowwam',
};

export default async function YayasanPage() {
  const kajianVideos = await getLatestKajianVideos(5);

  return (
    <div>
      <div className="pt-12 pb-10 px-4 sm:px-6 bg-[var(--bq-paper-100)] border-b border-[var(--bq-paper-200)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-[11px] tracking-[1.4px] uppercase text-[var(--bq-gold-400)] font-semibold mb-2.5">
            Yayasan Baitul Qowwam
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center bq-hero-grid">
            <div>
              <h1 className="bq-serif text-4xl md:text-[52px] font-medium m-0 mb-3.5 text-[var(--bq-paper-800)] tracking-[-0.8px] leading-[1.1] md:leading-[1.05]">
                Merawat yatim, mendidik hafidz, menerangi ummat.
              </h1>
              <p className="text-base text-[var(--bq-paper-600)] m-0 mb-6 leading-relaxed max-w-[520px]">
                Panti asuhan, pondok pesantren, dan kajian terbuka — sejak 2011 kami hadir untuk masyarakat luas dengan niat tulus menegakkan nilai-nilai Qur'ani.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/donasi" className="no-underline">
                  <Button variant="primary" size="lg" icon={Icons.Heart2}>Donasi</Button>
                </Link>
                <Button variant="secondary" size="lg" iconRight={Icons.ArrowRight}>Kegiatan</Button>
              </div>
            </div>
            <Placeholder label="foto santri / kajian" aspect="4/3" className="rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-10 pt-8 border-t border-[var(--bq-paper-200)]">
            {[['14', 'Tahun berdiri'], ['182', 'Santri & yatim'], ['46', 'Hafidz Qur\'an'], ['Rp 2,4M', 'Tersalurkan 2025']].map(([n, l]) => (
              <div key={l}>
                <div className="bq-serif text-3xl md:text-4xl font-medium text-[var(--bq-paper-800)] tracking-[-0.5px]">{n}</div>
                <div className="text-xs text-[var(--bq-paper-500)] tracking-[0.4px] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12">
        <SectionHeader eyebrow="Kegiatan" title="Program rutin" subtitle="Terbuka untuk umum." />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-12">
          <KajianCard videos={kajianVideos} />
          <ProgramCard kind="Pesantren" title="Tahfidz Qur'an" description="Program menghafal Al-Qur'an 30 juz untuk santri usia 12–18 tahun." date="Pendaftaran dibuka Juni 2026" location="Pondok Baitul Qowwam" />
          <ProgramCard kind="Sosial" title="Santunan Yatim" description="Santunan rutin 48 anak yatim & dhuafa di lingkungan sekitar." date="Setiap bulan" location="Panti Baitul Qowwam" />
        </div>
        <SectionHeader eyebrow="Testimoni" title="Kata mereka" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          <TestimonialCard quote="Alhamdulillah, anak saya tumbuh menjadi hafidz yang berakhlak di pesantren Baitul Qowwam." name="Siti Hadijah" role="Orang tua santri" />
          <TestimonialCard quote="Kajian Sabtu paginya hangat dan substansial. Saya jadi betah mengajak keluarga." name="Rudi Pratama" role="Jamaah kajian" />
          <TestimonialCard quote="Laporan donasinya transparan dan rutin. Saya tenang menitipkan infaq di sini." name="Dewi Anggraini" role="Donatur" />
        </div>

      </div>
    </div>
  );
}
