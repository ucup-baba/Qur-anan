'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, Icons } from '../icons';

const USER_NAV_ITEMS = [
  { path: '/',        label: 'Beranda',  icon: Icons.Home },
  { path: '/quran',   label: "Qur'an",   icon: Icons.Book },
  { path: '/sholat',  label: 'Sholat',   icon: Icons.Clock },
  { path: '/yayasan', label: 'Yayasan',  icon: Icons.Heart },
  { path: '/profile', label: 'Profile',  icon: Icons.User },
];

const ADMIN_NAV_ITEMS = [
  { path: '/admin/banner', label: 'Banner',  icon: Icons.ImageIcon },
  { path: '/admin/berita', label: 'Artikel', icon: Icons.Newspaper },
  { path: '/admin/donasi', label: 'Donasi',  icon: Icons.Heart },
  { path: '/profile',      label: 'Profile', icon: Icons.User }, // To allow exiting admin easily
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');
  const itemsToRender = isAdminRoute ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  const isActive = (p: string) => {
    // For root, exact match
    if (p === '/') return pathname === '/';
    // For admin sub-routes, use exact match to avoid highlighting both
    if (isAdminRoute && p.startsWith('/admin')) return pathname === p;
    // Otherwise, startsWith
    return pathname.startsWith(p);
  };

  return (
    <div className="md:hidden fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-4 right-4 bg-white/90 border border-[#F1E9DB] px-2 py-3 flex justify-around items-center z-50 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 ease-in-out">
      {itemsToRender.map(item => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            prefetch
            className={`flex flex-col items-center gap-0.5 no-underline transition-all duration-300 transform ${
              active ? 'text-[#8B5E3C] scale-110' : 'text-[#A0937D] hover:text-[#8B5E3C]'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-300 ${active ? 'bg-[#8B5E3C]/10 scale-110' : 'hover:bg-[#8B5E3C]/5'}`}>
              <Icon d={item.icon} size={22} stroke={active ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] tracking-tight transition-all ${active ? 'font-bold opacity-100' : 'font-medium opacity-70'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
