import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono, Amiri_Quran, Amiri } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/presentation/components/layout/TopNav";
import { Footer } from "@/presentation/components/layout/Footer";
import { BottomNav } from "@/presentation/components/layout/BottomNav";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});

const amiriQuran = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qur'anan - Baitul Qowwam",
  description: "Baca Al-Qur'an, jadwal sholat, dan arah kiblat – aplikasi Islami dari Yayasan Baitul Qowwam.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Qur'anan",
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  keywords: ['quran', 'al-quran', 'sholat', 'kiblat', 'islami', 'yayasan baitul qowwam'],
  openGraph: {
    title: "Qur'anan - Baitul Qowwam",
    description: "Baca Al-Qur'an, jadwal sholat, dan arah kiblat secara online.",
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  themeColor: '#6c5236',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --bq-font-sans: ${plusJakartaSans.style.fontFamily}, system-ui, sans-serif;
            --bq-font-serif: ${fraunces.style.fontFamily}, Georgia, serif;
            --bq-font-mono: ${jetbrainsMono.style.fontFamily}, monospace;
            --bq-font-arabic: ${amiriQuran.style.fontFamily}, ${amiri.style.fontFamily}, serif;
          }
        `}} />
      </head>
      <body className={`${plusJakartaSans.className} min-h-full flex flex-col bq-root`}>
        <TopNav />
        <main style={{ flex: 1 }} className="pb-[100px] md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
