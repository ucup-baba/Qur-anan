import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono, Amiri_Quran, Amiri } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/presentation/components/layout/TopNav";
import { Footer } from "@/presentation/components/layout/Footer";
import { BottomNav } from "@/presentation/components/layout/BottomNav";
import { GlobalAudioPlayer } from "@/presentation/components/quran/GlobalAudioPlayer";
import { PWAInstallPrompt } from "@/presentation/components/layout/PWAInstallPrompt";
import { AppProviders } from "@/presentation/components/providers/AppProviders";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Roboto", "sans-serif"],
  adjustFontFallback: true,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  preload: false,
  fallback: ["Georgia", "serif"],
  adjustFontFallback: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const amiriQuran = Amiri_Quran({
  weight: "400",
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  fallback: ["Amiri", "Scheherazade", "serif"],
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
  preload: false,
  fallback: ["Scheherazade", "serif"],
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
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icons/icon-192.png',
  },
  keywords: [
    'quran', 'al-quran', 'sholat', 'kiblat', 'islami', 
    'yayasan baitul qowwam', 'baitul qowwam', 'pondok pesantren baitul qowwam', 
    'quranan', 'quranan qu', 'baca quran online'
  ],
  openGraph: {
    title: "Qur'anan - Baitul Qowwam",
    description: "Baca Al-Qur'an, jadwal sholat, dan arah kiblat secara online.",
    type: 'website',
    locale: 'id_ID',
  },
  verification: {
    google: 'b1t7ppD3pK1B8ps44WvKKsSKDszxFibBfp33ePxLP_Y',
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
      suppressHydrationWarning
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
        <AppProviders>
          <TopNav />
          <main style={{ flex: 1 }} className="pb-[100px] md:pb-0">
            {children}
          </main>
          <Footer />
          <GlobalAudioPlayer />
          <PWAInstallPrompt />
          <BottomNav />
        </AppProviders>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(reg) {
                    reg.update();
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
