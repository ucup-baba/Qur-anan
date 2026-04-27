'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Icon, Icons } from '@/presentation/components/icons';

const ADMIN_NAV_ITEMS = [
  { path: '/admin/banner', label: 'Banner Utama', icon: Icons.ImageIcon, requireSuper: false },
  { path: '/admin/berita', label: 'Berita & Artikel', icon: Icons.Newspaper, requireSuper: false },
  { path: '/admin/donasi', label: 'Kampanye Donasi', icon: Icons.Heart, requireSuper: false },
  { path: '/admin/pengguna', label: 'Pengguna & Akses', icon: Icons.Users, requireSuper: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithGoogle, isAdmin, isSuperAdmin } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-[var(--bq-paper-200)] border-t-[var(--bq-brown-400)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--bq-brown-50)] flex items-center justify-center mx-auto mb-5">
          <Icon d={Icons.Lock} size={28} style={{ color: 'var(--bq-brown-500)' }} />
        </div>
        <h1 className="text-xl font-bold text-[var(--bq-paper-800)] mb-2">Area Khusus Admin</h1>
        <p className="text-sm text-[var(--bq-paper-500)] mb-6 leading-relaxed">
          Halaman ini hanya untuk pengelola Yayasan Baitul Qowwam. Masuk dengan akun admin untuk melanjutkan.
        </p>
        <button
          onClick={() => signInWithGoogle()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bq-brown-500)] text-white text-sm font-semibold hover:bg-[var(--bq-brown-600)] transition-colors"
        >
          Masuk dengan Google
        </button>
        <div className="mt-6">
          <Link href="/" className="text-xs text-[var(--bq-paper-500)] hover:text-[var(--bq-brown-500)]">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <Icon d={Icons.Shield} size={28} style={{ color: '#dc2626' }} />
        </div>
        <h1 className="text-xl font-bold text-[var(--bq-paper-800)] mb-2">Akses Ditolak</h1>
        <p className="text-sm text-[var(--bq-paper-500)] mb-2 leading-relaxed">
          Akun <span className="font-semibold text-[var(--bq-paper-700)]">{user.email}</span> tidak memiliki izin untuk mengakses panel admin.
        </p>
        <p className="text-xs text-[var(--bq-paper-400)] mb-6">
          Hubungi pengurus yayasan jika kamu seharusnya memiliki akses.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bq-brown-500)] text-white text-sm font-semibold hover:bg-[var(--bq-brown-600)] transition-colors no-underline"
        >
          Kembali ke beranda
        </Link>
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
            {ADMIN_NAV_ITEMS.filter((item) => !item.requireSuper || isSuperAdmin).map((item) => {
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
                  {item.requireSuper && (
                    <span className="ml-auto text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-[var(--bq-gold-400)] to-[var(--bq-gold-600)] text-white font-bold">
                      Super
                    </span>
                  )}
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
