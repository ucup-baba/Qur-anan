'use client';

import React from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { usePreferences, type Preferences } from '@/presentation/hooks/usePreferences';
import { useOfflineSurah } from '@/presentation/hooks/useOfflineSurah';
import { useSync } from '@/presentation/components/providers/SyncProvider';
import { useAuth } from '@/presentation/hooks/useAuth';
import { Breadcrumb } from '@/presentation/components/ui/Breadcrumb';

export default function SettingsPage() {
  const { prefs, update, reset, hydrated } = usePreferences();
  const {
    apiProgress,
    audioProgress,
    apiDone,
    audioDone,
    downloadAllSurahMeta,
    downloadAllAudio,
    clearOfflineCache,
  } = useOfflineSurah();
  const { user } = useAuth();
  const { syncing, lastSyncedAt, error: syncError, syncNow } = useSync();

  if (!hydrated) {
    return <div className="min-h-screen pt-20 pb-24 px-6 text-center text-sm text-[var(--bq-paper-400)]">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-4 md:px-6">
      <div className="max-w-[600px] mx-auto">
        <BackLink />

        <h1 className="text-2xl font-bold text-[var(--bq-paper-800)] mb-1">Pengaturan</h1>
        <p className="text-sm text-[var(--bq-paper-500)] mb-6">
          Sesuaikan preferensi bacaan & tampilan.
        </p>

        {/* Arabic Size */}
        <Section title="Tampilan Qur'an">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-semibold">Ukuran Huruf Arab</div>
              <div className="text-xs text-[var(--bq-paper-500)]">Untuk halaman baca surah</div>
            </div>
            <div className="flex gap-1 bg-[var(--bq-paper-100)] rounded-lg p-1">
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update('arabicSize', s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    prefs.arabicSize === s
                      ? 'bg-[var(--bq-brown-500)] text-white'
                      : 'text-[var(--bq-paper-600)]'
                  }`}
                >
                  {s === 'sm' ? 'Kecil' : s === 'md' ? 'Sedang' : 'Besar'}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            label="Tampilkan Latin"
            desc="Transliterasi di bawah teks Arab"
            value={prefs.showTransliteration}
            onChange={(v) => update('showTransliteration', v)}
          />

          <ToggleRow
            label="Mode Tajwid Berwarna"
            desc="Warnai hukum bacaan (ghunnah, ikhfa, qalqalah, dst.)"
            value={prefs.tajwidMode}
            onChange={(v) => update('tajwidMode', v)}
          />
        </Section>

        <Section title="Offline">
          <div className="py-3">
            <div className="text-sm font-semibold">Unduh Semua Surah</div>
            <div className="text-xs text-[var(--bq-paper-500)] mb-3">Simpan 114 surah + terjemah untuk dibaca tanpa internet.</div>
            <button
              onClick={downloadAllSurahMeta}
              disabled={!!apiProgress && !apiDone}
              className="w-full py-2.5 rounded-lg bg-[var(--bq-brown-500)] text-white text-xs font-semibold disabled:opacity-60"
            >
              {apiProgress && !apiDone
                ? `Mengunduh ${apiProgress.done}/${apiProgress.total}…`
                : apiDone
                ? `Tersimpan (${apiProgress?.total ?? 115} file) — ulangi?`
                : 'Unduh Teks Qur\'an'}
            </button>
          </div>

          <div className="py-3">
            <div className="text-sm font-semibold">Unduh Audio Murottal</div>
            <div className="text-xs text-[var(--bq-paper-500)] mb-3">~114 file (Al-Afasi, full surah). Butuh ruang penyimpanan besar.</div>
            <button
              onClick={() => downloadAllAudio('05')}
              disabled={!!audioProgress && !audioDone}
              className="w-full py-2.5 rounded-lg bg-[var(--bq-gold-500)] text-white text-xs font-semibold disabled:opacity-60"
            >
              {audioProgress && !audioDone
                ? `Mengunduh ${audioProgress.done}/${audioProgress.total}…`
                : audioDone
                ? `Audio tersimpan (${audioProgress?.total ?? 114}) — ulangi?`
                : 'Unduh Audio Al-Afasi'}
            </button>
          </div>

          <div className="py-3">
            <button
              onClick={() => {
                if (window.confirm('Hapus semua data offline (teks & audio)?')) clearOfflineCache();
              }}
              className="text-xs text-red-500 font-semibold hover:underline"
            >
              Hapus data offline
            </button>
          </div>
        </Section>

        <Section title="Tema">
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-semibold">Mode Tampilan</div>
              <div className="text-xs text-[var(--bq-paper-500)]">Light atau ikuti sistem</div>
            </div>
            <div className="flex gap-1 bg-[var(--bq-paper-100)] rounded-lg p-1">
              {(['light', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => update('theme', t)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                    prefs.theme === t
                      ? 'bg-[var(--bq-brown-500)] text-white'
                      : 'text-[var(--bq-paper-600)]'
                  }`}
                >
                  {t === 'light' ? 'Terang' : 'Sistem'}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Bahasa">
          <div className="py-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold">Bahasa Aplikasi</div>
                <div className="text-xs text-[var(--bq-paper-500)]">Pilih bahasa antarmuka</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([
                { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
                { code: 'ms', label: 'Melayu', flag: '🇲🇾' },
                { code: 'en', label: 'English', flag: '🇬🇧' },
              ] as const).map(({ code, label, flag }) => {
                const active = prefs.locale === code;
                const disabled = code !== 'id';
                return (
                  <button
                    key={code}
                    onClick={() => !disabled && update('locale', code)}
                    disabled={disabled}
                    className={`relative flex flex-col items-center gap-1 px-3 py-3 rounded-xl border text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[var(--bq-brown-500)] text-white border-[var(--bq-brown-500)]'
                        : disabled
                          ? 'bg-[var(--bq-paper-100)] text-[var(--bq-paper-400)] border-[var(--bq-paper-200)] cursor-not-allowed'
                          : 'bg-white text-[var(--bq-paper-700)] border-[var(--bq-paper-200)] hover:border-[var(--bq-brown-300)]'
                    }`}
                  >
                    <span className="text-lg leading-none">{flag}</span>
                    <span>{label}</span>
                    {disabled && (
                      <span className="absolute top-1 right-1 text-[8px] uppercase tracking-wide bg-[var(--bq-paper-300)] text-white px-1 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-[var(--bq-paper-500)] mt-3 leading-relaxed">
              Bahasa lain akan tersedia segera. Saat ini hanya Bahasa Indonesia yang aktif.
            </div>
          </div>
        </Section>

        <Section title="Sinkronisasi">
          <div className="py-3">
            {user ? (
              <>
                <div className="text-sm font-semibold">Akun: {user.email}</div>
                <div className="text-xs text-[var(--bq-paper-500)] mb-3">
                  Last-read, surah pilihan, ayat pilihan & pengaturan tersinkron otomatis.
                  {lastSyncedAt && (
                    <> Terakhir: {new Date(lastSyncedAt).toLocaleTimeString('id-ID')}.</>
                  )}
                  {syncError && <span className="text-red-500"> · {syncError}</span>}
                </div>
                <button
                  onClick={syncNow}
                  disabled={syncing}
                  className="w-full py-2.5 rounded-lg bg-[var(--bq-brown-500)] text-white text-xs font-semibold disabled:opacity-60"
                >
                  {syncing ? 'Menyinkronkan…' : 'Sinkronkan Sekarang'}
                </button>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold">Belum masuk</div>
                <div className="text-xs text-[var(--bq-paper-500)] mb-3">Masuk untuk mensinkronkan data antar-perangkat.</div>
                <Link href="/login" className="block w-full text-center py-2.5 rounded-lg bg-[var(--bq-brown-500)] text-white text-xs font-semibold no-underline">
                  Masuk dengan Google
                </Link>
              </>
            )}
          </div>
        </Section>

        <div className="mt-8">
          <button
            onClick={() => {
              if (window.confirm('Reset semua preferensi ke default?')) reset();
            }}
            className="w-full py-3 rounded-xl border border-red-100 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
          >
            Reset ke Default
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="text-[11px] uppercase tracking-wider font-bold text-[var(--bq-paper-500)] mb-2 px-1">
        {title}
      </div>
      <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl divide-y divide-[var(--bq-paper-100)] px-5">
        {children}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  value,
  onChange,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {desc && <div className="text-xs text-[var(--bq-paper-500)]">{desc}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-[var(--bq-brown-500)]' : 'bg-[var(--bq-paper-200)]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}

function BackLink() {
  return (
    <Breadcrumb
      className="mb-4"
      items={[
        { label: 'Beranda', href: '/' },
        { label: 'Profil', href: '/profile' },
        { label: 'Pengaturan' },
      ]}
    />
  );
}
