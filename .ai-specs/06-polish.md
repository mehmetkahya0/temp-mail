# Polish — found while taking README screenshots (apply all, change nothing else)

1. **Plural bug.** With one blocked image the banner reads "1 remote images blocked…".
   Add translation key `shield_blocked_one`: EN "1 remote image blocked to protect your privacy" /
   TR "Gizliliğin için 1 uzak görsel engellendi". In `buildEmailViewHTML`, use `t('shield_blocked_one')` when
   `shielded.blocked === 1`, otherwise the existing `shield_blocked` with `{n}`.

2. **Shield banner wraps badly on narrow screens** (≤640px the shield icon sits alone on its own line, the text on the
   next, the buttons on a third). In the Phase 4 CSS, make `.shield-banner` a 2-column grid:
   `grid-template-columns: auto minmax(0, 1fr); align-items: center; column-gap: 0.6rem; row-gap: 0.6rem;`
   with `.shield-banner-actions { grid-column: 1 / -1; display: flex; gap: 0.4rem; flex-wrap: wrap; }` — but only inside
   `@media (max-width: 640px)`. Desktop layout must stay unchanged.

Run `node --check js/api.js`. One confirmation line per item.
