'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icon, Icons } from '@/presentation/components/icons';

interface KotaResult {
  id: string;
  lokasi: string;
}

interface CityPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (kota: KotaResult) => void;
}

export function CityPicker({ open, onClose, onSelect }: CityPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KotaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setError(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(query.trim())}`
        );
        const data = await res.json();
        if (data.status && Array.isArray(data.data)) {
          setResults(data.data as KotaResult[]);
        } else {
          setResults([]);
        }
      } catch {
        setError('Gagal memuat daftar kota.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--bq-paper-200)] px-4 py-3">
          <Icon d={Icons.Search} size={18} className="text-[var(--bq-paper-400)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari kota (contoh: Bandung, Surabaya)"
            className="flex-1 border-none outline-none bg-transparent text-sm placeholder:text-[var(--bq-paper-400)]"
          />
          <button
            onClick={onClose}
            className="text-[var(--bq-paper-400)] hover:text-[var(--bq-paper-700)]"
            aria-label="Tutup"
          >
            <Icon d={Icons.X} size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-5 py-4 text-xs text-[var(--bq-paper-500)]">Mencari...</div>
          )}
          {error && (
            <div className="px-5 py-4 text-xs text-red-500">{error}</div>
          )}
          {!loading && !error && query && results.length === 0 && (
            <div className="px-5 py-8 text-center text-xs text-[var(--bq-paper-400)]">
              Kota tidak ditemukan.
            </div>
          )}
          {!query && (
            <div className="px-5 py-8 text-center text-xs text-[var(--bq-paper-400)]">
              Ketik minimal 3 huruf untuk mencari kota.
            </div>
          )}
          {results.map((kota) => (
            <button
              key={kota.id}
              onClick={() => {
                onSelect(kota);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[var(--bq-paper-50)] transition-colors border-b border-[var(--bq-paper-100)] last:border-b-0"
            >
              <Icon d={Icons.MapPin} size={14} className="text-[var(--bq-paper-400)] shrink-0" />
              <span className="text-sm text-[var(--bq-paper-800)]">{kota.lokasi}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
