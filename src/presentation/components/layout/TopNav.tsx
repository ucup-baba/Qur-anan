'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { Icons } from '../icons';
import { GlobalSearch } from '../search/GlobalSearch';
import { useAuth } from '../../hooks/useAuth';
import { UserAvatar } from '../ui/UserAvatar';

const NAV_ITEMS = [
  { path: '/',        label: 'Beranda' },
  { path: '/quran',   label: "Baca Qur'an" },
  { path: '/sholat',  label: 'Sholat' },
  { path: '/yayasan', label: 'Yayasan' },
];

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  const isActive = (p: string) => p === '/' ? pathname === '/' : pathname.startsWith(p);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(v => !v);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FBF8F2]/90 backdrop-blur-md border-b border-[var(--bq-paper-200)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-6">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-1 flex-1 justify-center">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3.5 py-2 text-[13px] rounded-md no-underline transition-colors ${
                  isActive(item.path)
                    ? 'font-bold text-[var(--bq-paper-800)] bg-[var(--bq-paper-100)]'
                    : 'font-medium text-[var(--bq-paper-600)] hover:bg-[var(--bq-paper-100)] hover:text-[var(--bq-paper-800)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex gap-2 items-center">
            {/* Search — desktop only */}
            <Button
              variant="ghost"
              size="sm"
              icon={Icons.Search}
              onClick={() => setSearchOpen(true)}
              className="hidden md:inline-flex"
            >
              <span className="hidden sm:inline">Cari</span>
              <kbd className="hidden md:inline-flex ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-[var(--bq-paper-200)] bg-[var(--bq-paper-100)] text-[var(--bq-paper-400)]" style={{ fontFamily: 'var(--bq-font-mono)' }}>
                ⌘K
              </kbd>
            </Button>

            {/* Profile photo — mobile only */}
            <Link href="/profile" className="md:hidden no-underline" aria-label="Profil">
              <UserAvatar
                photoURL={user?.photoURL}
                displayName={user?.displayName}
                size={34}
                style={{ border: '2px solid var(--bq-paper-200)' }}
              />
            </Link>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
