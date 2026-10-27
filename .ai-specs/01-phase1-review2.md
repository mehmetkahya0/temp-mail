# Phase 1 — review fix 2 (Turkish suffixes)

`extractVerificationCode()` misses Turkish OTP mails because the keyword regex requires a word boundary after the
keyword, and Turkish adds suffixes ("Kodunuz: 7731", "Giriş kodu 5521"). Also JS `\b` is ASCII-only so it misbehaves
around letters like ş/ğ.

Replace ONLY the `keywordRe` line in `extractVerificationCode()` with exactly:

```js
    const keywordRe = /(?<!\p{L})(?:code|otp|pin|verification|passcode|token|kod\p{L}*|doğrulama\p{L}*|onay\p{L}*|şifre\p{L}*)(?!\p{L})/giu;
```

Leave everything else untouched. Run `node --check js/api.js`.
