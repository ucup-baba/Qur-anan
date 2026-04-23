import React from 'react';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { Icon, Icons } from '@/presentation/components/icons';

export const metadata = {
  title: 'Donasi - Qur-anan',
  description: 'Salurkan donasi Anda melalui Yayasan Baitul Qowwam',
};

export default function DonasiPage() {
  return (
    <div className="min-h-[80vh] py-12 md:py-20 px-4 md:px-6 max-w-[800px] mx-auto">
      <div className="text-center mb-10 md:mb-14">
        <h1 className="bq-serif text-3xl md:text-5xl text-[var(--bq-paper-800)] mb-4 font-medium tracking-[-0.5px]">Mari Berbagi</h1>
        <p className="text-[var(--bq-paper-500)] text-sm md:text-base max-w-lg mx-auto">
          "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji." (Al-Baqarah: 261)
        </p>
      </div>

      <Card className="p-6 md:p-10 mb-8 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-[var(--bq-gold-50)] opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[var(--bq-brown-500)] text-white flex items-center justify-center">
              <Icon d={Icons.Heart} size={20} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[var(--bq-paper-800)]">Rekening Donasi</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-[var(--bq-paper-200)] bg-[var(--bq-paper-50)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[var(--bq-paper-500)] mb-1 uppercase tracking-wider">Bank Syariah Indonesia (BSI)</p>
                <p className="text-2xl md:text-3xl font-mono font-bold text-[var(--bq-paper-800)] tracking-widest">7123 4567 89</p>
                <p className="text-sm text-[var(--bq-paper-600)] mt-1">a.n. Yayasan Baitul Qowwam</p>
              </div>
              <Button variant="outline" icon={Icons.Copy}>Salin No. Rekening</Button>
            </div>
            
            <div className="p-4 rounded-xl border border-[var(--bq-paper-200)] bg-[var(--bq-paper-50)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[var(--bq-paper-500)] mb-1 uppercase tracking-wider">Bank Muamalat</p>
                <p className="text-2xl md:text-3xl font-mono font-bold text-[var(--bq-paper-800)] tracking-widest">3010 9876 54</p>
                <p className="text-sm text-[var(--bq-paper-600)] mt-1">a.n. Yayasan Baitul Qowwam</p>
              </div>
              <Button variant="outline" icon={Icons.Copy}>Salin No. Rekening</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p className="text-sm text-[var(--bq-paper-500)] mb-4">
          Untuk konfirmasi donasi atau informasi lebih lanjut, silakan hubungi admin kami.
        </p>
        <Button variant="primary" icon={Icons.Check}>Konfirmasi Donasi via WhatsApp</Button>
      </div>
    </div>
  );
}
