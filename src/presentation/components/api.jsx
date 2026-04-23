// API layer — equran.id (ID) + api.alquran.cloud (EN) + api.aladhan.com (prayer)
// Simple cache in sessionStorage to avoid refetching

const cache = new Map();

async function fetchJson(url, cacheKey) {
  if (cacheKey && cache.has(cacheKey)) return cache.get(cacheKey);
  if (cacheKey) {
    const stored = sessionStorage.getItem('bq:' + cacheKey);
    if (stored) {
      try { const v = JSON.parse(stored); cache.set(cacheKey, v); return v; } catch {}
    }
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch failed ' + res.status);
  const json = await res.json();
  if (cacheKey) {
    cache.set(cacheKey, json);
    try { sessionStorage.setItem('bq:' + cacheKey, JSON.stringify(json)); } catch {}
  }
  return json;
}

const API = {
  // Daftar 114 surah (Indonesia)
  async listSurahs() {
    const j = await fetchJson('https://equran.id/api/v2/surat', 'surah-list');
    return j.data; // [{ nomor, nama, namaLatin, jumlahAyat, tempatTurun, arti, deskripsi, audioFull }]
  },
  // Detail surah + ayat (Indonesia)
  async getSurah(nomor) {
    const j = await fetchJson(`https://equran.id/api/v2/surat/${nomor}`, `surah-${nomor}`);
    return j.data; // { nomor, nama, namaLatin, jumlahAyat, ayat: [...], suratSelanjutnya, suratSebelumnya }
  },
  // Tafsir (Indonesia, Kemenag)
  async getTafsir(nomor) {
    const j = await fetchJson(`https://equran.id/api/v2/tafsir/${nomor}`, `tafsir-${nomor}`);
    return j.data;
  },
  // English translation (Sahih International) via alquran.cloud
  async getSurahEnglish(nomor) {
    const j = await fetchJson(`https://api.alquran.cloud/v1/surah/${nomor}/en.sahih`, `surah-en-${nomor}`);
    return j.data;
  },
  // Prayer times — Aladhan API
  async getPrayerTimes(lat, lng) {
    const d = new Date();
    const dateStr = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    const j = await fetchJson(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=20`, `prayer-${lat}-${lng}-${dateStr}`);
    return j.data.timings;
  },
};

// ─── Local storage helpers ─────────────────────────────
const Storage = {
  getLastRead() {
    try { return JSON.parse(localStorage.getItem('bq:lastRead') || 'null'); } catch { return null; }
  },
  setLastRead(data) {
    localStorage.setItem('bq:lastRead', JSON.stringify(data));
  },
  getBookmarks() {
    try { return JSON.parse(localStorage.getItem('bq:bookmarks') || '[]'); } catch { return []; }
  },
  toggleBookmark(key, meta) {
    const list = Storage.getBookmarks();
    const idx = list.findIndex(b => b.key === key);
    if (idx >= 0) list.splice(idx, 1);
    else list.push({ key, ...meta, at: Date.now() });
    localStorage.setItem('bq:bookmarks', JSON.stringify(list));
    return idx < 0;
  },
  isBookmarked(key) {
    return Storage.getBookmarks().some(b => b.key === key);
  },
};

// ─── Tiny router (hash-based) ─────────────────────────
function useRoute() {
  const [route, setRoute] = React.useState(() => window.location.hash.slice(1) || '/');
  React.useEffect(() => {
    const handler = () => setRoute(window.location.hash.slice(1) || '/');
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return route;
}

function navigate(path) {
  window.location.hash = path;
}

Object.assign(window, { API, Storage, useRoute, navigate });
