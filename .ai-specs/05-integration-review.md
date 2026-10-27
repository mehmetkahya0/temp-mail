# Integration review — fixes found in browser testing (apply all, change nothing else)

1. **Service worker install fails.** In the browser, `cache.addAll(APP_SHELL)` rejects with
   `InvalidAccessError: Entry already exists`, which aborts install. Make install resilient in `sw.js`:
   ```js
   caches.open(CACHE)
       .then((cache) => Promise.allSettled(APP_SHELL.map((url) => cache.add(new Request(url, { cache: 'reload' })))))
       .then(() => self.skipWaiting())
   ```
   Also bump `CACHE` to `'tempmail-v5-2'`, and fix the header comment: it says "Cache-first shell" but the strategy is
   network-first for all same-origin GETs.

2. **List is unreadable while the reader is open** (~500px column: subject collapses to "…", date shows "—").
   Append to the Phase 2 CSS section:
   - In `.inbox-core.has-reader` ALSO hide column 4 (date) — `th:nth-child(4), td:nth-child(4)`.
   - Set `.inbox-core.has-reader th:nth-child(2) { width: 38%; }` (sender) so the subject gets the rest.
   - In `.inbox-core.has-reader`, render `.email-tag-badge` as icon-only: hide its text by setting `font-size: 0` on
     the badge and restoring `font-size: 0.55rem` on its `i`, with padding `0.2rem 0.35rem`.
   - Change the split grid to `grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.2fr);`.

3. **Email body overflows horizontally** (plain-text mails come as `<pre>`, long lines run off the edge; affects the
   modal and the pane). Add to the base `.email-body` rules (not inside a media query):
   ```css
   .email-body { overflow-wrap: anywhere; }
   .email-body pre { white-space: pre-wrap; word-break: break-word; font-family: var(--font-mono); font-size: 0.8rem; }
   .email-body table { max-width: 100%; }
   ```

Run `node --check sw.js`. Print one confirmation line per item.
