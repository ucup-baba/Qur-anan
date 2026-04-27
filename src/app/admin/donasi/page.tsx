'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import { Card } from '@/presentation/components/ui/Card';
import {
  uploadDonationPoster,
  createDonationCampaign,
  getDonationCampaigns,
  deleteDonationCampaign,
  updateDonationCampaign,
  type DonationCampaign,
} from '@/infrastructure/firebase/donations';
import { useToast } from '@/presentation/components/ui/Toast';

const DESC_LIMIT = 150;

export default function AdminDonasiPage() {
  const toast = useToast();
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDonationCampaigns();
      setCampaigns(data);
    } catch (e) {
      console.error('Failed to load campaigns', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    if (!posterFile) { setPosterPreview(null); return; }
    const url = URL.createObjectURL(posterFile);
    setPosterPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [posterFile]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !posterFile) {
      toast.show('Mohon lengkapi judul, deskripsi, dan poster.', 'error');
      return;
    }

    setSaving(true);
    try {
      const posterUrl = await uploadDonationPoster(posterFile);
      await createDonationCampaign({
        title: title.trim(),
        description: description.trim(),
        posterUrl,
      });
      setSuccessMsg('Kampanye donasi berhasil dipublikasikan!');
      setTitle('');
      setDescription('');
      setPosterFile(null);
      await loadCampaigns();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      console.error('Failed to save campaign', e);
      toast.show('Gagal menyimpan kampanye.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, posterUrl: string) => {
    if (!confirm('Hapus kampanye donasi ini?')) return;
    try {
      await deleteDonationCampaign(id, posterUrl);
      await loadCampaigns();
    } catch (e) {
      console.error('Failed to delete campaign', e);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateDonationCampaign(id, { isActive: !currentStatus });
      await loadCampaigns();
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[var(--bq-brown-400)] text-[var(--bq-gold-200)] flex items-center justify-center shadow-lg">
          <Icon d={Icons.Heart} size={22} />
        </div>
        <div>
          <h1 className="bq-serif text-2xl font-bold text-[var(--bq-paper-800)] m-0">
            Kelola Kampanye Donasi
          </h1>
          <p className="text-sm text-[var(--bq-paper-500)] m-0">
            Buat poster donasi untuk program Yayasan
          </p>
        </div>
      </div>

      {/* Success Msg */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-[var(--bq-success)] flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Icon d={Icons.Check} size={18} />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Section */}
        <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-6 shadow-[var(--bq-shadow-sm)] space-y-5">
          <div>
            <label className="block text-sm font-bold text-[var(--bq-paper-700)] mb-1.5">
              Judul Kampanye
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pembebasan Lahan Masjid"
              className="w-full px-4 py-3 bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-xl outline-none focus:border-[var(--bq-gold-400)] transition-colors text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-sm font-bold text-[var(--bq-paper-700)]">
                Deskripsi Singkat
              </label>
              <span className={`text-[10px] font-bold ${description.length > DESC_LIMIT ? 'text-red-500' : 'text-gray-400'}`}>
                {description.length}/{DESC_LIMIT}
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_LIMIT + 20))}
              placeholder="Jelaskan singkat mengenai program donasi ini..."
              rows={3}
              className="w-full px-4 py-3 bg-[var(--bq-paper-50)] border border-[var(--bq-paper-200)] rounded-xl outline-none focus:border-[var(--bq-gold-400)] transition-colors text-sm resize-none"
            />
            {description.length > DESC_LIMIT && (
              <p className="text-[10px] text-red-500 mt-1">Melebihi batas karakter disarankan!</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--bq-paper-700)] mb-1.5">
              Poster Donasi
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[4/3] border-2 border-dashed border-[var(--bq-paper-200)] rounded-xl bg-[var(--bq-paper-50)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--bq-gold-400)] transition-all overflow-hidden relative"
            >
              {posterPreview ? (
                <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Icon d={Icons.ImageIcon} size={32} className="text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-medium">Klik untuk upload poster</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
            />
          </div>

          <Button
            variant="primary"
            className="w-full py-4 shadow-lg shadow-[var(--bq-brown-200)]"
            disabled={saving}
            onClick={handleSave}
            icon={Icons.Plus}
          >
            {saving ? 'Menyimpan...' : 'Publikasikan Kampanye'}
          </Button>
        </div>

        {/* Preview Card Section */}
        <div className="space-y-4 sticky top-24">
          <h3 className="text-sm font-bold text-[var(--bq-paper-500)] uppercase tracking-widest px-1">
            Live Preview
          </h3>
          <div className="max-w-[340px]">
            <Card className="overflow-hidden border-[var(--bq-paper-200)] shadow-xl rotate-1">
              <div className="aspect-[4/5] bg-gray-100 relative">
                {posterPreview ? (
                  <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Icon d={Icons.ImageIcon} size={48} />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg shadow-sm">
                  <div className="text-[10px] font-bold text-[var(--bq-brown-600)] flex items-center gap-1">
                    <Icon d={Icons.Heart} size={10} /> PROGRAM AKTIF
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <h4 className="bq-serif text-lg font-bold text-[var(--bq-paper-800)] mb-1 leading-tight">
                  {title || 'Judul Program Donasi'}
                </h4>
                <p className="text-xs text-[var(--bq-paper-500)] line-clamp-3 leading-relaxed">
                  {description || 'Deskripsi kampanye donasi akan muncul di sini...'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <Button variant="secondary" size="sm" className="w-full text-[10px] font-bold">
                    INFAQ SEKARANG
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* List Existing Campaigns */}
      <div className="pt-10 border-t border-[var(--bq-paper-200)]">
        <h2 className="bq-serif text-xl font-bold text-[var(--bq-paper-800)] mb-6">
          Daftar Kampanye ({campaigns.length})
        </h2>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin w-8 h-8 rounded-full border-4 border-[var(--bq-paper-100)] border-t-[var(--bq-brown-400)]" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bq-paper-50)] rounded-3xl border-2 border-dashed border-[var(--bq-paper-200)]">
            <Icon d={Icons.Heart} size={48} className="text-gray-300 mb-3 mx-auto" />
            <p className="text-gray-500 font-medium">Belum ada kampanye donasi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <div key={c.id} className="bg-white border border-[var(--bq-paper-200)] rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img src={c.posterUrl} alt={c.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleToggleActive(c.id, c.isActive)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                        c.isActive ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                      }`}
                      title={c.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    >
                      <Icon d={c.isActive ? Icons.Check : Icons.X} size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.posterUrl)}
                      className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600"
                    >
                      <Icon d={Icons.Trash2} size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      c.isActive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                    }`}>
                      {c.isActive ? 'AKTIF' : 'NONAKTIF'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--bq-paper-800)] line-clamp-1 mb-1">{c.title}</h3>
                  <p className="text-[11px] text-[var(--bq-paper-500)] line-clamp-2 leading-relaxed flex-1">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
