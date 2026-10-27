# Phase 3 — Installable PWA

Read `.ai-specs/00-rules.md` first. This phase MAY edit `manifest.json` and add new files. The site is served from
GitHub Pages under a sub-path (`https://mehmetkahya0.github.io/temp-mail/`), so EVERY path must be relative
(`./…`), never root-absolute (`/…`).

## 3A. App icon
Create `images/app-icon.svg` (512×512 viewBox): a full-bleed square in `#07080A`, with a centred circle of diameter
~62% filled `#D4FF3F`, and inside it a bold "@" glyph drawn as SVG paths/text in `#0A0C03` (use
`font-family="Geist, Arial, sans-serif" font-weight="700"` if you use `<text>`). Keep all important content inside the
central 80% so it works as a maskable icon. (PNG renditions `images/icon-192.png` and `images/icon-512.png` will be
generated separately from this SVG — just reference them.)

## 3B. manifest.json (rewrite)
```
name: "TempMail — Disposable Email", short_name: "TempMail", id: "./", start_url: "./", scope: "./",
display: "standalone", background_color: "#07080A", theme_color: "#07080A",
description: "Instant disposable email addresses with live inbox.",
icons: icon-192.png (192x192, purpose "any"), icon-512.png (512x512, purpose "any"),
       icon-512.png (512x512, purpose "maskable"), app-icon.svg (sizes "any", type image/svg+xml)
shortcuts: [{ name: "New address", url: "./?action=new" }]
```
Remove `orientation`.

## 3C. Service worker `sw.js` (repo root, next to index.html)
- `const CACHE = 'tempmail-v5-1';` App shell list (relative): `./`, `./index.html`, `./css/style.css`, `./js/api.js`,
  `./js/config.js`, `./js/theme.js`, `./js/guard.js`, `./js/watchdog.js`, `./images/temp-mail-icon.png`,
  `./images/app-icon.svg`, `./manifest.json`.
- `install`: cache the shell with `cache.addAll`, then `self.skipWaiting()`.
- `activate`: delete caches whose name !== CACHE, then `self.clients.claim()`.
- `fetch`:
  - Only handle `GET` requests to the SAME origin. Everything else (Guerrilla API, fonts, CDNs, analytics) must fall
    through untouched — do NOT call `respondWith` for them. The inbox must never be served from cache.
  - Same-origin GET: network-first; on success put a clone in the cache (only if `response.ok` and
    `response.type === 'basic'`); on network failure return the cached response, and for navigation requests fall back
    to the cached `./index.html`.

## 3D. Wiring
- In `index.html` `<head>` add `<link rel="manifest" href="manifest.json" />`,
  `<link rel="apple-touch-icon" href="images/icon-192.png" />` and
  `<meta name="apple-mobile-web-app-capable" content="yes" />`.
- In `js/api.js`, near the end (before the `window.*` exports), register the worker:
  `if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));`
- Handle the manifest shortcut: during init, if `new URLSearchParams(location.search).get('action') === 'new'`, call
  `genEmail()` once after initialization succeeds and remove the param with `history.replaceState`.
- Add an "Install app" command palette item (`t('cmd_install_app')`, icon `fa-download`) shown only when a
  `beforeinstallprompt` event has been captured (store it in a module-level `deferredInstallPrompt`, call
  `preventDefault()` on it). Selecting it calls `deferredInstallPrompt.prompt()` and clears it.
  Translations: EN "Install app" / TR "Uygulamayı yükle".
