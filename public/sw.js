/* Qur-anan service worker — offline-first + FCM */

// ── FCM Background Messaging ──
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDb25hksl_CYu-34bFK6xduDnVuS9kXOMA",
  authDomain: "quranan-qu.firebaseapp.com",
  projectId: "quranan-qu",
  storageBucket: "quranan-qu.firebasestorage.app",
  messagingSenderId: "679597523622",
  appId: "1:679597523622:web:ff746071a704501355aa67",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { prayerName = '', mode = 'hening', time = '' } = payload.data ?? {};
  const options = {
    body: `${time} WIB — Mari menunaikan sholat`,
    icon: '/logo.png',
    badge: '/logo.png',
    tag: `sholat-${prayerName}`,
    silent: mode === 'hening',
    data: {
      openUrl: mode === 'adzan'
        ? `/sholat?adzan=1&prayer=${encodeURIComponent(prayerName)}`
        : '/sholat',
    },
  };
  if (mode === 'getar') options.vibrate = [500, 100, 500, 100, 500];
  return self.registration.showNotification(`🕌 Waktu ${prayerName}`, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.openUrl ?? '/sholat';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url.includes('/sholat') && 'focus' in w) {
          w.navigate(url);
          return w.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// ── Offline-first runtime cache ──
const VERSION = 'qu-v2';
const STATIC_CACHE = `${VERSION}-static`;
const API_CACHE = `${VERSION}-api`;
const AUDIO_CACHE = `${VERSION}-audio`;
const PAGE_CACHE = `${VERSION}-pages`;

const PRECACHE_URLS = [
  '/',
  '/quran',
  '/sholat',
  '/doa',
  '/asmaul-husna',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(cacheName, req) {
  return fetch(req)
    .then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(cacheName).then((c) => c.put(req, copy));
      }
      return res;
    })
    .catch(() => caches.match(req));
}

function cacheFirst(cacheName, req) {
  return caches.match(req).then((cached) => {
    if (cached) return cached;
    return fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(cacheName).then((c) => c.put(req, copy));
      }
      return res;
    });
  });
}

function staleWhileRevalidate(cacheName, req) {
  return caches.match(req).then((cached) => {
    const net = fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(cacheName).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => cached);
    return cached || net;
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  // Skip cross-origin non-cacheable
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  // Navigation — network-first with fallback to cached page or root
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGE_CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('/') || new Response('Offline', { status: 503 }))
        )
    );
    return;
  }

  // Qur'an API → network-first (keeps fresh when online, serves cache offline)
  if (url.hostname === 'equran.id') {
    event.respondWith(networkFirst(API_CACHE, req));
    return;
  }

  // Audio (mp3 from any CDN) → cache-first
  if (url.pathname.endsWith('.mp3') || url.pathname.includes('/audio/')) {
    event.respondWith(cacheFirst(AUDIO_CACHE, req));
    return;
  }

  // Next.js build assets & static files → stale-while-revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/') || /\.(js|css|woff2?|ttf|svg|png|jpg|jpeg|webp|ico|gif)$/i.test(url.pathname))
  ) {
    event.respondWith(staleWhileRevalidate(STATIC_CACHE, req));
    return;
  }

  // Sholat API (myquran) → network-first, fall back to cache for offline
  if (url.hostname.includes('myquran.com') || url.hostname.includes('bigdatacloud.net')) {
    event.respondWith(networkFirst(API_CACHE, req));
    return;
  }
});

// Messages from app — bulk precache for "download all surahs"
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'PRECACHE_URLS') {
    const urls = Array.isArray(data.urls) ? data.urls : [];
    const cacheName = data.cacheName === 'audio' ? AUDIO_CACHE : API_CACHE;
    const total = urls.length;
    let done = 0;
    event.waitUntil(
      caches.open(cacheName).then(async (cache) => {
        for (const u of urls) {
          try {
            const existing = await cache.match(u);
            if (!existing) {
              const res = await fetch(u);
              if (res.ok) await cache.put(u, res.clone());
            }
          } catch {
            // continue on individual failure
          }
          done++;
          if (event.source) {
            event.source.postMessage({ type: 'PRECACHE_PROGRESS', done, total, cacheName: data.cacheName });
          }
        }
        if (event.source) {
          event.source.postMessage({ type: 'PRECACHE_DONE', total, cacheName: data.cacheName });
        }
      })
    );
  }

  if (data.type === 'CLEAR_OFFLINE_CACHE') {
    event.waitUntil(
      Promise.all([caches.delete(API_CACHE), caches.delete(AUDIO_CACHE)]).then(() => {
        if (event.source) event.source.postMessage({ type: 'CACHE_CLEARED' });
      })
    );
  }
});
