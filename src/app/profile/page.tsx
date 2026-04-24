'use client';

import React from 'react';
import { Icon, Icons } from '@/presentation/components/icons';
import { Card } from '@/presentation/components/ui/Card';
import { Button } from '@/presentation/components/ui/Button';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--bq-paper-100)] pt-20 pb-24 px-6">
      <div className="max-w-[600px] mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-[var(--bq-brown-500)] rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
            <Icon d={Icons.User} size={48} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--bq-paper-800)]">Profil Pengguna</h1>
          <p className="text-[var(--bq-paper-500)] text-sm">Assalamu'alaikum, Akhy/Ukhty</p>
        </div>

        <div className="space-y-4">
          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)] rounded-lg flex items-center justify-center">
              <Icon d={Icons.Settings} size={20} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Pengaturan</div>
              <div className="text-[10px] text-[var(--bq-paper-500)]">Kelola preferensi aplikasi</div>
            </div>
            <Icon d={Icons.ChevronRight} size={18} className="text-[var(--bq-paper-300)]" />
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[var(--bq-gold-50)] text-[var(--bq-gold-500)] rounded-lg flex items-center justify-center">
              <Icon d={Icons.Bell} size={20} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Notifikasi</div>
              <div className="text-[10px] text-[var(--bq-paper-500)]">Pengingat sholat & ayat</div>
            </div>
            <Icon d={Icons.ChevronRight} size={18} className="text-[var(--bq-paper-300)]" />
          </Card>

          <Card className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-[var(--bq-brown-50)] text-[var(--bq-brown-500)] rounded-lg flex items-center justify-center">
              <Icon d={Icons.Info} size={20} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Bantuan</div>
              <div className="text-[10px] text-[var(--bq-paper-500)]">Pusat bantuan & FAQ</div>
            </div>
            <Icon d={Icons.ChevronRight} size={18} className="text-[var(--bq-paper-300)]" />
          </Card>
        </div>

        <div className="mt-8">
          <Button variant="outline" className="w-full text-red-500 border-red-100 hover:bg-red-50">
            Keluar Akun
          </Button>
        </div>
      </div>
    </div>
  );
}
