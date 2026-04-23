import React from 'react';
import { Card } from '@/presentation/components/ui/Card';
import { Icon, Icons } from '@/presentation/components/icons';

export const metadata = {
  title: 'Tentang Yayasan - Qur-anan',
  description: 'Profil Yayasan Baitul Qowwam',
};

export default function YayasanPage() {
  return (
    <div className="min-h-[80vh] py-12 md:py-20 px-4 md:px-6 max-w-[800px] mx-auto">
      <div className="text-center mb-12">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl bg-[var(--bq-brown-500)] text-[var(--bq-gold-200)] flex items-center justify-center mb-6">
          <span className="bq-arabic text-3xl md:text-4xl leading-none">ب</span>
        </div>
        <h1 className="bq-serif text-3xl md:text-5xl text-[var(--bq-paper-800)] mb-4 font-medium tracking-[-0.5px]">Yayasan Baitul Qowwam</h1>
        <p className="text-[var(--bq-paper-500)] text-sm md:text-base max-w-lg mx-auto">
          Membangun generasi Islami melalui pendidikan, sosial, dan dakwah.
        </p>
      </div>

      <div className="space-y-6 md:space-y-8 text-[var(--bq-paper-700)] text-sm md:text-[15px] leading-relaxed">
        <Card className="p-6 md:p-8">
          <h2 className="bq-serif text-xl md:text-2xl mb-4 text-[var(--bq-paper-800)]">Visi Kami</h2>
          <p>
            Menjadi lembaga sosial dan keagamaan yang terdepan dalam memberdayakan umat melalui pendidikan al-Qur'an, pengembangan karakter islami, dan kepedulian sosial yang berkelanjutan.
          </p>
        </Card>

        <Card className="p-6 md:p-8">
          <h2 className="bq-serif text-xl md:text-2xl mb-4 text-[var(--bq-paper-800)]">Program Utama</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)] flex items-center justify-center flex-shrink-0">
                <Icon d={Icons.Book} size={14} />
              </div>
              <div>
                <strong className="block text-[var(--bq-paper-800)]">Taman Pendidikan Al-Qur'an (TPA)</strong>
                <span className="text-[var(--bq-paper-500)]">Membina anak-anak untuk membaca dan menghafal Al-Qur'an.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-[var(--bq-gold-50)] text-[var(--bq-gold-500)] flex items-center justify-center flex-shrink-0">
                <Icon d={Icons.Heart} size={14} />
              </div>
              <div>
                <strong className="block text-[var(--bq-paper-800)]">Santunan Yatim & Dhuafa</strong>
                <span className="text-[var(--bq-paper-500)]">Program berbagi kebahagiaan untuk mereka yang membutuhkan.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-[var(--bq-brown-100)] text-[var(--bq-brown-600)] flex items-center justify-center flex-shrink-0">
                <Icon d={Icons.User} size={14} />
              </div>
              <div>
                <strong className="block text-[var(--bq-paper-800)]">Kajian Rutin Muslimah</strong>
                <span className="text-[var(--bq-paper-500)]">Pembinaan keislaman untuk mempererat silaturahim dan ilmu agama.</span>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
