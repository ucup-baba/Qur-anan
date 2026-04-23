'use client';

import { useEffect } from 'react';
import { Button } from '@/presentation/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center p-8 max-w-md bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-2xl">
        <h2 className="bq-serif text-2xl text-[var(--bq-paper-800)] mb-3">Terjadi Kesalahan</h2>
        <p className="text-[var(--bq-paper-500)] mb-6 text-sm">
          Maaf, terjadi kesalahan tak terduga pada sistem kami. Silakan coba lagi.
        </p>
        <Button variant="primary" onClick={() => reset()}>
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
