'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
          background: '#FBF8F2',
          color: '#3a2410',
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: '100%',
            textAlign: 'center',
            padding: '32px 28px',
            background: '#fff',
            border: '1px solid #E8DFCF',
            borderRadius: 24,
            boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              margin: '0 auto 18px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #C9A24E, #A8842E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: '#fff',
              fontWeight: 800,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: 22, margin: '0 0 8px', fontWeight: 700 }}>
            Aplikasi mengalami kendala
          </h1>
          <p style={{ fontSize: 14, color: '#6F5A3F', margin: '0 0 22px', lineHeight: 1.55 }}>
            Maaf, terjadi kesalahan tak terduga. Coba muat ulang halaman. Jika berlanjut, hubungi pengelola.
          </p>
          {error.digest && (
            <div
              style={{
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#A0937D',
                background: '#F5F0E6',
                padding: '6px 10px',
                borderRadius: 8,
                marginBottom: 18,
                wordBreak: 'break-all',
              }}
            >
              ID: {error.digest}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                background: '#6c5236',
                color: '#fff',
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Coba Lagi
            </button>
            <a
              href="/"
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                background: '#F5F0E6',
                color: '#3a2410',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Beranda
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
