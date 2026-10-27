# Phase 2 — reader pane, read/unread, address history, keyboard navigation

Read `.ai-specs/00-rules.md` first and obey it. Phase 1 code (OTP chips, expiry meters, `getMailTimestamp`,
`copyToClipboard`) is already in place — reuse it, do not duplicate it.

## 2A. Shared email view + split reader pane (desktop)
1. Refactor `showEmailModal(email)`: move the markup that renders header (subject + close button), `.modal-actions`,
   `.email-meta`, `.otp-strip`, `.email-body` and `.attachments` into a new function `buildEmailViewHTML(email, mode)`
   where `mode` is `'modal'` or `'pane'`. The modal must render exactly as before. Keep the `#eml-download-btn` wiring
   working for both modes (wire it after insertion, scoped to the container, never via a global `document.querySelector`).
   The existing "Copy Text" button uses `document.querySelector('.email-body')` — change it to copy from the body inside
   its own container.
2. Add to `index.html`, as the last child of `.inbox-core` (after `.table-container`):
   `<aside id="reader-pane" class="reader-pane" aria-label="Email reader" hidden></aside>`
3. Split mode is active when `window.matchMedia('(min-width: 1100px)').matches`. In `viewEmail(id)`:
   - split mode → render `buildEmailViewHTML(email, 'pane')` into `#reader-pane`, remove `hidden`, add class `has-reader`
     to `.inbox-core`, mark that row `.is-active` (remove from others). The pane's close button clears the pane, re-adds
     `hidden`, removes `has-reader` and `.is-active`.
   - otherwise → open the modal as today.
   - If the media query stops matching while the pane is open, close the pane (listen to the MediaQueryList `change`).
   - When the active email is deleted (`deleteEmail`) or the mailbox changes (`switchMailbox`, `genEmail`), close the pane.
4. Layout CSS (append): `.inbox-core.has-reader` becomes a 2-column grid: the head/chips/table column (minmax(0, 1fr))
   and the reader (minmax(0, 1.15fr)). The head and chips stay in column 1 — simplest is to wrap nothing and use
   `grid-template-areas`; you may add one wrapper `<div class="inbox-list">` around `.inbox-head`, `#filter-chips`,
   `#loading-spinner`, `#error-message`, `.table-container` in `index.html` if that is cleaner.
   In `.has-reader`, hide table column 1 (ID) and column 5 (actions) via `th:nth-child(n), td:nth-child(n)`
   and unset the fixed widths so the table still fills its column.
   The reader: `position: sticky; top: 5.5rem; max-height: calc(100dvh - 7rem); overflow: auto;` double-bezel look using
   `var(--core-2)`, `box-shadow: 0 0 0 1px var(--hairline)`, radius `calc(var(--r-core) - 0.75rem)`, entry animation
   (opacity + translateX(1rem) → none, `var(--ease-out)`, 0.45s). In pane mode, add a star toggle button to the actions
   bar (reuse `toggleStarMail`).
5. Row interaction: a SINGLE click on a table row or responsive card opens the email (`viewEmail`). Ignore clicks whose
   target is inside `button`, `a` or `.otp-chip` (use `event.target.closest('button, a')`). Remove the old `dblclick`
   listeners. Rows keep `cursor: pointer`.

## 2B. Read / unread
- Store read ids per address in `localStorage['temp_mail_read_ids']` as `{ "<address>": ["id", ...] }`
  (cap each list at 200 newest ids). Helpers: `getReadIds()` → Set for `currentEmail`, `markAsRead(id)`.
- `viewEmail(id)` marks the email read after a successful fetch, then updates the row/card in place
  (remove `.is-unread`) and re-renders the filter chips counts.
- In `updateEmailTable`, rows and cards whose id is not read get class `is-unread`.
  CSS: `.is-unread td:nth-child(2), .is-unread td:nth-child(3)` → `color: var(--text); font-weight: 600;` and a 6px
  `var(--signal)` dot before the subject (`::before` on a new `.subject-text` span wrapping only the subject text;
  in light theme the dot uses `var(--primary)`). Same for `.email-card.is-unread .email-card-subject`.
- Add filter `'unread'` to `setFilter` / `renderFilterChips` / the filtering in `updateEmailTable`, with a chip
  (icon `fa-circle-dot`, label `t('filter_unread')`, count), placed after "All".

## 2C. Address history
- `localStorage['temp_mail_address_history']`: array of `{ email, createdAt }` (ms), newest first, unique by email,
  max 20. Add `pushAddressHistory(email)` and call it after every successful `genEmail`.
- Extend `genEmail(customPrefix = null, forcedDomain = null)`: when `forcedDomain` is given use it instead of the
  domain select. Add `restoreAddress(email)` which splits `user@domain` and calls `genEmail(user, domain)`; the toast for
  this path must be `t('toast_address_restored')` (not the "custom address" toast).
- UI: add a 4th icon button to `.icon-row` in the address card: id `history-btn`, icon `fa-solid fa-clock-rotate-left`,
  tooltip/aria `t('tooltip_history')`. It opens `showAddressHistory()`: a modal using the existing `.email-modal` /
  `.email-modal-content` structure (max-width 460px), title `t('history_title')`, a short hint `t('history_hint')`, and a
  list: each item shows the address (Geist Mono), relative time from `createdAt` (reuse `relativeTime(createdAt/1000)`),
  a "Use" button (`t('btn_use')`, disabled + labelled `t('label_current')` if it is `currentEmail`), and a remove ✕
  button. Empty state text `t('history_empty')`. Escape closes it, backdrop click closes it (follow the alias modal
  pattern exactly).
- Command palette: add item "Address history" (`t('cmd_address_history')`, icon `fa-clock-rotate-left`) that opens it.

## 2D. Keyboard navigation
Extend the global `shortcuts` array / keydown handler (respect the existing "ignore while typing" guard):
- `j` / `ArrowDown`: move selection to the next visible row (or card on mobile), `k` / `ArrowUp`: previous.
  Selected element gets `.is-selected` (CSS: `box-shadow: inset 2px 0 0 var(--signal)` on the first visible cell and
  `background: var(--field)`; on cards a `var(--field)` background). Scroll it into view with `block: 'nearest'`.
- `Enter` or `o`: open the selected email. `s`: toggle star on it. `Delete` / `#`: delete it.
- Only handle Arrow keys when no modal/palette is open and focus is not inside an input.
- Add the new keys to the shortcuts help list (labels via new translation keys).

## Translations to add (EN / TR)
filter_unread: "Unread" / "Okunmamış"
tooltip_history: "Address history" / "Adres geçmişi"
history_title: "Recent addresses" / "Son adresler"
history_hint: "Reopen an address you used before. Mails older than 60 minutes are already gone." / "Daha önce kullandığın bir adrese dön. 60 dakikadan eski mailler silinmiş olur."
history_empty: "No addresses yet" / "Henüz adres yok"
btn_use: "Use" / "Kullan"
label_current: "Current" / "Şu an"
toast_address_restored: "Address restored" / "Adres geri yüklendi"
cmd_address_history: "Address history" / "Adres geçmişi"
shortcut_next: "Next email" / "Sonraki e-posta"
shortcut_prev: "Previous email" / "Önceki e-posta"
shortcut_open: "Open email" / "E-postayı aç"
shortcut_star: "Star email" / "E-postayı yıldızla"
shortcut_delete: "Delete email" / "E-postayı sil"
