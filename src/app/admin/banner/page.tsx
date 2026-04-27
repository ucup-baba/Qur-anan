'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon, Icons } from '@/presentation/components/icons';
import { Button } from '@/presentation/components/ui/Button';
import {
  uploadBannerImage,
  createBanner,
  getBanners,
  deleteBanner,
  type Banner,
} from '@/infrastructure/firebase/banners';
import { useToast } from '@/presentation/components/ui/Toast';

export default function AdminBannerPage() {
  const toast = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (e) {
      console.error('Failed to load banners', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (banners.length >= 7) {
      toast.show('Maksimal banner adalah 7 foto.', 'error');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadBannerImage(file);
      await createBanner(imageUrl);
      setSuccessMsg('Banner berhasil ditambahkan!');
      await loadBanners();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e) {
      console.error('Failed to upload banner', e);
      toast.show('Gagal mengunggah banner.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Hapus banner ini?')) return;
    try {
      await deleteBanner(id, imageUrl);
      await loadBanners();
    } catch (e) {
      console.error('Failed to delete banner', e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-[var(--bq-brown-400)] text-[var(--bq-gold-200)] flex items-center justify-center shadow-lg">
          <Icon d={Icons.ImageIcon} size={22} />
        </div>
        <div>
          <h1 className="bq-serif text-2xl font-bold text-[var(--bq-paper-800)] m-0">
            Kelola Banner Utama
          </h1>
          <p className="text-sm text-[var(--bq-paper-500)] m-0">
            Unggah hingga 7 foto untuk slider halaman utama
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

      {/* Upload Area */}
      <div className="bg-white border border-[var(--bq-paper-200)] rounded-2xl p-6 shadow-[var(--bq-shadow-sm)]">
        <div className="mb-4">
          <div className="text-sm font-bold text-[var(--bq-paper-700)] mb-1">
            Tambah Banner Baru
          </div>
          <div className="text-xs text-[var(--bq-paper-500)]">
            Disarankan ukuran 1200x600px atau rasio 2:1
          </div>
        </div>

        <div
          onClick={() => !uploading && banners.length < 7 && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            uploading || banners.length >= 7
              ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60'
              : 'bg-[var(--bq-paper-50)] border-[var(--bq-paper-200)] cursor-pointer hover:border-[var(--bq-gold-400)]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin w-8 h-8 rounded-full border-2 border-[var(--bq-paper-200)] border-t-[var(--bq-brown-400)]" />
              <p className="text-sm text-[var(--bq-paper-500)]">Sedang mengunggah...</p>
            </div>
          ) : banners.length >= 7 ? (
            <div className="flex flex-col items-center gap-1">
              <Icon d={Icons.X} size={32} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-400 font-medium">Kapasitas Penuh</p>
              <p className="text-xs text-gray-400">Hapus banner lama untuk menambah baru</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[var(--bq-brown-50)] text-[var(--bq-brown-400)] flex items-center justify-center mb-1">
                <Icon d={Icons.Plus} size={24} />
              </div>
              <p className="text-sm text-[var(--bq-paper-600)] font-medium">Klik untuk pilih gambar</p>
              <p className="text-xs text-[var(--bq-paper-400)]">Format JPG, PNG, atau WEBP</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading || banners.length >= 7}
        />
      </div>

      {/* Grid Banner */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="bq-serif text-xl font-bold text-[var(--bq-paper-800)] m-0">
            Daftar Banner ({banners.length}/7)
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((n) => (
              <div key={n} className="aspect-[2/1] bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Icon d={Icons.ImageIcon} size={40} className="text-gray-300 mb-2 mx-auto" />
            <p className="text-gray-400 text-sm">Belum ada banner yang diunggah</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="group relative bg-white border border-[var(--bq-paper-200)] rounded-xl overflow-hidden shadow-[var(--bq-shadow-sm)] transition-all hover:shadow-md">
                <div className="aspect-[2/1] overflow-hidden bg-gray-100">
                  <img
                    src={banner.imageUrl}
                    alt="Banner"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-2 translate-y-[-4px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleDelete(banner.id, banner.imageUrl)}
                    className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                    title="Hapus Banner"
                  >
                    <Icon d={Icons.Trash2} size={18} />
                  </button>
                </div>
                <div className="p-3 bg-white border-t border-gray-50">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Diupload pada
                  </div>
                  <div className="text-xs text-gray-600">
                    {banner.createdAt.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
