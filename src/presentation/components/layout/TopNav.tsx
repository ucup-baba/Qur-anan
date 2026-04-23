'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { Button } from '../ui/Button';
import { Icon, Icons } from '../icons';

const NAV_ITEMS = [
  { path: '/',        label: 'Beranda' },
  { path: '/quran',   label: "Baca Qur'an" },
  { path: '/sholat',  label: 'Sholat' },
  { path: '/yayasan', label: 'Yayasan' },
  { path: '/donasi',  label: 'Donasi' },
];

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (p: string) => p === '/' ? pathname === '/' : pathname.startsWith(p);

  return (
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
          <Link href="/quran" className="no-underline">
            <Button variant="ghost" size="sm" icon={Icons.Search}>Cari</Button>
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-10 h-10 border border-[var(--bq-paper-200)] bg-[var(--bq-paper-50)] rounded-md flex items-center justify-center cursor-pointer text-[var(--bq-paper-600)] hover:bg-[var(--bq-paper-100)]"
          >
            <Icon d={mobileOpen ? Icons.X : Icons.Menu} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 border-t border-[var(--bq-paper-200)] flex flex-col gap-1 bg-[#FBF8F2]">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`px-3.5 py-3 text-sm rounded-md no-underline transition-colors ${
                isActive(item.path)
                  ? 'font-bold text-[var(--bq-paper-800)] bg-[var(--bq-paper-100)]'
                  : 'font-medium text-[var(--bq-paper-600)] hover:bg-[var(--bq-paper-100)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
