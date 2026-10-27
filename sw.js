// ─────────────────────────────────────────────
// TempMail — Service Worker (Phase 3)
// Network-first for all same-origin GETs, cached app shell as offline fallback.
// ─────────────────────────────────────────────

const CACHE = 'tempmail-v5-2';

const APP_SHELL = [
    './',
    './index.html',
    './css/style.css',
    './js/api.js',
    './js/config.js',
    './js/theme.js',
    './js/guard.js',
    './js/watchdog.js',
    './images/temp-mail-icon.png',
    './images/app-icon.svg',
    './manifest.json'
];

// ══════════════════════════════════════════════
// Install — precache the app shell
// ══════════════════════════════════════════════
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))))
            .then(() => self.skipWaiting())
    );
});

// ══════════════════════════════════════════════
// Activate — drop stale caches and take control
// ══════════════════════════════════════════════
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// ══════════════════════════════════════════════
// Fetch — network-first for same-origin GET only
// ══════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok && response.type === 'basic') {
                    const copy = response.clone();
                    caches.open(CACHE).then((cache) => cache.put(request, copy));
                }
                return response;
            })
            .catch(async () => {
                const cached = await caches.match(request);
                if (cached) return cached;

                if (request.mode === 'navigate') {
                    const fallback = await caches.match('./index.html');
                    if (fallback) return fallback;
                }

                return Response.error();
            })
    );
});
