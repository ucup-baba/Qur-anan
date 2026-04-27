import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quranan-qu.web.app';

  // Daftar rute statis
  const routes = [
    '',
    '/quran',
    '/doa',
    '/asmaul-husna',
    '/sholat',
    '/yayasan',
    '/donasi'
  ];

  const staticSitemap: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/yayasan' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Catatan: Jika nanti ingin halaman detail surah atau artikel ikut muncul di Google,
  // bisa ditambahkan logic untuk melakukan fetch data dari API/Firebase di sini, 
  // lalu di push ke array sitemap.

  return staticSitemap;
}
