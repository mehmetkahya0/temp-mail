# Phase 1 — date bug, verification codes, notifications, per-email expiry

Read `.ai-specs/00-rules.md` first and obey it.

## 1A. Fix the "01.01.1970" date bug
Some emails (e.g. Guerrilla's welcome mail) render their date as 01.01.1970.
- Add a helper `getMailTimestamp(email)` near `relativeTime()` that returns unix SECONDS as a Number:
  `Number(email.mail_timestamp)`; if that is NaN or < 1e9, fall back to `Date.parse(email.mail_date)/1000` if valid;
  otherwise return `null`.
- `relativeTime(ts)` and `formatFullDate(ts)` must return `'—'` when `ts` is null/NaN.
- Use `getMailTimestamp(email)` everywhere `email.mail_timestamp` is currently passed to those two functions
  (table rows, responsive cards, email modal).

## 1B. Verification code & link extraction
Users mostly come here to grab an OTP / confirm link. Make that one click.
- Add `extractVerification(text)` returning `{ code: string|null, link: string|null }`.
  - `code`: search case-insensitively for a keyword (`code`, `kod`, `otp`, `pin`, `verification`, `doğrulama`,
    `onay`, `passcode`, `token`) and take the first match of `\b[0-9]{4,8}\b` OR `\b(?=[A-Z0-9]*\d)(?=[A-Z0-9]*[A-Z])[A-Z0-9]{5,8}\b`
    within the 80 characters AFTER the keyword. If no keyword hit, accept a standalone 6-digit number (`\b\d{6}\b`) only.
    Never return a 4-digit value between 1900 and 2099 (years).
  - `link`: only when parsing full HTML (see modal below): the first `<a href>` whose href or text matches
    `/verify|confirm|activate|validate|doğrula|onayla|magic|login/i` and starts with `http`.
- In the inbox list (table row AND responsive card), run it on `mail_subject + ' ' + mail_excerpt`. If a code is found,
  render a pill button `.otp-chip` right after the subject: monospace code text + a copy icon. Clicking it copies the
  code (reuse the same clipboard approach as `copyEmail()`, including its fallback), shows the success toast
  `t('toast_code_copied')`, and must `event.stopPropagation()` so the row/card does not open.
- In `showEmailModal(email)`: run extraction on the subject + the plain text of the sanitized body, and the link
  search on the sanitized body HTML. If either is found, render a highlighted strip `.otp-strip` between `.email-meta`
  and `.email-body` containing: the big code (Geist Mono, ~1.5rem) with a primary "Copy code" button, and/or a
  secondary "Open verification link" `<a>` (target `_blank`, `rel="noopener noreferrer"`).
- Add command palette entry "Copy latest code" that copies the code from the newest email that has one, or toasts
  `t('toast_no_code')`.

## 1C. Notifications & tab title
Already present: `detectNewMails()` fires a Notification when permitted, and `updateEmailCount()` puts the TOTAL count in
`document.title`. Change it to:
- Track `unseenCount` (module-level). When new mails arrive while `document.hidden` is true, add to `unseenCount` and set
  `document.title = '(' + unseenCount + ') ' + t('doc_title')`. On `visibilitychange` to visible, reset to 0 and restore
  `t('doc_title')`. `updateEmailCount()` must no longer touch `document.title`.
- Only show the system Notification when `document.hidden`. Body: sender + subject of the newest new mail
  (escape nothing — Notification text is plain). `notification.onclick` → `window.focus()`, `viewEmail(id)`, close it.
  Use `tag: 'tempmail-new'` so they stack. Wrap in try/catch (`Notification` may be undefined).
- Remove the 10-second automatic permission prompt in `requestNotificationPermission()`. Instead request permission:
  (a) the first time the user enables the auto-refresh checkbox, and (b) from a new command palette entry
  "Enable desktop notifications". If permission is denied, toast `t('toast_notif_denied')`.

## 1D. Per-email expiry
Guerrilla deletes each email 60 minutes after it arrives.
- Add `const MAIL_TTL_SECONDS = 3600;` and helper `getMailExpiry(email)` → minutes left (integer, min 0) or null if no timestamp.
- In the Date cell of each row (and in the card header), under/next to the relative time, render a tiny
  `.expiry-meter`: a 2px-high track with a fill whose `transform: scaleX(fraction)` shows time left, plus a title tooltip
  `t('expires_in').replace('{m}', minutes)`. Fill uses `var(--signal)`; when < 10 minutes left, use `var(--warning)`
  (class `.is-low`).
- Refresh these meters once a minute with a single `setInterval` that only updates the existing meter elements
  (do not re-render the table). Store `data-ts` on each meter.

## Translations to add (EN / TR)
toast_code_copied: "Code copied" / "Kod kopyalandı"
toast_no_code: "No verification code found" / "Doğrulama kodu bulunamadı"
toast_notif_denied: "Notifications are blocked in your browser" / "Bildirimler tarayıcında engelli"
btn_copy_code: "Copy code" / "Kodu kopyala"
btn_open_verify_link: "Open verification link" / "Doğrulama linkini aç"
cmd_copy_latest_code: "Copy latest code" / "Son kodu kopyala"
cmd_enable_notifications: "Enable desktop notifications" / "Masaüstü bildirimlerini aç"
expires_in: "Deletes in {m} min" / "{m} dk sonra silinecek"
label_verification_code: "Verification code" / "Doğrulama kodu"
