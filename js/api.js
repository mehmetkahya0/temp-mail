// ─────────────────────────────────────────────
// TempMail v3.5 — Core Engine (Enhanced UX)
// Author: Mehmet Kahya
// Last Updated: 10 February 2026
// ─────────────────────────────────────────────

import CONFIG from './config.js';

// ── License verification (layer 3) ──
if (typeof window !== 'undefined') {
    const LICENSE_SYM = Symbol.for('temp_mail_license');
    if (!window.__APP_LICENSE_OK__ || window[LICENSE_SYM] !== 'OK') {
        throw new Error('Domain not authorized');
    }
}

// ══════════════════════════════════════════════
// Toast Notification System
// ══════════════════════════════════════════════
const toastContainer = document.getElementById('toast-container');
const toastIcons = {
    success: 'fa-check',
    error: 'fa-xmark',
    info: 'fa-info',
    warning: 'fa-exclamation'
};

function toast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${toastIcons[type]}"></i></div>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.closest('.toast').remove()" aria-label="Close">&times;</button>
        <div class="toast-progress" style="animation-duration:${duration}ms"></div>
    `;
    toastContainer.appendChild(el);

    const timer = setTimeout(() => {
        el.classList.add('toast-exit');
        setTimeout(() => el.remove(), 300);
    }, duration);

    // Pause on hover
    el.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        const progress = el.querySelector('.toast-progress');
        if (progress) progress.style.animationPlayState = 'paused';
    });
    el.addEventListener('mouseleave', () => {
        const progress = el.querySelector('.toast-progress');
        if (progress) progress.style.animationPlayState = 'running';
        setTimeout(() => {
            el.classList.add('toast-exit');
            setTimeout(() => el.remove(), 300);
        }, 1500);
    });
}

// ══════════════════════════════════════════════
// State Management
// ══════════════════════════════════════════════
const getStored = (key) => localStorage.getItem(key);
const setStored = (key, val) => localStorage.setItem(key, val);
const removeStored = (key) => localStorage.removeItem(key);

const clearStoredData = () => {
    removeStored(CONFIG.EMAIL_KEY);
    removeStored(CONFIG.SESSION_KEY);
    removeStored(CONFIG.EMAIL_CACHE_KEY);
    removeStored(CONFIG.KNOWN_IDS_KEY);
};

let currentEmail = getStored(CONFIG.EMAIL_KEY) || '';
let sessionId = getStored(CONFIG.SESSION_KEY) || '';
let knownMailIds = new Set(JSON.parse(getStored(CONFIG.KNOWN_IDS_KEY) || '[]'));
let lastEmailCount = 0;

// ══════════════════════════════════════════════
// DOM Elements
// ══════════════════════════════════════════════
const $ = (id) => document.getElementById(id);
const elements = {
    emailInput: $('addr'),
    emailTable: $('emails')?.querySelector('tbody'),
    loadingSpinner: $('loading-spinner'),
    errorMessage: $('error-message'),
    autoRefreshCheckbox: $('auto-refresh'),
    refreshIntervalSelect: $('refresh-interval'),
    emailSearch: $('email-search'),
    statusLed: $('status-led'),
    statusText: $('status-text'),
    countBadge: $('email-count-badge'),
    deleteAllBtn: $('delete-all-btn'),
    countdown: $('countdown'),
    sessionTimer: $('session-timer'),
    sessionTimerText: $('session-timer-text'),
    countdownBarContainer: $('countdown-bar-container'),
    countdownBar: $('countdown-bar'),
    domainSelect: $('domain-select'),
    copyBtn: $('copy-btn'),
    copyIcon: $('copy-icon'),
};

// ══════════════════════════════════════════════
// Utility: Fetch with AbortController timeout
// ══════════════════════════════════════════════
async function fetchWithTimeout(url, options = {}, timeout = CONFIG.REQUEST_TIMEOUT) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        throw error;
    }
}

// ══════════════════════════════════════════════
// Utility: Debounce
// ══════════════════════════════════════════════
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// ══════════════════════════════════════════════
// Utility: Sanitize HTML to prevent XSS
// ══════════════════════════════════════════════
function sanitizeHTML(html) {
    // Create a sandboxed iframe to parse HTML safely
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove dangerous elements
    const dangerous = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select'];
    dangerous.forEach(tag => {
        doc.querySelectorAll(tag).forEach(el => el.remove());
    });

    // Remove event handlers from all elements
    doc.querySelectorAll('*').forEach(el => {
        for (const attr of [...el.attributes]) {
            if (attr.name.startsWith('on') || attr.value.startsWith('javascript:')) {
                el.removeAttribute(attr.name);
            }
        }
    });

    return doc.body.innerHTML;
}

// ══════════════════════════════════════════════
// Utility: Escape text for safe insertion
// ══════════════════════════════════════════════
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ══════════════════════════════════════════════
// Utility: Relative time formatting
// ══════════════════════════════════════════════
function relativeTime(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp * 1000).toLocaleDateString();
}

function formatFullDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
}

// ══════════════════════════════════════════════
// Status Management
// ══════════════════════════════════════════════
function updateSystemStatus(status) {
    elements.statusLed.classList.remove('online', 'offline', 'loading');
    elements.statusLed.classList.add(CONFIG.STATUS[status].class);
    elements.statusText.textContent = CONFIG.STATUS[status].text;
}

const setOnline = () => updateSystemStatus('ONLINE');
const setOffline = () => updateSystemStatus('OFFLINE');
const setLoadingStatus = () => updateSystemStatus('LOADING');

// ══════════════════════════════════════════════
// Loading State
// ══════════════════════════════════════════════
let pageLoadingBar = null;

function showPageLoadingBar() {
    if (!pageLoadingBar) {
        pageLoadingBar = document.createElement('div');
        pageLoadingBar.className = 'page-loading-bar';
        document.body.appendChild(pageLoadingBar);
    }
}

function hidePageLoadingBar() {
    if (pageLoadingBar) {
        pageLoadingBar.remove();
        pageLoadingBar = null;
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        showPageLoadingBar();
        elements.loadingSpinner.classList.remove('hidden');
        elements.loadingSpinner.style.display = '';
        if (!elements.emailTable.querySelector('tr:not(.skeleton-row)')) {
            for (let i = 0; i < 3; i++) {
                const sk = document.createElement('tr');
                sk.className = 'skeleton-row';
                sk.innerHTML = '<td colspan="5"><div class="skeleton-cell"></div></td>';
                elements.emailTable.appendChild(sk);
            }
        }
    } else {
        hidePageLoadingBar();
        elements.loadingSpinner.classList.add('hidden');
        elements.loadingSpinner.style.display = 'none';
        elements.emailTable.querySelectorAll('.skeleton-row').forEach(r => r.remove());
    }
}

// ══════════════════════════════════════════════
// Session Timer
// ══════════════════════════════════════════════
let sessionTimerInterval;

function startSessionTimer() {
    if (!getStored(CONFIG.SESSION_START_KEY)) {
        setStored(CONFIG.SESSION_START_KEY, Date.now().toString());
    }
    elements.sessionTimer.style.display = '';

    clearInterval(sessionTimerInterval);
    sessionTimerInterval = setInterval(() => {
        const start = parseInt(getStored(CONFIG.SESSION_START_KEY) || Date.now());
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        elements.sessionTimerText.textContent = `${mins}:${secs}`;
    }, 1000);
}

// ══════════════════════════════════════════════
// Email Count Badge
// ══════════════════════════════════════════════
function updateEmailCount(count) {
    elements.countBadge.textContent = count;
    elements.deleteAllBtn.style.display = count > 0 ? '' : 'none';
    document.title = count > 0 ? `(${count}) TempMail` : 'TempMail — Disposable Email';

    // Animate badge when there are emails
    if (count > 0) {
        elements.countBadge.classList.add('has-mail');
    } else {
        elements.countBadge.classList.remove('has-mail');
    }
}

// ══════════════════════════════════════════════
// New Mail Detection
// ══════════════════════════════════════════════
function detectNewMails(emails) {
    if (!emails || emails.length === 0) return;

    const newMails = emails.filter(e => !knownMailIds.has(e.mail_id));

    if (newMails.length > 0 && knownMailIds.size > 0) {
        // New mail arrived!
        const count = newMails.length;
        toast(
            `${count} new email${count > 1 ? 's' : ''} received!`,
            'success',
            CONFIG.TOAST_DURATION_LONG
        );

        // Browser notification (if permitted)
        if (Notification.permission === 'granted') {
            new Notification('TempMail', {
                body: `${count} new email${count > 1 ? 's' : ''} received`,
                icon: 'images/temp-mail-icon.png'
            });
        }
    }

    // Update known IDs
    emails.forEach(e => knownMailIds.add(e.mail_id));
    setStored(CONFIG.KNOWN_IDS_KEY, JSON.stringify([...knownMailIds]));
}

// ══════════════════════════════════════════════
// API: Get Session
// ══════════════════════════════════════════════
async function getSession() {
    const response = await fetchWithTimeout(`${CONFIG.API_BASE}?f=get_email_address`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    sessionId = data.sid_token;
    currentEmail = data.email_addr;
    setStored(CONFIG.SESSION_KEY, sessionId);
    setStored(CONFIG.EMAIL_KEY, currentEmail);
    setOnline();
    return sessionId;
}

// ══════════════════════════════════════════════
// API: Generate Email
// ══════════════════════════════════════════════
async function genEmail() {
    try {
        setLoading(true);
        setLoadingStatus();

        if (!sessionId) {
            await getSession();
        }

        const randomStr = Math.random().toString(36).substring(2, 10);
        const selectedDomain = elements.domainSelect?.value;
        const domain = selectedDomain && selectedDomain !== 'random'
            ? selectedDomain
            : CONFIG.DOMAINS[Math.floor(Math.random() * CONFIG.DOMAINS.length)];

        const response = await fetchWithTimeout(`${CONFIG.API_BASE}?f=set_email_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `sid_token=${sessionId}&email_user=${randomStr}&domain=${domain}`
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        currentEmail = data.email_addr;
        setStored(CONFIG.EMAIL_KEY, currentEmail);
        elements.emailInput.value = currentEmail;

        // Reset known IDs and session timer for new address
        knownMailIds.clear();
        setStored(CONFIG.KNOWN_IDS_KEY, '[]');
        setStored(CONFIG.SESSION_START_KEY, Date.now().toString());
        startSessionTimer();

        await refreshMail();
        toast('New email address generated!', 'success');
        setOnline();
    } catch (error) {
        console.error('Error generating email:', error);
        toast(`Failed to generate email: ${error.message}`, 'error');
        clearStoredData();
        sessionId = '';
        setOffline();

        // Auto-retry once after delay
        setTimeout(() => {
            if (!sessionId) genEmail();
        }, CONFIG.RETRY_DELAY * 2);
    } finally {
        setLoading(false);
    }
}

// ══════════════════════════════════════════════
// Copy Email (with visual feedback)
// ══════════════════════════════════════════════
async function copyEmail() {
    const email = elements.emailInput.value;
    if (!email) {
        toast('No email address to copy', 'warning');
        return;
    }

    try {
        await navigator.clipboard.writeText(email);
    } catch {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }

    // Visual feedback: swap icon to checkmark
    if (elements.copyBtn && elements.copyIcon) {
        elements.copyBtn.classList.add('copied');
        elements.copyIcon.className = 'fa-solid fa-check';
        toast('Email copied to clipboard!', 'success');

        setTimeout(() => {
            elements.copyBtn.classList.remove('copied');
            elements.copyIcon.className = 'fa-solid fa-copy';
        }, 1500);
    } else {
        toast('Email copied to clipboard!', 'success');
    }
}

// ══════════════════════════════════════════════
// Refresh Emails
// ══════════════════════════════════════════════
async function refreshMail() {
    if (!currentEmail || !sessionId) return;

    try {
        setLoading(true);
        setLoadingStatus();
        elements.errorMessage.classList.add('hidden');

        const response = await fetchWithTimeout(
            `${CONFIG.API_BASE}?f=get_email_list&offset=0&sid_token=${sessionId}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const emails = data.list || [];

        // Cache emails
        setStored(CONFIG.EMAIL_CACHE_KEY, JSON.stringify(emails));

        // Detect new mails
        detectNewMails(emails);

        updateEmailTable(emails);
        updateEmailCount(emails.length);
        setOnline();
    } catch (error) {
        console.error('Error refreshing mail:', error);

        // Try cached emails
        const cached = getStored(CONFIG.EMAIL_CACHE_KEY);
        if (cached) {
            try {
                const emails = JSON.parse(cached);
                updateEmailTable(emails);
                updateEmailCount(emails.length);
                toast('Showing cached emails (offline)', 'warning');
            } catch { /* ignore parse errors */ }
        }

        if (error.message.includes('401') || error.message.includes('403')) {
            clearStoredData();
            sessionId = '';
            toast('Session expired. Click "New Address" to continue.', 'warning', CONFIG.TOAST_DURATION_LONG);
        }
        setOffline();
    } finally {
        setLoading(false);
    }
}

// ══════════════════════════════════════════════
// Update Email Table
// ══════════════════════════════════════════════
function updateEmailTable(emails) {
    elements.emailTable.innerHTML = '';
    const responsiveContainer = document.getElementById('emails-responsive');
    if (responsiveContainer) responsiveContainer.innerHTML = '';

    if (!emails || emails.length === 0) {
        // Empty state
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-inbox"></i></div>
                    <h4>No emails yet</h4>
                    <p>Emails sent to your address will appear here automatically</p>
                    <div class="empty-state-hint">
                        Press <kbd>R</kbd> to refresh or <kbd>N</kbd> for a new address
                    </div>
                </div>
            </td>
        `;
        elements.emailTable.appendChild(emptyRow);

        if (responsiveContainer) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = `
                <div class="empty-state-icon"><i class="fa-solid fa-inbox"></i></div>
                <h4>No emails yet</h4>
                <p>Emails sent to your address will appear here automatically</p>
                <div class="empty-state-hint">
                    Tap the <i class="fa-solid fa-plus" style="font-size:0.625rem"></i> button for quick actions
                </div>
            `;
            responsiveContainer.appendChild(emptyDiv);
            responsiveContainer.removeAttribute('hidden');
        }
        return;
    }

    emails.forEach(email => {
        const isNew = !knownMailIds.has(email.mail_id) || knownMailIds.size <= emails.length;
        const dateStr = formatFullDate(email.mail_timestamp);
        const relTime = relativeTime(email.mail_timestamp);
        const safeSubject = escapeHTML(email.mail_subject || '(No subject)');
        const safeFrom = escapeHTML(email.mail_from || 'Unknown');

        // Table row
        const row = document.createElement('tr');
        row.className = 'row-new';
        row.innerHTML = `
            <td>${escapeHTML(String(email.mail_id))}</td>
            <td title="${safeFrom}">${safeFrom}</td>
            <td title="${safeSubject}">${safeSubject}</td>
            <td title="${dateStr}">${relTime}</td>
            <td>
                <div class="email-actions">
                    <button onclick="viewEmail('${escapeHTML(String(email.mail_id))}')" class="icon-button" aria-label="View email" title="View">
                        <i class="fa-solid fa-eye" aria-hidden="true"></i>
                    </button>
                    <button onclick="deleteEmail('${escapeHTML(String(email.mail_id))}')" class="icon-button" aria-label="Delete email" title="Delete" style="color:var(--error)">
                        <i class="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        `;
        row.style.cursor = 'pointer';
        row.addEventListener('dblclick', () => viewEmail(email.mail_id));
        elements.emailTable.appendChild(row);

        // Responsive card
        if (responsiveContainer) {
            const card = document.createElement('div');
            card.className = 'email-card';
            card.innerHTML = `
                <div class="email-card-header">
                    <span>#${escapeHTML(String(email.mail_id))}</span>
                    <span title="${dateStr}">${relTime}</span>
                </div>
                <div class="email-card-subject">${safeSubject}</div>
                <div class="email-card-meta">
                    <i class="fa-solid fa-user"></i>
                    <span>${safeFrom}</span>
                </div>
                <div class="email-card-actions">
                    <button onclick="viewEmail('${escapeHTML(String(email.mail_id))}')" class="primary-button" aria-label="View">
                        <i class="fa-solid fa-eye" aria-hidden="true"></i> View
                    </button>
                    <button onclick="deleteEmail('${escapeHTML(String(email.mail_id))}')" class="icon-button" aria-label="Delete" style="color:var(--error)">
                        <i class="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            `;
            card.addEventListener('dblclick', () => viewEmail(email.mail_id));
            responsiveContainer.appendChild(card);
            responsiveContainer.removeAttribute('hidden');
        }
    });
}

// ══════════════════════════════════════════════
// View Email
// ══════════════════════════════════════════════
async function viewEmail(id) {
    if (!sessionId) {
        toast('No active session', 'warning');
        return;
    }

    try {
        setLoading(true);
        const response = await fetchWithTimeout(
            `${CONFIG.API_BASE}?f=fetch_email&email_id=${id}&sid_token=${sessionId}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const email = await response.json();
        showEmailModal(email);
    } catch (error) {
        console.error('Error viewing email:', error);
        toast('Failed to load email content', 'error');
    } finally {
        setLoading(false);
    }
}

// ══════════════════════════════════════════════
// Email Modal
// ══════════════════════════════════════════════
function showEmailModal(email) {
    const safeSubject = escapeHTML(email.mail_subject || '(No subject)');
    const safeFrom = escapeHTML(email.mail_from || 'Unknown');
    const safeBody = sanitizeHTML(email.mail_body || '<p>No content</p>');
    const dateStr = formatFullDate(email.mail_timestamp);

    const modal = document.createElement('div');
    modal.className = 'email-modal';

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    modal.innerHTML = `
        <div class="email-modal-content">
            <div class="modal-header">
                <h2>${safeSubject}</h2>
                <button class="close-btn" aria-label="Close email">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="modal-actions">
                <button onclick="navigator.clipboard.writeText(document.querySelector('.email-body').innerText).then(()=>toast('Email text copied!','success'))" title="Copy email text">
                    <i class="fa-solid fa-copy"></i> Copy Text
                </button>
                <button onclick="deleteEmail('${escapeHTML(String(email.mail_id))}'); this.closest('.email-modal').remove()" title="Delete this email">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
                <button onclick="window.print()" title="Print email">
                    <i class="fa-solid fa-print"></i> Print
                </button>
            </div>
            <div class="email-meta">
                <p><strong>From:</strong> ${safeFrom}</p>
                <p><strong>Date:</strong> ${dateStr}</p>
                <p><strong>To:</strong> ${escapeHTML(currentEmail)}</p>
            </div>
            <div class="email-body">
                ${safeBody}
            </div>
            ${email.mail_attachments?.length ? `
                <div class="attachments">
                    <h3><i class="fa-solid fa-paperclip"></i> Attachments (${email.mail_attachments.length})</h3>
                    <div class="attachment-list">
                        ${email.mail_attachments.map(att => `
                            <a href="#" onclick="event.preventDefault(); downloadAttachment('${escapeHTML(String(email.mail_id))}', '${escapeHTML(att.name)}')" class="attachment-link">
                                <i class="fa-solid fa-file-arrow-down"></i>
                                ${escapeHTML(att.name)}
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Close button
    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());

    document.body.appendChild(modal);

    // Close on ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    // Focus trap
    modal.querySelector('.close-btn').focus();
}

// ══════════════════════════════════════════════
// Download Attachment
// ══════════════════════════════════════════════
async function downloadAttachment(emailId, filename) {
    if (!sessionId) {
        toast('No active session', 'warning');
        return;
    }

    try {
        toast('Downloading attachment...', 'info');
        const response = await fetchWithTimeout(
            `${CONFIG.API_BASE}?f=fetch_attachment&email_id=${emailId}&sid_token=${sessionId}&file_name=${filename}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        a.remove();
        toast('Attachment downloaded!', 'success');
    } catch (error) {
        console.error('Error downloading attachment:', error);
        toast('Failed to download attachment', 'error');
    }
}

// ══════════════════════════════════════════════
// Delete Email
// ══════════════════════════════════════════════
async function deleteEmail(id) {
    if (!sessionId) {
        toast('No active session', 'warning');
        return;
    }

    try {
        const response = await fetchWithTimeout(
            `${CONFIG.API_BASE}?f=del_email&sid_token=${sessionId}&email_ids[]=${id}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        knownMailIds.delete(id);
        setStored(CONFIG.KNOWN_IDS_KEY, JSON.stringify([...knownMailIds]));

        await refreshMail();
        toast('Email deleted', 'success');
    } catch (error) {
        console.error('Error deleting email:', error);
        toast('Failed to delete email', 'error');
    }
}

// ══════════════════════════════════════════════
// Delete All Emails
// ══════════════════════════════════════════════
async function deleteAllEmails() {
    if (!sessionId) {
        toast('No active session', 'warning');
        return;
    }

    const ids = [...knownMailIds];
    if (ids.length === 0) {
        toast('No emails to delete', 'info');
        return;
    }

    try {
        const idsParam = ids.map(id => `email_ids[]=${id}`).join('&');
        const response = await fetchWithTimeout(
            `${CONFIG.API_BASE}?f=del_email&sid_token=${sessionId}&${idsParam}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        knownMailIds.clear();
        setStored(CONFIG.KNOWN_IDS_KEY, '[]');

        await refreshMail();
        toast('All emails deleted', 'success');
    } catch (error) {
        console.error('Error deleting all emails:', error);
        toast('Failed to delete all emails', 'error');
    }
}

// ══════════════════════════════════════════════
// Auto-refresh with Countdown + Progress Bar
// ══════════════════════════════════════════════
let refreshInterval;
let countdownInterval;
let countdownValue = 0;
let countdownTotal = 0;

function startCountdown(seconds) {
    clearInterval(countdownInterval);
    countdownValue = seconds;
    countdownTotal = seconds;
    updateCountdownDisplay();

    // Activate progress bar
    if (elements.countdownBarContainer) {
        elements.countdownBarContainer.classList.add('active');
    }
    updateCountdownBar();

    countdownInterval = setInterval(() => {
        countdownValue--;
        if (countdownValue <= 0) {
            countdownValue = seconds;
        }
        updateCountdownDisplay();
        updateCountdownBar();
    }, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    elements.countdown.textContent = '';
    // Hide progress bar
    if (elements.countdownBarContainer) {
        elements.countdownBarContainer.classList.remove('active');
    }
}

function updateCountdownDisplay() {
    if (elements.countdown) {
        elements.countdown.textContent = `${countdownValue}s`;
    }
}

function updateCountdownBar() {
    if (elements.countdownBar && countdownTotal > 0) {
        const percent = (countdownValue / countdownTotal) * 100;
        elements.countdownBar.style.width = `${percent}%`;
    }
}

function loadAutoRefreshSettings() {
    const autoRefresh = getStored(CONFIG.AUTO_REFRESH_KEY) === 'true';
    const interval = getStored(CONFIG.REFRESH_INTERVAL_KEY) || '30';

    elements.autoRefreshCheckbox.checked = autoRefresh;
    elements.refreshIntervalSelect.value = interval;

    if (autoRefresh) {
        const secs = parseInt(interval);
        refreshInterval = setInterval(refreshMail, secs * 1000);
        startCountdown(secs);
    }
}

elements.autoRefreshCheckbox.addEventListener('change', function (e) {
    setStored(CONFIG.AUTO_REFRESH_KEY, e.target.checked);
    if (e.target.checked) {
        const secs = parseInt(elements.refreshIntervalSelect.value);
        refreshInterval = setInterval(refreshMail, secs * 1000);
        startCountdown(secs);
        toast('Auto-refresh enabled', 'info');
    } else {
        clearInterval(refreshInterval);
        stopCountdown();
        toast('Auto-refresh disabled', 'info');
    }
});

elements.refreshIntervalSelect.addEventListener('change', function (e) {
    setStored(CONFIG.REFRESH_INTERVAL_KEY, e.target.value);
    if (elements.autoRefreshCheckbox.checked) {
        clearInterval(refreshInterval);
        const secs = parseInt(e.target.value);
        refreshInterval = setInterval(refreshMail, secs * 1000);
        startCountdown(secs);
    }
});

// ══════════════════════════════════════════════
// Search with Debounce
// ══════════════════════════════════════════════
const performSearch = debounce((searchTerm) => {
    const term = searchTerm.toLowerCase();

    // Search table rows
    document.querySelectorAll('#emails tbody tr').forEach(row => {
        if (row.querySelector('.empty-state')) return;
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });

    // Search responsive cards
    document.querySelectorAll('#emails-responsive .email-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? '' : 'none';
    });
}, CONFIG.SEARCH_DEBOUNCE);

elements.emailSearch.addEventListener('input', (e) => performSearch(e.target.value));

// ══════════════════════════════════════════════
// Keyboard Shortcuts
// ══════════════════════════════════════════════
const shortcuts = [
    { key: 'r', label: 'Refresh inbox', action: () => refreshMail() },
    { key: 'n', label: 'New address', action: () => genEmail() },
    { key: 'c', label: 'Copy email', action: () => copyEmail() },
    { key: '/', label: 'Focus search', action: () => { elements.emailSearch.focus(); } },
    { key: '?', label: 'Show shortcuts', action: () => showShortcuts() },
];

document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (e.key === 'Escape') e.target.blur();
        return;
    }

    // Don't trigger with modifier keys (except Shift for ?)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    const shortcut = shortcuts.find(s => s.key === e.key);
    if (shortcut) {
        e.preventDefault();
        shortcut.action();
    }
});

function showShortcuts() {
    // Remove existing shortcut overlay
    document.querySelector('.shortcuts-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.className = 'shortcuts-overlay';
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });

    overlay.innerHTML = `
        <div class="shortcuts-content">
            <h3><i class="fa-solid fa-keyboard"></i> Keyboard Shortcuts</h3>
            <div class="shortcut-list">
                ${shortcuts.map(s => `
                    <div class="shortcut-item">
                        <span>${s.label}</span>
                        <kbd>${s.key === '?' ? 'Shift + /' : s.key}</kbd>
                    </div>
                `).join('')}
                <div class="shortcut-item">
                    <span>Close modal / blur</span>
                    <kbd>Esc</kbd>
                </div>
            </div>
            <button class="shortcut-close" onclick="this.closest('.shortcuts-overlay').remove()">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close on ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ══════════════════════════════════════════════
// Request Notification Permission
// ══════════════════════════════════════════════
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        // Delay the request to avoid being intrusive
        setTimeout(() => {
            Notification.requestPermission();
        }, 10000);
    }
}

// ══════════════════════════════════════════════
// Initialization
// ══════════════════════════════════════════════
let initAttempts = 0;
const MAX_INIT_ATTEMPTS = 5;
let initializing = false;

async function initializeApp() {
    if (initializing) return;
    initializing = true;
    setLoadingStatus();

    try {
        if (currentEmail && sessionId) {
            elements.emailInput.value = currentEmail;
            startSessionTimer();
            await refreshMail();
        } else {
            await genEmail();
        }
        setOnline();
        requestNotificationPermission();
    } catch (e) {
        initAttempts++;
        console.warn(`Init attempt ${initAttempts} failed:`, e.message);
        if (initAttempts < MAX_INIT_ATTEMPTS) {
            const delay = CONFIG.RETRY_DELAY + initAttempts * 1500;
            toast(`Retrying connection... (${initAttempts}/${MAX_INIT_ATTEMPTS})`, 'warning');
            setTimeout(() => {
                initializing = false;
                initializeApp();
            }, delay);
        } else {
            setOffline();
            toast('Connection failed. Click "New Address" to try again.', 'error', CONFIG.TOAST_DURATION_LONG);
        }
    } finally {
        initializing = false;
        setLoading(false);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadAutoRefreshSettings();
    initializeApp();
});

// Periodic reconnect when offline
setInterval(() => {
    if (elements.statusLed.classList.contains('offline') && !initializing && !sessionId) {
        initializeApp();
    }
}, 20000);

// ══════════════════════════════════════════════
// Visibility API — pause/resume when tab hidden
// ══════════════════════════════════════════════
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && currentEmail && sessionId) {
        // Refresh when tab becomes visible again
        refreshMail();
    }
});

// ══════════════════════════════════════════════
// Global Exports
// ══════════════════════════════════════════════
window.genEmail = genEmail;
window.copyEmail = copyEmail;
window.refreshMail = refreshMail;
window.viewEmail = viewEmail;
window.deleteEmail = deleteEmail;
window.deleteAllEmails = deleteAllEmails;
window.downloadAttachment = downloadAttachment;
window.showShortcuts = showShortcuts;
window.toast = toast;
