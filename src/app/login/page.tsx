'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/presentation/hooks/useAuth';

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ADMIN_EMAIL = 'baitulqowwam123@gmail.com';
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (!loading && user) {
      if (user.email === ADMIN_EMAIL) {
        router.replace('/admin/berita');
      } else {
        router.replace(redirect);
      }
    }
  }, [user, loading, router, redirect]);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSigningIn(true);
    const u = await signInWithGoogle();
    if (!u) setError('Gagal masuk dengan Google. Silakan coba lagi.');
    setSigningIn(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bq-paper-100)] via-[var(--bq-paper-50)] to-[var(--bq-gold-50)] px-6 py-20">
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-[var(--bq-paper-200)]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bq-brown-500)] text-[var(--bq-gold-200)] inline-flex items-center justify-center mb-4 shadow-lg">
            <span className="bq-arabic text-[32px] leading-none">ب</span>
          </div>
          <h1 className="bq-serif text-2xl md:text-3xl font-bold text-[var(--bq-paper-800)] text-center">
            Selamat Datang
          </h1>
          <p className="text-sm text-[var(--bq-paper-500)] text-center mt-2">
            Masuk untuk menyimpan favorit, sinkronisasi bacaan, dan fitur lainnya.
          </p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={signingIn || loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-[var(--bq-paper-200)] rounded-xl text-[var(--bq-paper-800)] font-semibold text-sm hover:bg-[var(--bq-paper-50)] hover:border-[var(--bq-paper-300)] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          <GoogleIcon />
          {signingIn ? 'Memproses...' : 'Masuk dengan Google'}
        </button>

        {error && (
          <div className="mt-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[var(--bq-paper-500)] hover:text-[var(--bq-brown-500)] transition-colors"
          >
            Lanjutkan tanpa masuk
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--bq-paper-100)] text-center">
          <p className="text-[11px] text-[var(--bq-paper-400)] leading-relaxed">
            Dengan masuk, Anda menyetujui kebijakan privasi & syarat layanan Qur'anan.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
