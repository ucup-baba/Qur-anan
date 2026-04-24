import React from 'react';
import { DonationCard } from '@/presentation/components/yayasan/DonationCard';

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

      {/* Transfer info */}
      <div className="bg-[var(--bq-paper-100)] border border-[var(--bq-paper-200)] rounded-2xl p-5 md:p-7">
        <div className="text-[11px] tracking-[1.4px] uppercase text-[var(--bq-gold-400)] font-semibold mb-2">
          Transfer Manual
        </div>
        <h3 className="bq-serif text-2xl font-medium m-0 mb-4 text-[var(--bq-paper-800)]">
          Rekening Yayasan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {[
            { bank: 'Bank Syariah Indonesia', no: '7123 4567 89', name: 'Yayasan Baitul Qowwam' },
            { bank: 'Bank Muamalat', no: '301 0012 345', name: 'Yayasan Baitul Qowwam' },
            { bank: 'BCA', no: '234 567 8901', name: 'Yayasan Baitul Qowwam' },
          ].map(b => (
            <div key={b.bank} className="p-4 bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-xl">
              <div className="text-[11px] text-[var(--bq-paper-500)] mb-1 font-semibold">{b.bank}</div>
              <div className="text-lg font-mono font-semibold text-[var(--bq-paper-800)] mb-0.5">{b.no}</div>
              <div className="text-xs text-[var(--bq-paper-500)]">a.n. {b.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-[var(--bq-paper-500)] leading-relaxed">
          Setelah transfer, mohon konfirmasi via WhatsApp <strong>0812-3456-7890</strong> dengan menyertakan bukti transfer agar kami catat sebagai donatur.
        </div>
      </div>
    </div>
  );
}
