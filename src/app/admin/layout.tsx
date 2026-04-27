'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Icon, Icons } from '@/presentation/components/icons';

const ADMIN_EMAIL = 'baitulqowwam123@gmail.com';

const ADMIN_NAV_ITEMS = [
  { path: '/admin/banner', label: 'Banner Utama', icon: Icons.ImageIcon },
  { path: '/admin/berita', label: 'Berita & Artikel', icon: Icons.Newspaper },
  { path: '/admin/donasi', label: 'Kampanye Donasi', icon: Icons.Heart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-[var(--bq-paper-200)] border-t-[var(--bq-brown-400)]" />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row gap-6">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0">
        <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-4 shadow-[var(--bq-shadow-sm)] sticky top-24">
          <div className="text-xs font-bold text-[var(--bq-paper-500)] uppercase tracking-wider mb-3 px-3">
            Menu Admin
          </div>
          <nav className="flex flex-col gap-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              // Exact match for active to prevent multiple highlights
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors no-underline ${
                    active
                      ? 'bg-[var(--bq-brown-50)] text-[var(--bq-brown-600)] font-semibold'
                      : 'text-[var(--bq-paper-600)] hover:bg-[var(--bq-paper-50)] hover:text-[var(--bq-brown-500)]'
                  }`}
                >
                  <Icon d={item.icon} size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-[var(--bq-paper-100)] flex flex-col gap-1">
             <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-[var(--bq-paper-500)] hover:text-[var(--bq-brown-500)] text-sm transition-colors no-underline"
            >
              <Icon d={Icons.ArrowLeft} size={16} />
              <span>Kembali ke Situs</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
