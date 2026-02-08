// ─────────────────────────────────────────────
// TempMail v3 — Configuration
// Author: Mehmet Kahya
// Last Updated: 9 February 2026
// ─────────────────────────────────────────────

// Duplicate domain/license guard (defense-in-depth)
(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('dev') === '1') {
        sessionStorage.setItem('TEMP_MAIL_DEV_OVERRIDE', '1');
    }
    const devOverride = sessionStorage.getItem('TEMP_MAIL_DEV_OVERRIDE') === '1';
    const ALLOWED_HOST = ['mehmetkahya0.github.io', '127.0.0.1'];
    if (!devOverride && !ALLOWED_HOST.includes(location.host) && !ALLOWED_HOST.includes(location.hostname)) {
        throw new Error('UNAUTHORIZED_HOST');
    }
})();

const CONFIG = {
    API_BASE: 'https://api.guerrillamail.com/ajax.php',

    // Storage keys
    EMAIL_KEY: 'temp_mail_address',
    SESSION_KEY: 'guerrilla_session_id',
    AUTO_REFRESH_KEY: 'temp_mail_auto_refresh',
    REFRESH_INTERVAL_KEY: 'temp_mail_refresh_interval',
    SESSION_START_KEY: 'temp_mail_session_start',
    EMAIL_CACHE_KEY: 'temp_mail_email_cache',
    KNOWN_IDS_KEY: 'temp_mail_known_ids',

    // Retry & timeout
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    REQUEST_TIMEOUT: 12000,

    // Available domains
    DOMAINS: [
        'guerrillamail.com',
        'guerrillamail.net',
        'guerrillamail.org',
        'guerrillamailblock.com',
        'grr.la',
        'pokemail.net',
        'spam4.me'
    ],

    // System status
    STATUS: {
        ONLINE: { text: 'Online', class: 'online' },
        OFFLINE: { text: 'Offline', class: 'offline' },
        LOADING: { text: 'Syncing', class: 'loading' }
    },

    // Toast durations (ms)
    TOAST_DURATION: 3500,
    TOAST_DURATION_LONG: 6000,

    // Search debounce (ms)
    SEARCH_DEBOUNCE: 250,
};

Object.freeze(CONFIG);
Object.freeze(CONFIG.STATUS);
Object.freeze(CONFIG.DOMAINS);

export default CONFIG;
