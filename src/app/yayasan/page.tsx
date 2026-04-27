import React from 'react';
import Link from 'next/link';
import { Button } from '@/presentation/components/ui/Button';
import { SectionHeader } from '@/presentation/components/ui/SectionHeader';
import { Icons } from '@/presentation/components/icons';
import { BannerSlider } from '@/presentation/components/yayasan/BannerSlider';
import { KajianCard } from '@/presentation/components/yayasan/KajianCard';
import { ArticleSlider } from '@/presentation/components/yayasan/ArticleSlider';
import { getLatestKajianVideos } from '@/infrastructure/api/youtubeApi';
import { getBanners } from '@/infrastructure/firebase/banners';

export const revalidate = 0;

export const metadata = {
  title: 'Tentang Yayasan - Qur-anan',
  description: 'Profil Yayasan Baitul Qowwam',
};

export default async function YayasanPage() {
  const [kajianVideos, dynamicBanners] = await Promise.all([
    getLatestKajianVideos(5),
    getBanners(7)
  ]);

  const bannerImages = dynamicBanners.length > 0 
    ? dynamicBanners.map(b => ({ src: b.imageUrl, alt: 'Banner Yayasan' }))
    : [{ src: '/banner/IMG_2578.jpg', alt: 'Kegiatan Baitul Qowwam' }];

  return (
    <div>
      <div className="pt-6 pb-10 px-4 sm:px-6 bg-[var(--bq-paper-100)] border-b border-[var(--bq-paper-200)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-1 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-yayasan.webp" alt="Logo Baitul Qowwam" width={52} height={52} style={{ objectFit: 'contain' }} />
            <span className="text-[11px] tracking-[1.4px] uppercase text-[var(--bq-gold-400)] font-semibold leading-[1.6]">
              Yayasan<br />Baitul Qowwam
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center bq-hero-grid">
            <div>
              <h1 className="bq-serif text-4xl md:text-[52px] font-medium m-0 mb-3.5 text-[var(--bq-paper-800)] tracking-[-0.8px] leading-[1.1] md:leading-[1.05]">
                Dari satu anak, tumbuh menjadi rumah bagi puluhan.
              </h1>
              <p className="text-base text-[var(--bq-paper-600)] m-0 mb-6 leading-relaxed max-w-[520px]">
                Berawal tahun 2009 dari satu anak yang ditampung di rumah seorang pengurus, Panti Asuhan Baitul Qowwam kini merawat 50 santri dari berbagai penjuru Indonesia — dengan dua asrama di Tempel, Sleman, dan rekam jejak alumni yang terus melanjutkan pendidikan ke UGM, UNY, UII, dan perguruan tinggi terkemuka lainnya.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/donasi#rekening" className="no-underline">
                  <Button variant="primary" size="lg" icon={Icons.Heart2}>Donasi</Button>
                </Link>
                <Button variant="secondary" size="lg" iconRight={Icons.ArrowRight}>Kegiatan</Button>
              </div>
            </div>
            <BannerSlider
              images={bannerImages}
              aspect="4/3"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-10 pt-8 border-t border-[var(--bq-paper-200)]">
            {[['15+', 'Tahun mengabdi'], ['50', 'Santri bermukim'], ['15+', 'Perguruan tinggi'], ['2009', 'Tahun berdiri']].map(([n, l]) => (
              <div key={l}>
                <div className="bq-serif text-3xl md:text-4xl font-medium text-[var(--bq-paper-800)] tracking-[-0.5px]">{n}</div>
                <div className="text-xs text-[var(--bq-paper-500)] tracking-[0.4px] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-12">
        <SectionHeader eyebrow="Informasi" title="Berita terbaru" subtitle="Kabar & artikel dari yayasan." />
        <ArticleSlider />

        <SectionHeader eyebrow="Kegiatan" title="Program rutin" subtitle="Terbuka untuk umum." />
        <div className="grid grid-cols-1 gap-5 mb-12">
          <KajianCard videos={kajianVideos} />
        </div>

      </div>
    </div>
  );
}
