'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { getJadwalSholat, type SholatJadwal } from '@/infrastructure/api/sholatApi';

interface SholatStore {
  jadwal: SholatJadwal | null;
  lokasi: string;
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
  fetching: Promise<void> | null;
  fetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const STORAGE_KEY = 'bq_sholat_cache_v1';

interface CachedShape {
  jadwal: SholatJadwal;
  lokasi: string;
  fetchedAt: number;
  dateKey: string;
  coords?: { lat: number; lng: number };
}

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const readCache = (): CachedShape | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedShape;
    if (parsed.dateKey !== todayKey()) return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (data: CachedShape) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

async function loadByLocation(): Promise<{ jadwal: SholatJadwal; lokasi: string; coords?: { lat: number; lng: number } }> {
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, maximumAge: 5 * 60 * 1000 });
  });

  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`);
  const geoData = await geoRes.json();
  const searchKeyword = geoData.city || geoData.locality || geoData.principalSubdivision || 'Jakarta';

  const kotaRes = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(searchKeyword)}`);
  const kotaData = await kotaRes.json();

  let kotaId = '1301';
  let displayCity = 'Jakarta';
  if (kotaData.status && kotaData.data.length > 0) {
    kotaId = kotaData.data[0].id;
    displayCity = kotaData.data[0].lokasi;
  }

  const response = await getJadwalSholat(kotaId);
  return { jadwal: response.data.jadwal, lokasi: displayCity, coords: { lat, lng } };
}

export const useSholatStore = create<SholatStore>((set, get) => ({
  jadwal: null,
  lokasi: 'Jakarta',
  loading: true,
  error: null,
  fetchedAt: null,
  fetching: null,

  fetch: async () => {
    const state = get();
    if (state.fetching) return state.fetching;
    if (state.jadwal && state.fetchedAt && Date.now() - state.fetchedAt < CACHE_TTL_MS) return;

    const cached = readCache();
    if (cached) {
      set({ jadwal: cached.jadwal, lokasi: cached.lokasi, fetchedAt: cached.fetchedAt, loading: false, error: null });
      return;
    }

    const promise = (async () => {
      try {
        set({ loading: true, error: null });
        const { jadwal, lokasi, coords } = await loadByLocation();
        const fetchedAt = Date.now();
        set({ jadwal, lokasi, loading: false, error: null, fetchedAt, fetching: null });
        writeCache({ jadwal, lokasi, fetchedAt, dateKey: todayKey(), coords });
      } catch (err) {
        console.warn('Sholat fetch fallback:', err);
        try {
          const fallback = await getJadwalSholat('1301');
          const fetchedAt = Date.now();
          set({ jadwal: fallback.data.jadwal, lokasi: 'Jakarta', loading: false, error: 'Lokasi tidak tersedia', fetchedAt, fetching: null });
          writeCache({ jadwal: fallback.data.jadwal, lokasi: 'Jakarta', fetchedAt, dateKey: todayKey() });
        } catch {
          set({ loading: false, error: 'Gagal memuat jadwal', fetching: null });
        }
      }
    })();

    set({ fetching: promise });
    return promise;
  },

  refresh: async () => {
    set({ jadwal: null, fetchedAt: null });
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    return get().fetch();
  },
}));

export function useSholat() {
  const jadwal = useSholatStore(s => s.jadwal);
  const lokasi = useSholatStore(s => s.lokasi);
  const loading = useSholatStore(s => s.loading);
  const error = useSholatStore(s => s.error);
  const refresh = useSholatStore(s => s.refresh);

  useEffect(() => {
    useSholatStore.getState().fetch();
  }, []);

  const getNextPrayer = () => {
    if (!jadwal) return null;
    const times = [
      { name: 'Subuh', time: jadwal.subuh },
      { name: 'Dzuhur', time: jadwal.dzuhur },
      { name: 'Ashar', time: jadwal.ashar },
      { name: 'Maghrib', time: jadwal.maghrib },
      { name: 'Isya', time: jadwal.isya },
    ];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const t of times) {
      const [h, m] = t.time.split(':').map(Number);
      if (h * 60 + m > currentMinutes) return t;
    }
    return times[0];
  };

  return { jadwal, lokasi, loading, error, nextPrayer: getNextPrayer(), refresh };
}
