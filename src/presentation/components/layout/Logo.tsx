import React from 'react';
import Link from 'next/link';

export const Logo: React.FC = () => (
  <Link href="/" className="flex items-center gap-3 no-underline">
    <div className="w-10 h-10 overflow-hidden rounded-lg flex-shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Logo Qur'anan" width={40} height={40} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div className="hidden sm:block">
      <div className="text-[15px] font-bold text-[var(--bq-paper-800)] leading-tight tracking-tight">Qur&apos;anan</div>
      <div className="text-[9px] text-[var(--bq-paper-500)] tracking-[1.2px] uppercase leading-tight">Baitul Qowwam</div>
    </div>
  </Link>
);
