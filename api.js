import CONFIG from './config.js';

// State management with localStorage
const getStoredEmail = () => localStorage.getItem(CONFIG.EMAIL_KEY);
const getStoredSession = () => localStorage.getItem(CONFIG.SESSION_KEY);
const setStoredEmail = (email) => localStorage.setItem(CONFIG.EMAIL_KEY, email);
const setStoredSession = (sid) => localStorage.setItem(CONFIG.SESSION_KEY, sid);
const clearStoredData = () => {
    localStorage.removeItem(CONFIG.EMAIL_KEY);
    localStorage.removeItem(CONFIG.SESSION_KEY);
};

// Initialize state from localStorage
let currentEmail = getStoredEmail() || '';
let sessionId = getStoredSession() || '';

// DOM Elements
const elements = {
    emailInput: document.getElementById('addr'),
    emailTable: document.getElementById('emails').querySelector('tbody'),
    loadingSpinner: document.getElementById('loading-spinner'),
    errorMessage: document.getElementById('error-message'),
    autoRefreshCheckbox: document.getElementById('auto-refresh'),
    refreshIntervalSelect: document.getElementById('refresh-interval'),
    emailSearch: document.getElementById('email-search')
};

// Error handling
function showError(message, isSuccess = false) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.errorMessage.style.backgroundColor = isSuccess ? '#DEF7EC' : '#FEE2E2';
    elements.errorMessage.style.color = isSuccess ? '#03543F' : '#DC2626';
    
    setTimeout(() => {
        elements.errorMessage.classList.add('hidden');
    }, 3000);
}

// Loading state
function setLoading(isLoading) {
    if (isLoading) {
        elements.loadingSpinner.classList.remove('hidden');
    } else {
        elements.loadingSpinner.classList.add('hidden');
    }
}

// Get session ID
async function getSession() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}?f=get_email_address`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        sessionId = data.sid_token;
        currentEmail = data.email_addr;
        setStoredSession(sessionId);
        setStoredEmail(currentEmail);
        return sessionId;
    } catch (error) {
        console.error('Error getting session:', error);
        throw error;
    }
}

// Generate random email
async function genEmail() {
    try {
        setLoading(true);
        
        // Get new session if needed
        if (!sessionId) {
            await getSession();
        }

        // Generate random email address
        const randomStr = Math.random().toString(36).substring(2, 8);
        const domain = CONFIG.DOMAINS[Math.floor(Math.random() * CONFIG.DOMAINS.length)];
        
        const response = await fetch(`${CONFIG.API_BASE}?f=set_email_user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `sid_token=${sessionId}&email_user=${randomStr}&domain=${domain}`
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        currentEmail = data.email_addr;
        setStoredEmail(currentEmail);
        elements.emailInput.value = currentEmail;
        await refreshMail();
        showError('New email address generated!', true);
    } catch (error) {
        console.error('Error generating email:', error);
        showError(`Failed to generate new email address: ${error.message}`);
        clearStoredData();
        sessionId = '';
        
        // Retry after delay
        setTimeout(genEmail, CONFIG.RETRY_DELAY);
    } finally {
        setLoading(false);
    }
}

// Copy email to clipboard
async function copyEmail() {
    const email = elements.emailInput.value;
    if (!email) {
        showError('No email address to copy');
        return;
    }

    try {
        await navigator.clipboard.writeText(email);
        showError('Email copied to clipboard!', true);
    } catch (error) {
        showError('Failed to copy email: ' + error.message);
    }
}

// Refresh emails
async function refreshMail() {
    if (!currentEmail || !sessionId) {
        showError('No active email session');
        return;
    }
    
    try {
        setLoading(true);
        elements.errorMessage.classList.add('hidden');

        const response = await fetch(`${CONFIG.API_BASE}?f=get_email_list&offset=0&sid_token=${sessionId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateEmailTable(data.list);
    } catch (error) {
        console.error('Error refreshing mail:', error);
        showError('Failed to fetch emails');
        if (error.message.includes('401')) {
            clearStoredData();
            sessionId = '';
        }
    } finally {
        setLoading(false);
    }
}

// Update email table
function updateEmailTable(emails) {
    elements.emailTable.innerHTML = '';
    
    if (!emails || emails.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="5" class="text-center">No emails found</td>';
        elements.emailTable.appendChild(emptyRow);
        return;
    }

    emails.forEach(email => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${email.mail_id}</td>
            <td>${email.mail_from}</td>
            <td>${email.mail_subject}</td>
            <td>${new Date(email.mail_timestamp * 1000).toLocaleString()}</td>
            <td>
                <div class="email-actions">
                    <button onclick="viewEmail('${email.mail_id}')" class="icon-button" title="View">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button onclick="deleteEmail('${email.mail_id}')" class="icon-button" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        elements.emailTable.appendChild(row);
    });
}

// View email content
async function viewEmail(id) {
    if (!sessionId) {
        showError('No active session');
        return;
    }

    try {
        setLoading(true);
        const response = await fetch(`${CONFIG.API_BASE}?f=fetch_email&email_id=${id}&sid_token=${sessionId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const email = await response.json();
        showEmailModal(email);
    } catch (error) {
        console.error('Error viewing email:', error);
        showError('Failed to load email content');
    } finally {
        setLoading(false);
    }
}

// Show email modal
function showEmailModal(email) {
    const modal = document.createElement('div');
    modal.className = 'email-modal';
    modal.innerHTML = `
        <div class="email-modal-content">
            <button class="close-btn" onclick="this.closest('.email-modal').remove()">
                <i class="fa-solid fa-times"></i>
            </button>
            <h2>${email.mail_subject}</h2>
            <div class="email-meta">
                <p><strong>From:</strong> ${email.mail_from}</p>
                <p><strong>Date:</strong> ${new Date(email.mail_timestamp * 1000).toLocaleString()}</p>
            </div>
            <div class="email-body">
                ${email.mail_body}
            </div>
            ${email.mail_attachments?.length ? `
                <div class="attachments">
                    <h3>Attachments</h3>
                    <div class="attachment-list">
                        ${email.mail_attachments.map(att => `
                            <a href="#" onclick="downloadAttachment('${email.mail_id}', '${att.name}')" class="attachment-link">
                                <i class="fa-solid fa-paperclip"></i>
                                ${att.name}
                            </a>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    document.body.appendChild(modal);
}

// Download attachment
async function downloadAttachment(emailId, filename) {
    if (!sessionId) {
        showError('No active session');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}?f=fetch_attachment&email_id=${emailId}&sid_token=${sessionId}&file_name=${filename}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Error downloading attachment:', error);
        showError('Failed to download attachment');
    }
}

// Delete email
async function deleteEmail(id) {
    if (!sessionId) {
        showError('No active session');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}?f=del_email&sid_token=${sessionId}&email_ids[]=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        refreshMail();
        showError('Email deleted successfully!', true);
    } catch (error) {
        console.error('Error deleting email:', error);
        showError('Failed to delete email');
    }
}

// Auto refresh functionality
let refreshInterval;

// Load saved auto-refresh settings
const loadAutoRefreshSettings = () => {
    const autoRefresh = localStorage.getItem(CONFIG.AUTO_REFRESH_KEY) === 'true';
    const interval = localStorage.getItem(CONFIG.REFRESH_INTERVAL_KEY) || '30';
    
    elements.autoRefreshCheckbox.checked = autoRefresh;
    elements.refreshIntervalSelect.value = interval;
    
    if (autoRefresh) {
        refreshInterval = setInterval(refreshMail, interval * 1000);
    }
};

elements.autoRefreshCheckbox.addEventListener('change', function(e) {
    localStorage.setItem(CONFIG.AUTO_REFRESH_KEY, e.target.checked);
    if (e.target.checked) {
        const interval = elements.refreshIntervalSelect.value;
        refreshInterval = setInterval(refreshMail, interval * 1000);
    } else {
        clearInterval(refreshInterval);
    }
});

elements.refreshIntervalSelect.addEventListener('change', function(e) {
    localStorage.setItem(CONFIG.REFRESH_INTERVAL_KEY, e.target.value);
    if (elements.autoRefreshCheckbox.checked) {
        clearInterval(refreshInterval);
        refreshInterval = setInterval(refreshMail, e.target.value * 1000);
    }
});

// Search functionality
elements.emailSearch.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#emails tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
    loadAutoRefreshSettings();
    if (currentEmail && sessionId) {
        elements.emailInput.value = currentEmail;
        refreshMail();
    } else {
        await genEmail();
    }
});

// Export functions for global access
window.genEmail = genEmail;
window.copyEmail = copyEmail;
window.refreshMail = refreshMail;
window.viewEmail = viewEmail;
window.deleteEmail = deleteEmail;
window.downloadAttachment = downloadAttachment;
