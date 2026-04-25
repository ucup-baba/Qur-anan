import React from 'react';
import { DonationCard } from '@/presentation/components/yayasan/DonationCard';
import { RekeningSection } from '@/presentation/components/yayasan/RekeningSection';

export const metadata = {
  title: 'Donasi - Qur-anan',
  description: 'Salurkan donasi Anda melalui Yayasan Baitul Qowwam',
};

export default function DonasiPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 md:py-10">
      <div className="mb-6 md:mb-8">
        <div className="text-[11px] tracking-[1.4px] uppercase text-[var(--bq-gold-400)] font-semibold mb-1.5">
          Donasi
        </div>
        <h1 className="bq-serif text-3xl md:text-[40px] font-medium m-0 mb-2 text-[var(--bq-paper-800)] tracking-[-0.5px]">
          Program yang membutuhkan dukunganmu
        </h1>
        <p className="text-sm md:text-base text-[var(--bq-paper-500)] m-0 max-w-[600px] leading-relaxed">
          Setiap rupiah dialirkan langsung ke penerima manfaat. Kami publikasikan laporan bulanan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <DonationCard title="Renovasi Asrama Panti" description="Memperbaiki 12 kamar asrama untuk 48 santri yatim di Cilegon." raised={68500000} target={120000000} donors={214} urgent />
        <DonationCard title="Beasiswa Tahfidz 2026" description="Biaya hidup & pendidikan 30 santri penghafal Qur'an selama 1 tahun." raised={145000000} target={200000000} donors={387} />
        <DonationCard title="Kitab & Al-Qur'an" description="Pengadaan 500 mushaf dan kitab tafsir untuk perpustakaan pesantren." raised={12300000} target={40000000} donors={89} />
        <DonationCard title="Infaq Bulanan" description="Donasi rutin untuk operasional panti asuhan & pesantren." raised={8500000} target={25000000} donors={142} />
      </div>

      <RekeningSection />
    </div>
  );
}
