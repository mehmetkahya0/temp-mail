// Runtime watchdog: periodically re-assert domain + license flag.
(function() {
    const ALLOWED_HOST = ['mehmetkahya0.github.io', '127.0.0.1'];
    const LICENSE_SYM = Symbol.for('temp_mail_license');
    let failCount = 0;
    const MAX_FAILS = 2; // require consecutive fails to reduce false positives
    function nuke() {
        try { document.body.innerHTML = '<div style="font:16px system-ui;padding:40px;text-align:center;color:#fff;background:#0f172a;min-height:100vh;display:flex;flex-direction:column;justify-content:center;">Unauthorized runtime modification detected.</div>'; } catch(_) {}
        for (const k of Object.keys(window)) {
            if (typeof window[k] === 'function') {
                try { window[k] = () => {}; } catch(_) {}
            }
        }
    }
    function validHost() {
        return ALLOWED_HOST.includes(location.host) || ALLOWED_HOST.includes(location.hostname);
    }
    function check() {
        if (!validHost() || !window.__APP_LICENSE_OK__ || window[LICENSE_SYM] !== 'OK') {
            failCount++;
            if (failCount >= MAX_FAILS) nuke();
        } else {
            failCount = 0; // reset on success
        }
    }
    // Delay first check slightly to allow guard.js to run
    setTimeout(() => {
        setInterval(check, 4000);
        requestAnimationFrame(function loop(){check(); requestAnimationFrame(loop);});
    }, 200);
})();
