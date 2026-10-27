# Ground rules for every phase

You are working in a static, build-free web app (TempMail). Files:
- `index.html` — markup
- `css/style.css` — the "Obsidian Signal" design system (tokens on `:root` / `[data-theme]`)
- `js/api.js` — all app logic (ES module, functions exposed on `window.*` at the bottom)
- `js/theme.js`, `js/config.js`, `js/guard.js`, `js/watchdog.js`

Hard rules:
1. Do NOT modify `js/config.js`, `js/guard.js`, `js/watchdog.js`, or the CSP `<meta>` in `index.html` unless the phase spec says so.
2. No new libraries, no CDNs, no build step. Vanilla JS only.
3. Match the existing code style in `js/api.js`: 4-space indent, `function` declarations, section banners like
   `// ══════…` / `// Title` / `// ══════…`, template-literal HTML, `escapeHTML()` for every untrusted string inserted into HTML.
4. Every user-visible string must exist in BOTH `TRANSLATIONS.EN` and `TRANSLATIONS.TR` and be read with `t('key')`.
   (Some legacy code uses inline `currentLanguage === 'TR' ? … : …`; do not add more of that.)
5. Styling: only use the CSS custom properties already defined in `css/style.css` (`--signal`, `--signal-ink`, `--field`,
   `--hairline`, `--text-secondary`, `--ease-out`, `--ease-spring`, `--radius-full`, etc.). No hard-coded colours except
   where existing code already does. Transitions must use `var(--ease-out)` or `var(--ease-spring)`, never `linear`/`ease-in-out`.
   Animate only `transform` and `opacity`.
6. Append new CSS in a clearly bannered section at the END of `css/style.css` (before nothing — just append), unless you
   are changing an existing rule.
7. Anything a new feature stores in `localStorage` must use a key prefixed `temp_mail_` and be wrapped in try/catch when parsed.
8. Never break existing features: multi-mailbox tabs, filter chips, star, command palette, shortcuts, auto-refresh, QR, alias.
9. When finished, print a short summary listing every function you added or changed.
