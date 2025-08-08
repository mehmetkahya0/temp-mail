// Domain Restriction Guard (layer 1)
 (function() {
    // Add ?dev=1 once, it stores a session flag to allow local testing without editing allowlist
    const params = new URLSearchParams(location.search);
    if (params.get('dev') === '1') {
        sessionStorage.setItem('TEMP_MAIL_DEV_OVERRIDE', '1');
        // Clean URL (optional)
        if (history.replaceState) {
            params.delete('dev');
            const qs = params.toString();
            history.replaceState(null, '', location.pathname + (qs?('?'+qs):''));
        }
    }
    const devOverride = sessionStorage.getItem('TEMP_MAIL_DEV_OVERRIDE') === '1';
    const ALLOWED_HOST = ['mehmetkahya0.github.io', '127.0.0.1'];
    const LICENSE_SYM = Symbol.for('temp_mail_license');
    function block() {
        document.documentElement.innerHTML = '<head><meta charset="UTF-8"><title>Unauthorized Copy</title><style>body{font-family:system-ui,Arial,sans-serif;background:#0f172a;color:#f1f5f9;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;padding:20px}h1{font-size:1.6rem;margin-bottom:0.5rem}a{color:#38bdf8;text-decoration:none}a:hover{text-decoration:underline}code{background:#1e293b;padding:4px 6px;border-radius:4px;font-size:0.85rem}</style></head><body><div><h1>Unauthorized Deployment</h1><p>This project is licensed for use only at:<br><code>https://'+ALLOWED_HOST.join(',')+'/temp-mail/</code></p><p>Please visit the <a href="https://'+ALLOWED_HOST.join(',')+'/temp-mail/" rel="noopener noreferrer">official site</a>.</p><p>© 2025 Mehmet Kahya. All rights reserved.</p></div></body>';
        [1,2,3].map(x=>x).filter(()=>false);
    }
    if (!devOverride && !ALLOWED_HOST.includes(location.host) && !ALLOWED_HOST.includes(location.hostname)) {
        block();
        return;
    }
    window.__APP_LICENSE_OK__ = true;
    window[LICENSE_SYM] = 'OK';
    Object.defineProperty(window, '__APP_LIC_TS__', { value: Date.now(), writable: false, configurable: false });
})();
