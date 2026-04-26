'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, Icons } from '@/presentation/components/icons';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';
import { UserAvatar } from '@/presentation/components/ui/UserAvatar';
import { useAuth } from '@/presentation/hooks/useAuth';

interface MenuItem {
  icon: typeof Icons[keyof typeof Icons];
  label: string;
  desc: string;
  href: string;
  tone: 'brown' | 'gold';
}

const menuItems: MenuItem[] = [
  {
    icon: Icons.Settings,
    label: 'Pengaturan',
    desc: 'Kelola preferensi aplikasi',
    href: '/profile/settings',
    tone: 'brown',
  },
  {
    icon: Icons.Bell,
    label: 'Notifikasi',
    desc: 'Pengingat sholat & ayat',
    href: '/profile/notifikasi',
    tone: 'gold',
  },
  {
    icon: Icons.Info,
    label: 'Bantuan',
    desc: 'Pusat bantuan & FAQ',
    href: '/profile/bantuan',
    tone: 'brown',
  },
];

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const ok = window.confirm('Yakin ingin keluar?');
    if (!ok) return;
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-6">
      <div className="max-w-[600px] mx-auto">
        <div className="flex flex-col items-center mb-8">
          {loading ? (
            <div className="w-24 h-24 rounded-full bg-[var(--bq-paper-200)] animate-pulse mb-4" />
          ) : (
            <div className="mb-4 shadow-lg" style={{ borderRadius: '50%', border: '2px solid var(--bq-paper-100)' }}>
              <UserAvatar
                photoURL={user?.photoURL}
                displayName={user?.displayName}
                size={96}
              />
            </div>
          )}

          <h1 className="text-2xl font-bold text-[var(--bq-paper-800)]">
            {loading ? '...' : user?.displayName || 'Profil Pengguna'}
          </h1>
          <p className="text-[var(--bq-paper-500)] text-sm mt-1">
            {loading
              ? ' '
              : user?.email
              ? user.email
              : "Assalamu'alaikum, masuk untuk pengalaman lengkap"}
          </p>
        </div>

        {!loading && !user && (
          <Card className="p-5 mb-6 bg-gradient-to-br from-[var(--bq-brown-50)] to-[var(--bq-gold-50)] border-[var(--bq-gold-200)]">
            <div className="text-sm font-bold text-[var(--bq-paper-800)] mb-1">
              Masuk untuk sinkronisasi
            </div>
            <p className="text-xs text-[var(--bq-paper-600)] mb-3">
              Simpan favorit, last read, dan preferensi di semua perangkat.
            </p>
            <Link href="/login" className="no-underline">
              <Button variant="primary" size="sm">
                Masuk dengan Google
              </Button>
            </Link>
          </Card>
        )}

        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href} className="no-underline block">
              <Card className="p-4 flex items-center gap-4 hover:border-[var(--bq-brown-300)] transition-colors">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.tone === 'gold'
                      ? 'bg-[var(--bq-gold-50)] text-[var(--bq-gold-500)]'
                      : 'bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)]'
                  }`}
                >
                  <Icon d={item.icon} size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[var(--bq-paper-800)]">
                    {item.label}
                  </div>
                  <div className="text-[10px] text-[var(--bq-paper-500)]">{item.desc}</div>
                </div>
                <Icon
                  d={Icons.ChevronRight}
                  size={18}
                  className="text-[var(--bq-paper-300)]"
                />
              </Card>
            </Link>
          ))}
        </div>

        {!loading && user && (
          <div className="mt-8">
            <Button
              variant="outline"
              className="w-full text-red-500 border-red-100 hover:bg-red-50"
              onClick={handleSignOut}
            >
              Keluar Akun
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
