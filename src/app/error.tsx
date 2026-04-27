'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/presentation/components/ui/Button';
import { Icon, Icons } from '@/presentation/components/icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[RouteError]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center p-8 max-w-md bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-2xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--bq-gold-300)] to-[var(--bq-brown-500)] flex items-center justify-center text-white">
          <Icon d={Icons.AlertCircle} size={26} />
        </div>
        <h2 className="bq-serif text-2xl text-[var(--bq-paper-800)] mb-3">Terjadi Kesalahan</h2>
        <p className="text-[var(--bq-paper-500)] mb-6 text-sm leading-relaxed">
          Maaf, terjadi kesalahan tak terduga pada bagian ini. Silakan coba lagi atau kembali ke beranda.
        </p>
        {error.digest && (
          <div className="text-[10px] font-mono text-[var(--bq-paper-400)] bg-[var(--bq-paper-100)] px-2.5 py-1.5 rounded-lg mb-5 break-all">
            ID: {error.digest}
          </div>
        )}
        <div className="flex gap-2 justify-center">
          <Button variant="primary" onClick={() => reset()}>
            Coba Lagi
          </Button>
          <Link href="/" className="no-underline">
            <Button variant="secondary">Beranda</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
