import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const Logo: React.FC = () => (
  <Link href="/" className="flex items-center gap-3 no-underline">
    <div className="relative w-10 h-10 overflow-hidden rounded-lg">
      <Image 
        src="/logo.png" 
        alt="Logo Qur'anan" 
        fill 
        className="object-cover"
        priority
      />
    </div>
    <div className="hidden sm:block">
      <div className="text-[15px] font-bold text-[var(--bq-paper-800)] leading-tight tracking-tight">Qur&apos;anan</div>
      <div className="text-[9px] text-[var(--bq-paper-500)] tracking-[1.2px] uppercase leading-tight">Baitul Qowwam</div>
    </div>
  </Link>
);
