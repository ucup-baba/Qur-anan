'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import { usePreferences } from '@/presentation/hooks/usePreferences';

type Permission = 'default' | 'granted' | 'denied' | 'unsupported';

export default function NotifikasiPage() {
  const { prefs, update, hydrated } = usePreferences();
  const [perm, setPerm] = useState<Permission>('default');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      setPerm('unsupported');
      return;
    }
    setPerm(Notification.permission as Permission);
  }, []);

  const requestPerm = async () => {
    if (!('Notification' in window)) return;
    const p = await Notification.requestPermission();
    setPerm(p as Permission);
  };

  if (!hydrated) {
    return <div className="min-h-screen pt-20 pb-24 px-6 text-center text-sm text-[var(--bq-paper-400)]">Memuat...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-4 md:px-6">
      <div className="max-w-[600px] mx-auto">
        <BackLink />

        <h1 className="text-2xl font-bold text-[var(--bq-paper-800)] mb-1">Notifikasi</h1>
        <p className="text-sm text-[var(--bq-paper-500)] mb-6">
          Atur pengingat waktu sholat dan ayat harian.
        </p>

        {/* Permission Card */}
        <PermissionCard perm={perm} onRequest={requestPerm} />

        {/* Sholat */}
        <Section title="Pengingat Waktu Sholat">
          <ToggleRow
            label="Subuh"
            value={prefs.notifSubuh}
            onChange={(v) => update('notifSubuh', v)}
            disabled={perm !== 'granted'}
          />
          <ToggleRow
            label="Dzuhur"
            value={prefs.notifDzuhur}
            onChange={(v) => update('notifDzuhur', v)}
            disabled={perm !== 'granted'}
          />
          <ToggleRow
            label="Ashar"
            value={prefs.notifAshar}
            onChange={(v) => update('notifAshar', v)}
            disabled={perm !== 'granted'}
          />
          <ToggleRow
            label="Maghrib"
            value={prefs.notifMaghrib}
            onChange={(v) => update('notifMaghrib', v)}
            disabled={perm !== 'granted'}
          />
          <ToggleRow
            label="Isya"
            value={prefs.notifIsya}
            onChange={(v) => update('notifIsya', v)}
            disabled={perm !== 'granted'}
          />
        </Section>

        {/* Ayat harian */}
        <Section title="Konten Harian">
          <ToggleRow
            label="Ayat Harian"
            desc="Notifikasi ayat pilihan setiap pagi"
            value={prefs.notifAyatHarian}
            onChange={(v) => update('notifAyatHarian', v)}
            disabled={perm !== 'granted'}
          />
        </Section>
      </div>
    </div>
  );
}

function PermissionCard({ perm, onRequest }: { perm: Permission; onRequest: () => void }) {
  if (perm === 'unsupported') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-xs text-yellow-800">
        Browser ini tidak mendukung notifikasi.
      </div>
    );
  }

  if (perm === 'granted') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 flex items-center gap-3">
        <Icon d={Icons.Check} size={18} className="text-green-600" />
        <div className="text-xs text-green-800">Notifikasi sudah diizinkan.</div>
      </div>
    );
  }

  if (perm === 'denied') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100">
        <div className="text-sm font-semibold text-red-800 mb-1">Notifikasi diblokir</div>
        <p className="text-xs text-red-700 leading-relaxed">
          Aktifkan izin notifikasi dari pengaturan browser untuk menerima pengingat.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-5 rounded-2xl bg-[var(--bq-gold-50)] border border-[var(--bq-gold-200)]">
      <div className="text-sm font-bold text-[var(--bq-paper-800)] mb-1">
        Aktifkan Notifikasi
      </div>
      <p className="text-xs text-[var(--bq-paper-600)] mb-3 leading-relaxed">
        Izinkan notifikasi untuk menerima pengingat waktu sholat.
      </p>
      <Button variant="primary" size="sm" onClick={onRequest}>
        Izinkan Notifikasi
      </Button>
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
  disabled,
}: {
  label: string;
  desc?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3 ${disabled ? 'opacity-50' : ''}`}>
      <div>
        <div className="text-sm font-semibold">{label}</div>
        {desc && <div className="text-xs text-[var(--bq-paper-500)]">{desc}</div>}
      </div>
      <button
        onClick={() => !disabled && onChange(!value)}
        role="switch"
        aria-checked={value}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-[var(--bq-brown-500)]' : 'bg-[var(--bq-paper-200)]'
        } ${disabled ? 'cursor-not-allowed' : ''}`}
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
    <Link
      href="/profile"
      className="inline-flex items-center gap-1 text-xs text-[var(--bq-paper-500)] hover:text-[var(--bq-brown-500)] mb-4"
    >
      <Icon d={Icons.ChevronLeft} size={14} />
      Profil
    </Link>
  );
}
