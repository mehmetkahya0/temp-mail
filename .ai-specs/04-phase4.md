# Phase 4 — Privacy shield & link safety

Read `.ai-specs/00-rules.md` first. Email rendering now goes through `buildEmailViewHTML(email, mode)` +
`wireEmailViewActions(container, email)` (used by both the modal and the reader pane). Build on those.

## 4A. Privacy shield (remote content blocked by default)
Add `applyPrivacyShield(html)` → `{ html, blocked }`, called in `buildEmailViewHTML` on the output of `sanitizeHTML`
(do not change `sanitizeHTML` itself). Parse with `DOMParser`. When the setting "always load images" is OFF:
- **Tracking pixels — remove entirely** (not counted as blocked): any `<img>` whose `width` or `height` attribute is
  `0`, `1` or `2`, or whose inline style contains `display:none` / `visibility:hidden` / `width:1px` / `height:1px`
  (normalise whitespace before testing).
- Every other `<img>` (and `<source>` inside `<picture>`) with an `http(s)` / protocol-relative `src`/`srcset`: move the
  value to `data-shield-src` / `data-shield-srcset`, remove `src`/`srcset`, add class `shield-img`, set
  `alt` to its existing alt or `''`. Count them in `blocked`.
- Inline `style` attributes and `<style>` element text: replace every `url(...)` that points to `http`, `https` or `//`
  with `none` (count each element touched once). Also remove `background` attributes with remote URLs.
- Leave `data:` and `cid:` URLs alone.
When the setting is ON, return `{ html, blocked: 0 }` unchanged.

Setting: `localStorage['temp_mail_load_images']` = `'1'` or absent. Helpers `getLoadImagesSetting()` /
`setLoadImagesSetting(bool)`.

UI (inside the view, between `.otp-strip` / `.email-meta` and `.email-body`), only when `blocked > 0`:
`.shield-banner` — shield icon (`fa-solid fa-shield-halved`), text `t('shield_blocked').replace('{n}', blocked)`,
and two buttons: `t('btn_show_images')` (restores `data-shield-*` → real attributes in THIS container only, then hides
the banner) and `t('btn_always_show_images')` (saves the setting, then does the same). Wire both in
`wireEmailViewActions`. Styling: compact pill-ish strip, `var(--field)` background, hairline ring, 0.8rem text,
same horizontal margins as `.otp-strip` (modal 1.6rem / pane 1.1rem / ≤640px 1.25rem), top margin 0.75rem.
`.shield-img` placeholders: `min-height: 2.5rem; min-width: 2.5rem; background: var(--field); border-radius: var(--radius-sm);`.

Command palette item: "Always load remote images" / toggles the setting; label shows current state using
`t('cmd_toggle_images_on')` / `t('cmd_toggle_images_off')`; toast `t('toast_images_setting_on' | '..._off')`.

## 4B. Link safety
In `applyPrivacyShield` (runs regardless of the image setting) process every `<a href>`:
- Absolute `http(s)` links: set `target="_blank"`, `rel="noopener noreferrer nofollow"`, and
  `title` = the real hostname (prefix with existing title if any: `"<title> — <host>"`).
- Mark as suspicious (add class `link-suspicious` and `data-real-host="<host>"`) when ANY of:
  - hostname is an IPv4 address or a bracketed IPv6;
  - hostname contains a label starting with `xn--`;
  - hostname (or its parent domain) is one of: `bit.ly, t.co, tinyurl.com, goo.gl, ow.ly, is.gd, buff.ly, cutt.ly,
    rebrand.ly, shorturl.at, rb.gy, t.ly`;
  - the link's visible text looks like a URL or domain (matches `/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i`
    after trim) and its hostname (strip `www.`) differs from the href hostname (strip `www.`).
- `javascript:` / `data:` hrefs: remove the `href` attribute (sanitizeHTML should already strip javascript:, this is
  defence in depth).
In `wireEmailViewActions`, delegate `click` on `.email-body`: if the clicked `a.link-suspicious` is hit,
`preventDefault()` and open a confirmation modal (reuse `.email-modal` / `.email-modal-content` pattern, max-width
420px): title `t('link_warning_title')`, text `t('link_warning_desc')`, the real host in a mono box, buttons
`t('btn_open_anyway')` (opens with `window.open(href, '_blank', 'noopener,noreferrer')`, closes the modal) and
`t('btn_cancel')`. Esc/backdrop close it. Do NOT use `window.confirm`.
CSS: `.email-body a.link-suspicious` gets a dotted `var(--warning)` underline (`text-decoration`) and an `::after`
"⚠" in `var(--warning)` with 0.25em left margin.

## Translations (EN / TR)
shield_blocked: "{n} remote images blocked to protect your privacy" / "Gizliliğin için {n} uzak görsel engellendi"
btn_show_images: "Show images" / "Görselleri göster"
btn_always_show_images: "Always show" / "Her zaman göster"
cmd_toggle_images_on: "Block remote images" / "Uzak görselleri engelle"
cmd_toggle_images_off: "Always load remote images" / "Uzak görselleri hep yükle"
toast_images_setting_on: "Remote images will always load" / "Uzak görseller artık hep yüklenecek"
toast_images_setting_off: "Remote images are blocked" / "Uzak görseller engelleniyor"
link_warning_title: "Check this link" / "Bu linki kontrol et"
link_warning_desc: "This link looks suspicious. It actually goes to:" / "Bu link şüpheli görünüyor. Aslında şuraya gidiyor:"
btn_open_anyway: "Open anyway" / "Yine de aç"
btn_cancel: "Cancel" / "Vazgeç"

(`cmd_toggle_images_on` is the label shown when loading is currently ON, i.e. the action turns it off.)
