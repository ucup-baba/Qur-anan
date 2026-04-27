import React from 'react';
import { DonationCard } from '@/presentation/components/yayasan/DonationCard';
import { RekeningSection } from '@/presentation/components/yayasan/RekeningSection';
import { getDonationCampaigns } from '@/infrastructure/firebase/donations';

export const revalidate = 0; // Disable static caching so it always fetches fresh data

export const metadata = {
  title: 'Donasi - Qur-anan',
  description: 'Salurkan donasi Anda melalui Yayasan Baitul Qowwam',
};

export default async function DonasiPage() {
  const campaigns = await getDonationCampaigns(true);

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

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', paddingBottom: 8, marginBottom: 24 }}>
        {campaigns.length > 0 ? (
          campaigns.map(c => (
            <DonationCard 
              key={c.id}
              title={c.title} 
              description={c.description} 
              image={c.posterUrl} 
            />
          ))
        ) : (
          <>
            <DonationCard title="Wakaf Pembangunan Asrama" description="Penyempurnaan pembangunan asrama dan kelas Panti Asuhan Baitul Qowwam." urgent image="/donasi/donasi-wakaf.png" />
            <DonationCard title="Donasi Operasional" description="Raih keberkahan, wujudkan senyum santri yatim & dhuafa Panti Asuhan Baitul Qowwam." image="/donasi/donasi-operasional.png" />
          </>
        )}
      </div>

      <RekeningSection />
    </div>
  );
}
