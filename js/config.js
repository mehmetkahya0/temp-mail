// Duplicate domain/license guard (defense-in-depth). If removed in guard.js, this still blocks.
(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('dev') === '1') {
        sessionStorage.setItem('TEMP_MAIL_DEV_OVERRIDE', '1');
    }
    const devOverride = sessionStorage.getItem('TEMP_MAIL_DEV_OVERRIDE') === '1';
    const ALLOWED_HOST = ['mehmetkahya0.github.io'];
    if (!devOverride && !ALLOWED_HOST.includes(location.host) && !ALLOWED_HOST.includes(location.hostname)) {
        throw new Error('UNAUTHORIZED_HOST');
    }
})();

const CONFIG = {
    API_BASE: 'https://api.guerrillamail.com/ajax.php',
    EMAIL_KEY: 'temp_mail_address',
    SESSION_KEY: 'guerrilla_session_id',
    AUTO_REFRESH_KEY: 'temp_mail_auto_refresh',
    REFRESH_INTERVAL_KEY: 'temp_mail_refresh_interval',
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000, // 2 seconds
    REQUEST_TIMEOUT: 10000, // 10 seconds
    
    DOMAINS: [
        'guerrillamail.com',
        'guerrillamail.net',
        'guerrillamail.org',
        'guerrillamailblock.com',
        'grr.la',
        'pokemail.net',
        'spam4.me'
    ],
    STATUS: {
        ONLINE: {
            text: 'Online',
            class: 'online'
        },
        OFFLINE: {
            text: 'Offline',
            class: 'offline'
        },
        LOADING: {
            text: 'Loading',
            class: 'loading'
        }
    }
};

// Prevent modification of config
Object.freeze(CONFIG);

export default CONFIG;