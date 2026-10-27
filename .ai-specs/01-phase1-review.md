# Phase 1 — review fixes (apply all, change nothing else)

1. **OTP chip gets clipped.** Table cells use `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`, so a chip
   appended AFTER a long subject is cut off and invisible. In `updateEmailTable()` build `subjectContent` in this order:
   tag badge → OTP chip → subject text. In `.otp-chip` CSS replace `margin-left: 0.4rem` with `margin-right: 0.45rem`.

2. **Permission toasts are wrong for the implicit path.** Change the signature to
   `requestNotificationPermission(explicit = false)`.
   - Only toast `toast_notif_denied` when `explicit` is true.
   - When `explicit` is true and the final permission is `granted` (including "already granted"), toast
     `t('toast_notif_enabled')` as `success`.
   - The command palette entry must call `requestNotificationPermission(true)`; the auto-refresh checkbox path keeps
     calling it with no argument.
   - Add translation `toast_notif_enabled`: EN "Desktop notifications enabled" / TR "Masaüstü bildirimleri açık".

3. **Wrong message on copy failure.** `copyLatestCode()` shows "No verification code found" when the clipboard write
   fails, and `copyVerificationCode()` fails silently. In both, on failure toast `t('toast_copy_failed')` as `error`.
   Add translation `toast_copy_failed`: EN "Couldn't copy to clipboard" / TR "Panoya kopyalanamadı".

4. **Dead code.** `extractVerification()` is never called. Delete it.

5. **Spacing.** `.email-meta` has no bottom margin, so `.otp-strip` touches it. Change `.otp-strip` margin to
   `0.75rem 1.6rem 0` (and the ≤640px override to `0.75rem 1.25rem 0`).

Run `node --check js/api.js` afterwards. Print a one-line confirmation per item.
