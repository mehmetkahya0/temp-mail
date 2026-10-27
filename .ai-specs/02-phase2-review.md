# Phase 2 — review fixes (apply all, change nothing else)

1. **Arrow keys break page scrolling.** The global keydown handler calls `e.preventDefault()` for every matched
   shortcut, so ArrowUp/ArrowDown never scroll the page any more. Fix in the keydown handler, before the shortcut lookup:
   - `ArrowUp` / `ArrowDown`: only handle them when `selectedMailId !== null`. Otherwise `return` WITHOUT preventDefault.
     (`j`/`k` still start a selection from nothing.)
   - `Enter`, `o`, `s`, `Delete`, `#`: when `selectedMailId === null`, `return` WITHOUT preventDefault.

2. **Duplicate id.** `buildEmailViewHTML` emits `id="eml-download-btn"`; with the modal and the reader pane both present
   that id is duplicated. Replace it with `class="eml-download-btn"` and update `wireEmailViewActions` to query
   `.eml-download-btn`. Make sure nothing else references `#eml-download-btn` (grep).

3. **Untranslated toast.** In `wireEmailViewActions` the copy-text success toast is the hard-coded English
   `'Email text copied!'`. Use `t('toast_text_copied')` and add the key: EN "Email text copied" / TR "E-posta metni kopyalandı".

Run `node --check js/api.js`. Print one confirmation line per item.
