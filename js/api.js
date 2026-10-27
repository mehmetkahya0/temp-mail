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

// ══════════════════════════════════════════════
// Localization (EN/TR Switcher & Translation Engine)
// ══════════════════════════════════════════════
const TRANSLATIONS = {
    EN: {
        doc_title: "TempMail — Disposable Email",
        header_subtitle: "Instant disposable email addresses. No signup, no hassle.",
        status_online: "Online",
        status_offline: "Offline",
        status_syncing: "Syncing",
        badge_instant: "Instant",
        badge_private: "Private",
        generating_email: "Generating email address...",
        aria_email_address: "Your temporary email address",
        custom_username: "Custom Username",
        tooltip_custom_name: "Custom Name",
        show_qrcode: "Show QR Code",
        tooltip_qrcode: "QR Code",
        copy_email: "Copy email address",
        tooltip_copy: "Copy",
        domain_label: "Domain:",
        aria_select_domain: "Select email domain",
        domain_random: "Random",
        tooltip_refresh_btn: "Refresh inbox",
        tooltip_refresh: "Refresh (R)",
        btn_refresh: "Refresh",
        tooltip_new_btn: "Generate new address",
        tooltip_new: "New (N)",
        btn_new: "New Address",
        auto_refresh_label: "Auto",
        aria_refresh_interval: "Auto-refresh interval",
        search_placeholder: "Search emails by subject, sender...",
        aria_search_emails: "Search emails",
        inbox_label: "Inbox",
        tooltip_clear_all: "Delete all emails",
        btn_clear_all: "Clear All",
        table_id: "ID",
        table_from: "From",
        table_subject: "Subject",
        table_date: "Date",
        table_actions: "Actions",
        footer_credits: "Mehmet Kahya — 2025-2026 — TempMail v5.0 — ",
        footer_release: "October 2026 release",
        hero_title: "Your inbox, <em>off the record.</em>",
        hero_sub: "Sign up anywhere without exposing your real email.",
        hero_address_label: "Your address",
        aria_send_email: "Send email",
        aria_github_profile: "GitHub profile",
        aria_linkedin_profile: "LinkedIn profile",
        btn_disclaimer: "Disclaimer",
        btn_privacy: "Privacy Policy",
        welcome_header: "Welcome to TempMail",
        welcome_p1: "Your temporary email address is being generated. Use it to sign up for services without revealing your real email.",
        welcome_tips_header: "Tips:",
        welcome_tip1: "Press <kbd>?</kbd> to see keyboard shortcuts",
        welcome_tip2: "Enable auto-refresh to get emails instantly",
        welcome_tip3: "Click \"New Address\" if loading fails",
        welcome_tip4: "Press <kbd>⌘K</kbd> to open the command palette",
        cmd_hint: "Search",
        welcome_p3: "Thank you for using this project! ❤️",
        btn_got_it: "Got it!",
        tooltip_shortcuts: "Keyboard shortcuts",
        shortcut_hint_text: "Shortcuts",
        aria_scroll_top: "Scroll to top",
        aria_quick_actions: "Quick actions",
        empty_title: "No emails yet",
        empty_desc: "Emails sent to your address will appear here automatically",
        empty_hint_desktop: "Press R to refresh or N for a new address",
        empty_hint_mobile: "Tap the + button for quick actions",
        shortcut_refresh: "Refresh inbox",
        shortcut_new: "New address",
        shortcut_copy: "Copy email",
        shortcut_search: "Focus search",
        shortcut_help: "Show shortcuts",

        // V4 Keys
        cmd_palette_placeholder: "Type a command or search...",
        cmd_palette_action: "Action",
        cmd_palette_settings: "Settings",
        cmd_palette_navigation: "Navigation",
        tab_mailbox_name: "Mailbox",
        tab_add_new: "New Mailbox",
        filter_all: "All",
        filter_starred: "Starred",
        filter_verification: "Verifications",
        tag_verification: "Verification",
        tag_testing: "Testing",
        tag_marketing: "Marketing",
        tag_security: "Security",
        toast_mailbox_limit: "Maximum limit of 5 mailboxes reached!",
        toast_mailbox_deleted: "Mailbox deleted!",
        toast_command_palette: "Command Palette opened!",

        // Phase 1 Keys
        toast_code_copied: "Code copied",
        toast_no_code: "No verification code found",
        toast_notif_denied: "Notifications are blocked in your browser",
        toast_notif_enabled: "Desktop notifications enabled",
        toast_copy_failed: "Couldn't copy to clipboard",
        btn_copy_code: "Copy code",
        btn_open_verify_link: "Open verification link",
        cmd_copy_latest_code: "Copy latest code",
        cmd_enable_notifications: "Enable desktop notifications",
        expires_in: "Deletes in {m} min",
        label_verification_code: "Verification code",

        // Phase 2 Keys
        filter_unread: "Unread",
        tooltip_history: "Address history",
        history_title: "Recent addresses",
        history_hint: "Reopen an address you used before. Mails older than 60 minutes are already gone.",
        history_empty: "No addresses yet",
        btn_use: "Use",
        label_current: "Current",
        toast_address_restored: "Address restored",
        cmd_address_history: "Address history",
        shortcut_next: "Next email",
        shortcut_prev: "Previous email",
        shortcut_open: "Open email",
        shortcut_star: "Star email",
        shortcut_delete: "Delete email",
        btn_close: "Close",
        btn_remove: "Remove",
        btn_star: "Star",
        close_email_title: "Close email",
        btn_copy_text: "Copy Text",
        copy_text_title: "Copy email text",
        btn_save_eml: "Save EML",
        save_eml_title: "Save as EML file",
        btn_delete: "Delete",
        delete_email_title: "Delete this email",
        btn_print: "Print",
        print_email_title: "Print email",
        label_from: "From:",
        label_date: "Date:",
        label_to: "To:",
        label_attachments: "Attachments",
        msg_no_subject: "(No subject)",
        msg_unknown_sender: "Unknown",
        msg_no_content: "No content",
        empty_unread_title: "No unread emails",
        empty_unread_desc: "You're all caught up",

        // Phase 3 Keys
        cmd_install_app: "Install app",

        // Phase 4 Keys
        shield_blocked: "{n} remote images blocked to protect your privacy",
        shield_blocked_one: "1 remote image blocked to protect your privacy",
        btn_show_images: "Show images",
        btn_always_show_images: "Always show",
        cmd_toggle_images_on: "Block remote images",
        cmd_toggle_images_off: "Always load remote images",
        toast_images_setting_on: "Remote images will always load",
        toast_images_setting_off: "Remote images are blocked",
        link_warning_title: "Check this link",
        link_warning_desc: "This link looks suspicious. It actually goes to:",
        btn_open_anyway: "Open anyway",
        btn_cancel: "Cancel",

        // Toasts
        'No email address to copy': 'No email address to copy',
        'Email copied to clipboard!': 'Email copied to clipboard!',
        'Email text copied!': 'Email text copied!',
        toast_text_copied: "Email text copied",
        'No active session': 'No active session',
        'Failed to load email content': 'Failed to load email content',
        'Downloading attachment...': 'Downloading attachment...',
        'Attachment downloaded!': 'Attachment downloaded!',
        'Failed to download attachment': 'Failed to download attachment',
        'Email deleted': 'Email deleted',
        'Failed to delete email': 'Failed to delete email',
        'No emails to delete': 'No emails to delete',
        'All emails deleted': 'All emails deleted',
        'Failed to delete all emails': 'Failed to delete all emails',
        'Auto-refresh enabled': 'Auto-refresh enabled',
        'Auto-refresh disabled': 'Auto-refresh disabled',
        'Username cannot be empty': 'Username cannot be empty',
        'Username must be at least 3 characters': 'Username must be at least 3 characters',
        'Username must be alphanumeric (letters and numbers only)': 'Username must be alphanumeric (letters and numbers only)',
        'Generate an email first!': 'Generate an email first!',
        'Downloading QR code...': 'Downloading QR code...',
        'QR Code downloaded successfully!': 'QR Code downloaded successfully!',
        'Failed to download QR code. Try right clicking the image and saving.': 'Failed to download QR code. Try right clicking the image and saving.',
        'EML file downloaded!': 'EML file downloaded!',
        'Custom email address generated!': 'Custom email address generated!',
        'New email address generated!': 'New email address generated!',
        'Showing cached emails (offline)': 'Showing cached emails (offline)',
        'Session expired. Click "New Address" to continue.': 'Session expired. Click "New Address" to continue.',
        'Connection failed. Click "New Address" to try again.': 'Connection failed. Click "New Address" to try again.',
    },
    TR: {
        doc_title: "TempMail — Geçici E-posta",
        header_subtitle: "Anında geçici e-posta adresleri. Kayıt yok, zahmet yok.",
        status_online: "Çevrimiçi",
        status_offline: "Çevrimdışı",
        status_syncing: "Eşitleniyor",
        badge_instant: "Anında",
        badge_private: "Gizli",
        generating_email: "E-posta adresi oluşturuluyor...",
        aria_email_address: "Geçici e-posta adresiniz",
        custom_username: "Özel Kullanıcı Adı",
        tooltip_custom_name: "Özel Ad",
        show_qrcode: "QR Kodunu Göster",
        tooltip_qrcode: "QR Kodu",
        copy_email: "E-posta adresini kopyala",
        tooltip_copy: "Kopyala",
        domain_label: "Alan Adı:",
        aria_select_domain: "E-posta alan adını seçin",
        domain_random: "Rastgele",
        tooltip_refresh_btn: "Gelen kutusunu yenile",
        tooltip_refresh: "Yenile (R)",
        btn_refresh: "Yenile",
        tooltip_new_btn: "Yeni adres oluştur",
        tooltip_new: "Yeni (N)",
        btn_new: "Yeni Adres",
        auto_refresh_label: "Oto",
        aria_refresh_interval: "Otomatik yenileme sıklığı",
        search_placeholder: "E-postaları konuya, gönderene göre ara...",
        aria_search_emails: "E-postaları ara",
        inbox_label: "Gelen Kutusu",
        tooltip_clear_all: "Tüm e-postaları sil",
        btn_clear_all: "Hepsini Sil",
        table_id: "ID",
        table_from: "Kimden",
        table_subject: "Konu",
        table_date: "Tarih",
        table_actions: "İşlemler",
        footer_credits: "Mehmet Kahya — 2025-2026 — TempMail v5.0 — ",
        footer_release: "Ekim 2026 sürümü",
        hero_title: "Gelen kutun, <em>kayıt dışı.</em>",
        hero_sub: "Gerçek e-postanı paylaşmadan istediğin yere kaydol.",
        hero_address_label: "Adresin",
        aria_send_email: "E-posta gönder",
        aria_github_profile: "GitHub profili",
        aria_linkedin_profile: "LinkedIn profili",
        btn_disclaimer: "Sorumluluk Reddi",
        btn_privacy: "Gizlilik Politikası",
        welcome_header: "TempMail'e Hoş Geldiniz",
        welcome_p1: "Geçici e-posta adresiniz oluşturuluyor. Gerçek e-postanızı açıklamadan hizmetlere kaydolmak için kullanın.",
        welcome_tips_header: "İpuçları:",
        welcome_tip1: "Klavye kısayollarını görmek için <kbd>?</kbd> tuşuna basın",
        welcome_tip2: "E-postaları anında almak için otomatik yenilemeyi etkinleştirin",
        welcome_tip3: "Yükleme başarısız olursa \"Yeni Adres\"e tıklayın",
        welcome_tip4: "Komut paletini açmak için <kbd>⌘K</kbd> tuşuna basın",
        cmd_hint: "Ara",
        welcome_p3: "Bu projeyi kullandığınız için teşekkürler! ❤️",
        btn_got_it: "Anladım!",
        tooltip_shortcuts: "Klavye kısayolları",
        shortcut_hint_text: "Kısayollar",
        aria_scroll_top: "Yukarı kaydır",
        aria_quick_actions: "Hızlı işlemler",
        empty_title: "Henüz e-posta yok",
        empty_desc: "Adresinize gönderilen e-postalar otomatik olarak burada görünecektir",
        empty_hint_desktop: "Yenilemek için R veya yeni adres için N tuşuna basın",
        empty_hint_mobile: "Hızlı işlemler için + düğmesine dokunun",
        shortcut_refresh: "Gelen kutusunu yenile",
        shortcut_new: "Yeni adres",
        shortcut_copy: "E-postayı kopyala",
        shortcut_search: "Aramaya odaklan",
        shortcut_help: "Kısayolları göster",

        // V4 Keys
        cmd_palette_placeholder: "Bir komut yazın veya arayın...",
        cmd_palette_action: "Eylem",
        cmd_palette_settings: "Ayarlar",
        cmd_palette_navigation: "Gezinti",
        tab_mailbox_name: "Posta Kutusu",
        tab_add_new: "Yeni Kutu",
        filter_all: "Tümü",
        filter_starred: "Yıldızlı",
        filter_verification: "Doğrulamalar",
        tag_verification: "Doğrulama",
        tag_testing: "Test",
        tag_marketing: "Bülten",
        tag_security: "Güvenlik",
        toast_mailbox_limit: "Maksimum 5 posta kutusu sınırına ulaşıldı!",
        toast_mailbox_deleted: "Posta kutusu silindi!",
        toast_command_palette: "Komut Paleti açıldı!",

        // Phase 1 Keys
        toast_code_copied: "Kod kopyalandı",
        toast_no_code: "Doğrulama kodu bulunamadı",
        toast_notif_denied: "Bildirimler tarayıcında engelli",
        toast_notif_enabled: "Masaüstü bildirimleri açık",
        toast_copy_failed: "Panoya kopyalanamadı",
        btn_copy_code: "Kodu kopyala",
        btn_open_verify_link: "Doğrulama linkini aç",
        cmd_copy_latest_code: "Son kodu kopyala",
        cmd_enable_notifications: "Masaüstü bildirimlerini aç",
        expires_in: "{m} dk sonra silinecek",
        label_verification_code: "Doğrulama kodu",

        // Phase 2 Keys
        filter_unread: "Okunmamış",
        tooltip_history: "Adres geçmişi",
        history_title: "Son adresler",
        history_hint: "Daha önce kullandığın bir adrese dön. 60 dakikadan eski mailler silinmiş olur.",
        history_empty: "Henüz adres yok",
        btn_use: "Kullan",
        label_current: "Şu an",
        toast_address_restored: "Adres geri yüklendi",
        cmd_address_history: "Adres geçmişi",
        shortcut_next: "Sonraki e-posta",
        shortcut_prev: "Önceki e-posta",
        shortcut_open: "E-postayı aç",
        shortcut_star: "E-postayı yıldızla",
        shortcut_delete: "E-postayı sil",
        btn_close: "Kapat",
        btn_remove: "Kaldır",
        btn_star: "Yıldızla",
        close_email_title: "E-postayı kapat",
        btn_copy_text: "Metni Kopyala",
        copy_text_title: "E-posta metnini kopyala",
        btn_save_eml: "EML Kaydet",
        save_eml_title: "EML dosyası olarak kaydet",
        btn_delete: "Sil",
        delete_email_title: "Bu e-postayı sil",
        btn_print: "Yazdır",
        print_email_title: "E-postayı yazdır",
        label_from: "Kimden:",
        label_date: "Tarih:",
        label_to: "Kime:",
        label_attachments: "Ekler",
        msg_no_subject: "(Konu yok)",
        msg_unknown_sender: "Bilinmeyen",
        msg_no_content: "İçerik yok",
        empty_unread_title: "Okunmamış e-posta yok",
        empty_unread_desc: "Her şeyi okumuşsun",

        // Phase 3 Keys
        cmd_install_app: "Uygulamayı yükle",

        // Phase 4 Keys
        shield_blocked: "Gizliliğin için {n} uzak görsel engellendi",
        shield_blocked_one: "Gizliliğin için 1 uzak görsel engellendi",
        btn_show_images: "Görselleri göster",
        btn_always_show_images: "Her zaman göster",
        cmd_toggle_images_on: "Uzak görselleri engelle",
        cmd_toggle_images_off: "Uzak görselleri hep yükle",
        toast_images_setting_on: "Uzak görseller artık hep yüklenecek",
        toast_images_setting_off: "Uzak görseller engelleniyor",
        link_warning_title: "Bu linki kontrol et",
        link_warning_desc: "Bu link şüpheli görünüyor. Aslında şuraya gidiyor:",
        btn_open_anyway: "Yine de aç",
        btn_cancel: "Vazgeç",

        // Toasts
        'No email address to copy': 'Kopyalanacak e-posta adresi yok',
        'Email copied to clipboard!': 'E-posta panoya kopyalandı!',
        'Email text copied!': 'E-posta içeriği kopyalandı!',
        toast_text_copied: "E-posta metni kopyalandı",
        'No active session': 'Aktif oturum bulunamadı',
        'Failed to load email content': 'E-posta içeriği yüklenemedi',
        'Downloading attachment...': 'Ek indiriliyor...',
        'Attachment downloaded!': 'Ek başarıyla indirildi!',
        'Failed to download attachment': 'Ek indirilemedi',
        'Email deleted': 'E-posta silindi',
        'Failed to delete email': 'E-posta silinemedi',
        'No emails to delete': 'Silinecek e-posta yok',
        'All emails deleted': 'Tüm e-postalar silindi',
        'Failed to delete all emails': 'Tüm e-postalar silinemedi',
        'Auto-refresh enabled': 'Otomatik yenileme aktif',
        'Auto-refresh disabled': 'Otomatik yenileme pasif',
        'Username cannot be empty': 'Kullanıcı adı boş olamaz',
        'Username must be at least 3 characters': 'Kullanıcı adı en az 3 karakter olmalıdır',
        'Username must be alphanumeric (letters and numbers only)': 'Kullanıcı adı sadece harf ve rakamlardan oluşmalıdır',
        'Generate an email first!': 'Önce bir e-posta adresi oluşturun!',
        'Downloading QR code...': 'QR kodu indiriliyor...',
        'QR Code downloaded successfully!': 'QR Kodu başarıyla indirildi!',
        'Failed to download QR code. Try right clicking the image and saving.': 'QR kodu indirilemedi. Resme sağ tıklayıp kaydetmeyi deneyin.',
        'EML file downloaded!': 'EML file downloaded!',
        'Custom email address generated!': 'Özel e-posta adresi oluşturuldu!',
        'New email address generated!': 'Yeni e-posta adresi oluşturuldu!',
        'Showing cached emails (offline)': 'Önbellekteki e-postalar gösteriliyor (çevrimdışı)',
        'Session expired. Click "New Address" to continue.': 'Oturum süresi doldu. Devam etmek için "Yeni Adres"e tıklayın.',
        'Connection failed. Click "New Address" to try again.': 'Bağlantı başarısız. Tekrar denemek için "Yeni Adres"e tıklayın.',
    }
};

let currentLanguage = localStorage.getItem('temp_mail_lang') || 'EN';

function t(key) {
    const lang = currentLanguage;
    const isTr = lang === 'TR';

    if (typeof key === 'string') {
        if (key.startsWith('Retrying connection...')) {
            const m = key.match(/\((\d+)\/(\d+)\)/);
            if (m) {
                return isTr ? `Bağlantı yeniden deneniyor... (${m[1]}/${m[2]})` : key;
            }
        }
        if (key.startsWith('Failed to generate email:')) {
            const rest = key.substring('Failed to generate email:'.length);
            return isTr ? `E-posta oluşturulamadı:${rest}` : key;
        }
    }

    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS['EN'] && TRANSLATIONS['EN'][key]) {
        return TRANSLATIONS['EN'][key];
    }
    return key;
}

function updateUILanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('temp_mail_lang', lang);

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const flag = lang === 'TR' ? '🇹🇷' : '🇺🇸';
        const label = lang === 'TR' ? 'TR' : 'EN';
        langToggle.querySelector('.lang-icon').textContent = flag;
        langToggle.querySelector('.lang-text').textContent = label;
        langToggle.setAttribute('data-tooltip', lang === 'TR' ? 'English' : 'Türkçe');
        langToggle.setAttribute('aria-label', lang === 'TR' ? 'Switch to English' : 'Türkçe\'ye geç');
    }

    document.documentElement.lang = lang.toLowerCase();
    document.title = t('doc_title');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerHTML = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        el.setAttribute('title', t(key));
    });

    document.querySelectorAll('[data-i18n-tooltip]').forEach(el => {
        const key = el.getAttribute('data-i18n-tooltip');
        el.setAttribute('data-tooltip', t(key));
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        el.setAttribute('aria-label', t(key));
    });

    if (elements.statusLed) {
        let activeStatus = 'OFFLINE';
        if (elements.statusLed.classList.contains('online')) activeStatus = 'ONLINE';
        else if (elements.statusLed.classList.contains('loading')) activeStatus = 'LOADING';
        updateSystemStatus(activeStatus);
    }

    let emailsToRerender = [];
    const cached = getStored(CONFIG.EMAIL_CACHE_KEY);
    if (cached) {
        try {
            emailsToRerender = JSON.parse(cached);
        } catch { /* ignore parse errors */ }
    }
    renderMailboxTabs();
    updateEmailTable(emailsToRerender);
}

function toggleLanguage() {
    const nextLang = currentLanguage === 'EN' ? 'TR' : 'EN';
    updateUILanguage(nextLang);
    toast(nextLang === 'TR' ? 'Dil Türkçe olarak değiştirildi.' : 'Language switched to English.', 'info');
}

function toast(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
        <div class="toast-icon"><i class="fa-solid ${toastIcons[type]}"></i></div>
        <span class="toast-message">${t(message)}</span>
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

// ── V4.0 State Extensions ──
let activeSessions = JSON.parse(getStored('temp_mail_sessions_v4') || '[]');
let activeSessionIndex = parseInt(getStored('temp_mail_current_session_index') || '0', 10);
let starredMailIds = new Set(JSON.parse(getStored('temp_mail_starred_ids') || '[]'));
let currentFilter = 'all'; // 'all', 'unread', 'starred', 'verification'
let lastFetchedEmails = []; // Cache of the last fetched email objects for instant client-side filtering

// ── Phase 1 State ──
const MAIL_TTL_SECONDS = 3600; // Guerrilla deletes a mail 60 minutes after arrival
let unseenCount = 0;
let notificationPermissionAsked = false;

// ── Phase 2 State ──
const READ_IDS_KEY = 'temp_mail_read_ids';
const ADDRESS_HISTORY_KEY = 'temp_mail_address_history';
const READ_IDS_LIMIT = 200;
const ADDRESS_HISTORY_LIMIT = 20;
const splitReaderMedia = window.matchMedia('(min-width: 1100px)');
let activeReaderMailId = null;
let selectedMailId = null;
let restoringAddress = false;

// ── Phase 3 State ──
let deferredInstallPrompt = null;

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
    mailboxTabs: $('mailbox-tabs'),
    filterChips: $('filter-chips'),
    readerPane: $('reader-pane'),
};

// ══════════════════════════════════════════════
// V4.0 Interactive Logic Helpers
// ══════════════════════════════════════════════
function saveCurrentSession() {
    if (!currentEmail || !sessionId) return;
    
    if (activeSessions.length === 0) {
        activeSessions = [{
            email: currentEmail,
            sessionId: sessionId,
            knownIds: Array.from(knownMailIds),
            sessionStart: getStored(CONFIG.SESSION_START_KEY) || Date.now().toString(),
            cache: getStored(CONFIG.EMAIL_CACHE_KEY) || '[]'
        }];
        activeSessionIndex = 0;
    } else {
        if (activeSessionIndex >= activeSessions.length) {
            activeSessionIndex = activeSessions.length - 1;
        }
        activeSessions[activeSessionIndex] = {
            email: currentEmail,
            sessionId: sessionId,
            knownIds: Array.from(knownMailIds),
            sessionStart: getStored(CONFIG.SESSION_START_KEY) || Date.now().toString(),
            cache: getStored(CONFIG.EMAIL_CACHE_KEY) || '[]'
        };
    }
    setStored('temp_mail_sessions_v4', JSON.stringify(activeSessions));
    setStored('temp_mail_current_session_index', activeSessionIndex.toString());
}

function renderMailboxTabs() {
    if (!elements.mailboxTabs) return;
    
    if (activeSessions.length === 0 && currentEmail) {
        activeSessions = [{
            email: currentEmail,
            sessionId: sessionId,
            knownIds: Array.from(knownMailIds),
            sessionStart: getStored(CONFIG.SESSION_START_KEY) || Date.now().toString(),
            cache: getStored(CONFIG.EMAIL_CACHE_KEY) || '[]'
        }];
        activeSessionIndex = 0;
    }
    
    let html = '';
    activeSessions.forEach((sess, idx) => {
        const isActive = idx === activeSessionIndex;
        const displayEmail = sess.email || t('generating_email');
        const shortEmail = displayEmail.length > 20 ? displayEmail.substring(0, 18) + '...' : displayEmail;
        
        html += `
            <button class="mailbox-tab ${isActive ? 'active' : ''}" onclick="switchMailbox(${idx})">
                <i class="fa-solid fa-inbox"></i>
                <span title="${displayEmail}">${shortEmail}</span>
                <span class="mailbox-tab-close-btn" onclick="closeMailbox(${idx}, event)">
                    <i class="fa-solid fa-xmark"></i>
                </span>
            </button>
        `;
    });
    
    if (activeSessions.length < 5) {
        html += `
            <button class="mailbox-tab-add" onclick="addNewMailbox()">
                <i class="fa-solid fa-plus"></i>
                <span>${t('tab_add_new')} (${activeSessions.length}/5)</span>
            </button>
        `;
    } else {
        html += `
            <div class="mailbox-tab-add" style="border-style: solid; border-color: transparent; opacity: 0.7; cursor: not-allowed;" title="${t('toast_mailbox_limit')}">
                <i class="fa-solid fa-lock"></i>
                <span>5/5 Limit</span>
            </div>
        `;
    }
    
    elements.mailboxTabs.innerHTML = html;
}

function switchMailbox(index) {
    if (index === activeSessionIndex) return;
    
    closeReaderPane();
    saveCurrentSession();
    
    activeSessionIndex = index;
    const session = activeSessions[index];
    if (session) {
        currentEmail = session.email;
        sessionId = session.sessionId;
        knownMailIds = new Set(session.knownIds || []);
        
        setStored(CONFIG.EMAIL_KEY, currentEmail);
        setStored(CONFIG.SESSION_KEY, sessionId);
        setStored(CONFIG.KNOWN_IDS_KEY, JSON.stringify(Array.from(knownMailIds)));
        setStored(CONFIG.SESSION_START_KEY, session.sessionStart || Date.now().toString());
        setStored(CONFIG.EMAIL_CACHE_KEY, session.cache || '[]');
        
        if (elements.emailInput) elements.emailInput.value = currentEmail;
        
        if (elements.domainSelect && currentEmail) {
            const domain = currentEmail.split('@')[1];
            if (domain) {
                elements.domainSelect.value = domain;
            }
        }
        
        renderMailboxTabs();
        startSessionTimer();
        refreshMail();
    }
}

async function addNewMailbox() {
    if (activeSessions.length >= 5) {
        toast(t('toast_mailbox_limit'), 'warning');
        return;
    }
    
    closeReaderPane();
    saveCurrentSession();
    
    activeSessionIndex = activeSessions.length;
    currentEmail = '';
    sessionId = '';
    knownMailIds = new Set();
    
    setStored(CONFIG.EMAIL_KEY, '');
    setStored(CONFIG.SESSION_KEY, '');
    setStored(CONFIG.KNOWN_IDS_KEY, '[]');
    setStored(CONFIG.SESSION_START_KEY, Date.now().toString());
    setStored(CONFIG.EMAIL_CACHE_KEY, '[]');
    
    if (elements.emailInput) elements.emailInput.value = '';
    
    activeSessions.push({
        email: '',
        sessionId: '',
        knownIds: [],
        sessionStart: Date.now().toString(),
        cache: '[]'
    });
    
    saveCurrentSession();
    renderMailboxTabs();
    
    try {
        setLoading(true);
        await getSession();
        await genEmail();
        saveCurrentSession();
        renderMailboxTabs();
    } catch (e) {
        console.error('Failed to add new mailbox:', e);
    } finally {
        setLoading(false);
    }
}

function closeMailbox(index, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    closeReaderPane();
    
    if (activeSessions.length <= 1) {
        activeSessions = [];
        activeSessionIndex = 0;
        clearStoredData();
        currentEmail = '';
        sessionId = '';
        knownMailIds = new Set();
        
        saveCurrentSession();
        renderMailboxTabs();
        initializeApp();
        toast(t('toast_mailbox_deleted'), 'success');
        return;
    }
    
    activeSessions.splice(index, 1);
    
    if (activeSessionIndex === index) {
        activeSessionIndex = Math.max(0, activeSessions.length - 1);
    } else if (activeSessionIndex > index) {
        activeSessionIndex--;
    }
    
    setStored('temp_mail_sessions_v4', JSON.stringify(activeSessions));
    setStored('temp_mail_current_session_index', activeSessionIndex.toString());
    
    const session = activeSessions[activeSessionIndex];
    currentEmail = session.email;
    sessionId = session.sessionId;
    knownMailIds = new Set(session.knownIds || []);
    
    setStored(CONFIG.EMAIL_KEY, currentEmail);
    setStored(CONFIG.SESSION_KEY, sessionId);
    setStored(CONFIG.KNOWN_IDS_KEY, JSON.stringify(Array.from(knownMailIds)));
    setStored(CONFIG.SESSION_START_KEY, session.sessionStart || Date.now().toString());
    setStored(CONFIG.EMAIL_CACHE_KEY, session.cache || '[]');
    
    if (elements.emailInput) elements.emailInput.value = currentEmail;
    
    if (elements.domainSelect && currentEmail) {
        const domain = currentEmail.split('@')[1];
        if (domain) {
            elements.domainSelect.value = domain;
        }
    }
    
    renderMailboxTabs();
    startSessionTimer();
    refreshMail();
    toast(t('toast_mailbox_deleted'), 'success');
}

function detectEmailTags(subject, from) {
    const s = (subject || '').toLowerCase();
    const f = (from || '').toLowerCase();
    
    if (s.includes('verify') || s.includes('verification') || s.includes('code') || s.includes('pin') || s.includes('otp') || s.includes('activation') || s.includes('confirm') || s.includes('onay') || s.includes('dogrula') || s.includes('doğrula') || s.includes('şifre') || s.includes('sifre') || s.includes('password') || s.includes('sign up') || s.includes('kayıt') || s.includes('kayit') || s.includes('activate') || s.includes('welcome') || s.includes('hoş geldin') || s.includes('hos geldin') ||
        f.includes('verify') || f.includes('code') || f.includes('otp') || f.includes('activation') || f.includes('confirm') || f.includes('onay') || f.includes('dogrula') || f.includes('doğrula')) {
        return { class: 'verification', label: t('tag_verification'), icon: 'fa-key' };
    }
    
    if (s.includes('security') || s.includes('güvenlik') || s.includes('guvenlik') || s.includes('alert') || s.includes('warn') || s.includes('suspicious') || s.includes('uyarı') || s.includes('uyari') || s.includes('login') || s.includes('giriş') || s.includes('giris') || s.includes('reset') || s.includes('2fa') || s.includes('mfa') ||
        f.includes('security') || f.includes('alert') || f.includes('warn') || f.includes('login')) {
        return { class: 'security', label: t('tag_security'), icon: 'fa-shield-halved' };
    }
    
    if (s.includes('test') || s.includes('demo') || s.includes('sandbox') || s.includes('dummy') || s.includes('trial') || s.includes('deneme') ||
        f.includes('test') || f.includes('demo') || f.includes('sandbox')) {
        return { class: 'testing', label: t('tag_testing'), icon: 'fa-flask' };
    }
    
    if (s.includes('newsletter') || s.includes('bülten') || s.includes('bulten') || s.includes('offer') || s.includes('discount') || s.includes('promo') || s.includes('deal') || s.includes('kampanya') || s.includes('indirim') || s.includes('fırsat') || s.includes('firsat') || s.includes('sale') ||
        f.includes('newsletter') || f.includes('promo') || f.includes('marketing') || f.includes('offer')) {
        return { class: 'marketing', label: t('tag_marketing'), icon: 'fa-bullhorn' };
    }
    
    return null;
}

function toggleStarMail(id, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    const idStr = String(id);
    if (starredMailIds.has(idStr)) {
        starredMailIds.delete(idStr);
    } else {
        starredMailIds.add(idStr);
    }
    setStored('temp_mail_starred_ids', JSON.stringify(Array.from(starredMailIds)));
    updateEmailTable(lastFetchedEmails);
}

// ══════════════════════════════════════════════
// Read State
// ══════════════════════════════════════════════
function loadReadIdsStore() {
    try {
        const parsed = JSON.parse(getStored(READ_IDS_KEY) || '{}');
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
}

function getReadIds() {
    if (!currentEmail) return new Set();
    const store = loadReadIdsStore();
    const ids = store[currentEmail];
    return new Set(Array.isArray(ids) ? ids.map(String) : []);
}

function markAsRead(id) {
    if (!currentEmail || id === null || id === undefined) return;
    const store = loadReadIdsStore();
    const idStr = String(id);
    const existing = Array.isArray(store[currentEmail]) ? store[currentEmail].map(String) : [];
    store[currentEmail] = [idStr, ...existing.filter(existingId => existingId !== idStr)].slice(0, READ_IDS_LIMIT);
    try {
        setStored(READ_IDS_KEY, JSON.stringify(store));
    } catch { /* ignore storage failures */ }
}

function updateMailReadState(id) {
    const idStr = String(id);
    document.querySelectorAll('#emails tbody tr, #emails-responsive .email-card').forEach(el => {
        if (el.dataset.mailId === idStr) el.classList.remove('is-unread');
    });
}

// ══════════════════════════════════════════════
// Address History
// ══════════════════════════════════════════════
function loadAddressHistory() {
    try {
        const parsed = JSON.parse(getStored(ADDRESS_HISTORY_KEY) || '[]');
        if (!Array.isArray(parsed)) return [];
        return parsed.filter(item => item && typeof item.email === 'string' && item.email);
    } catch {
        return [];
    }
}

function pushAddressHistory(email) {
    if (!email) return;
    const entries = loadAddressHistory().filter(item => item.email !== email);
    entries.unshift({ email, createdAt: Date.now() });
    try {
        setStored(ADDRESS_HISTORY_KEY, JSON.stringify(entries.slice(0, ADDRESS_HISTORY_LIMIT)));
    } catch { /* ignore storage failures */ }
}

function removeAddressHistory(email) {
    const entries = loadAddressHistory().filter(item => item.email !== email);
    try {
        setStored(ADDRESS_HISTORY_KEY, JSON.stringify(entries));
    } catch { /* ignore storage failures */ }
}

function restoreAddress(email) {
    const value = String(email || '').trim();
    const atIndex = value.indexOf('@');
    if (atIndex <= 0 || atIndex === value.length - 1) return;
    const user = value.slice(0, atIndex);
    const domain = value.slice(atIndex + 1);
    restoringAddress = true;
    genEmail(user, domain);
}

function renderFilterChips(emails = lastFetchedEmails) {
    if (!elements.filterChips) return;
    
    const totalCount = emails.length;
    const readIds = getReadIds();
    const unreadCount = emails.filter(e => !readIds.has(String(e.mail_id))).length;
    const starredCount = emails.filter(e => starredMailIds.has(String(e.mail_id))).length;
    const verificationCount = emails.filter(e => {
        const tag = detectEmailTags(e.mail_subject, e.mail_from);
        return tag && tag.class === 'verification';
    }).length;
    
    elements.filterChips.innerHTML = `
        <button class="filter-chip ${currentFilter === 'all' ? 'active' : ''}" onclick="setFilter('all')">
            <i class="fa-solid fa-inbox"></i>
            <span>${t('filter_all')}</span>
            <span class="filter-chip-count">${totalCount}</span>
        </button>
        <button class="filter-chip ${currentFilter === 'unread' ? 'active' : ''}" onclick="setFilter('unread')">
            <i class="fa-solid fa-circle-dot"></i>
            <span>${t('filter_unread')}</span>
            <span class="filter-chip-count">${unreadCount}</span>
        </button>
        <button class="filter-chip ${currentFilter === 'starred' ? 'active' : ''}" onclick="setFilter('starred')">
            <i class="fa-solid fa-star"></i>
            <span>${t('filter_starred')}</span>
            <span class="filter-chip-count">${starredCount}</span>
        </button>
        <button class="filter-chip ${currentFilter === 'verification' ? 'active' : ''}" onclick="setFilter('verification')">
            <i class="fa-solid fa-key"></i>
            <span>${t('filter_verification')}</span>
            <span class="filter-chip-count">${verificationCount}</span>
        </button>
    `;
}

function setFilter(type) {
    currentFilter = type;
    updateEmailTable(lastFetchedEmails);
}

let allItems = [];
let selectedIndex = 0;

function showCommandPalette() {
    let modal = $('cmd-palette-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cmd-palette-modal';
        modal.className = 'cmd-palette-modal hidden';
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCommandPalette();
            }
        });
    }
    
    modal.innerHTML = `
        <div class="cmd-palette-content">
            <div class="cmd-palette-search-wrapper">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" class="cmd-palette-search" id="cmd-palette-search" placeholder="${t('cmd_palette_placeholder')}" autocomplete="off">
            </div>
            <div class="cmd-palette-results" id="cmd-palette-results"></div>
            <div class="cmd-palette-footer">
                <span><kbd>↑↓</kbd> ${currentLanguage === 'TR' ? 'Gezin' : 'Navigate'}</span>
                <span><kbd>Enter</kbd> ${currentLanguage === 'TR' ? 'Çalıştır' : 'Run'}</span>
                <span><kbd>ESC</kbd> ${currentLanguage === 'TR' ? 'Kapat' : 'Close'}</span>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    
    const searchInput = $('cmd-palette-search');
    searchInput.focus();
    
    renderPaletteResults('');
    
    searchInput.addEventListener('input', (e) => {
        renderPaletteResults(e.target.value);
    });
    
    const paletteKeydownHandler = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (allItems.length > 0) {
                allItems[selectedIndex].element.classList.remove('selected');
                selectedIndex = (selectedIndex + 1) % allItems.length;
                allItems[selectedIndex].element.classList.add('selected');
                allItems[selectedIndex].element.scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (allItems.length > 0) {
                allItems[selectedIndex].element.classList.remove('selected');
                selectedIndex = (selectedIndex - 1 + allItems.length) % allItems.length;
                allItems[selectedIndex].element.classList.add('selected');
                allItems[selectedIndex].element.scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (allItems.length > 0 && selectedIndex >= 0 && selectedIndex < allItems.length) {
                const item = allItems[selectedIndex];
                closeCommandPalette();
                item.action();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeCommandPalette();
        }
    };
    
    searchInput.addEventListener('keydown', paletteKeydownHandler);
}

function closeCommandPalette() {
    const modal = $('cmd-palette-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.activeElement?.blur();
    }
}

function renderPaletteResults(query = '') {
    const resultsContainer = $('cmd-palette-results');
    if (!resultsContainer) return;
    
    const q = query.toLowerCase().trim();
    resultsContainer.innerHTML = '';
    allItems = [];
    
    const groups = getCommandItems();
    
    groups.forEach(group => {
        const matchedItems = group.items.filter(item => 
            item.name.toLowerCase().includes(q) || 
            group.group.toLowerCase().includes(q)
        );
        
        if (matchedItems.length > 0) {
            const groupTitle = document.createElement('div');
            groupTitle.className = 'cmd-palette-group-title';
            groupTitle.textContent = group.group;
            resultsContainer.appendChild(groupTitle);
            
            matchedItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cmd-palette-item';
                itemEl.innerHTML = `
                    <i class="fa-solid ${item.icon}"></i>
                    <span>${item.name}</span>
                    ${item.shortcut ? `<span class="cmd-palette-shortcut">${item.shortcut}</span>` : ''}
                `;
                
                itemEl.addEventListener('click', () => {
                    closeCommandPalette();
                    item.action();
                });
                
                resultsContainer.appendChild(itemEl);
                
                allItems.push({
                    name: item.name,
                    action: item.action,
                    element: itemEl
                });
            });
        }
    });
    
    if (allItems.length > 0) {
        selectedIndex = 0;
        allItems[selectedIndex].element.classList.add('selected');
    } else {
        selectedIndex = -1;
        const noResults = document.createElement('div');
        noResults.className = 'cmd-palette-item';
        noResults.style.cursor = 'default';
        noResults.style.justifyContent = 'center';
        noResults.style.color = 'var(--text-tertiary)';
        noResults.textContent = currentLanguage === 'TR' ? 'Sonuç bulunamadı' : 'No results found';
        resultsContainer.appendChild(noResults);
    }
}

function getCommandItems() {
    return [
        {
            group: t('cmd_palette_action'),
            items: [
                {
                    name: currentLanguage === 'TR' ? 'E-posta Adresini Kopyala' : 'Copy Email Address',
                    icon: 'fa-copy',
                    shortcut: 'C',
                    action: () => { copyEmail(); }
                },
                {
                    name: currentLanguage === 'TR' ? 'Gelen Kutusunu Yenile' : 'Refresh Inbox',
                    icon: 'fa-rotate',
                    shortcut: 'R',
                    action: () => { refreshMail(); }
                },
                {
                    name: currentLanguage === 'TR' ? 'Yeni E-posta Kutusu Ekle' : 'Add New Mailbox Tab',
                    icon: 'fa-plus',
                    shortcut: 'N',
                    action: () => { addNewMailbox(); }
                },
                {
                    name: t('cmd_copy_latest_code'),
                    icon: 'fa-key',
                    shortcut: '',
                    action: () => { copyLatestCode(); }
                },
                ...(deferredInstallPrompt ? [{
                    name: t('cmd_install_app'),
                    icon: 'fa-download',
                    shortcut: '',
                    action: () => { installApp(); }
                }] : [])
            ]
        },
        {
            group: t('cmd_palette_settings'),
            items: [
                {
                    name: currentLanguage === 'TR' ? 'Temayı Değiştir (Açık/Koyu)' : 'Toggle Theme (Light/Dark)',
                    icon: 'fa-circle-half-stroke',
                    shortcut: '',
                    action: () => {
                        const themeToggle = document.getElementById('theme-toggle');
                        if (themeToggle) {
                            themeToggle.checked = !themeToggle.checked;
                            themeToggle.dispatchEvent(new Event('change'));
                        }
                    }
                },
                {
                    name: currentLanguage === 'TR' ? 'Dili Değiştir (EN/TR)' : 'Toggle Language (EN/TR)',
                    icon: 'fa-language',
                    shortcut: 'L',
                    action: () => { toggleLanguage(); }
                },
                {
                    name: t('cmd_enable_notifications'),
                    icon: 'fa-bell',
                    shortcut: '',
                    action: () => { requestNotificationPermission(true); }
                },
                {
                    name: getLoadImagesSetting() ? t('cmd_toggle_images_on') : t('cmd_toggle_images_off'),
                    icon: 'fa-shield-halved',
                    shortcut: '',
                    action: () => {
                        const enabled = !getLoadImagesSetting();
                        setLoadImagesSetting(enabled);
                        toast(t(enabled ? 'toast_images_setting_on' : 'toast_images_setting_off'), 'success');
                    }
                }
            ]
        },
        {
            group: t('cmd_palette_navigation'),
            items: [
                {
                    name: t('cmd_address_history'),
                    icon: 'fa-clock-rotate-left',
                    shortcut: '',
                    action: () => { showAddressHistory(); }
                },
                {
                    name: currentLanguage === 'TR' ? 'Gelen Kutusu Aramasına Odaklan' : 'Focus Inbox Search',
                    icon: 'fa-magnifying-glass',
                    shortcut: '/',
                    action: () => {
                        setTimeout(() => {
                            if (elements.emailSearch) {
                                elements.emailSearch.focus();
                                elements.emailSearch.select();
                            }
                        }, 50);
                    }
                },
                {
                    name: currentLanguage === 'TR' ? 'Klavye Kısayollarını Göster' : 'Show Keyboard Shortcuts',
                    icon: 'fa-keyboard',
                    shortcut: '?',
                    action: () => { showShortcuts(); }
                }
            ]
        }
    ];
}

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

    // Rewrite relative URLs to absolute Guerrilla Mail URLs to prevent local 404s
    doc.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('/') && !src.startsWith('//')) {
            img.setAttribute('src', `https://www.guerrillamail.com${src}`);
        }
    });
    doc.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('//')) {
            a.setAttribute('href', `https://www.guerrillamail.com${href}`);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
        }
    });

    return doc.body.innerHTML;
}

// ══════════════════════════════════════════════
// Privacy Shield & Link Safety (Phase 4)
// ══════════════════════════════════════════════
const LOAD_IMAGES_KEY = 'temp_mail_load_images';
const SHORTENER_HOSTS = [
    'bit.ly', 't.co', 'tinyurl.com', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly',
    'cutt.ly', 'rebrand.ly', 'shorturl.at', 'rb.gy', 't.ly'
];

function getLoadImagesSetting() {
    return getStored(LOAD_IMAGES_KEY) === '1';
}

function setLoadImagesSetting(enabled) {
    if (enabled) {
        setStored(LOAD_IMAGES_KEY, '1');
    } else {
        removeStored(LOAD_IMAGES_KEY);
    }
}

function isRemoteURL(value) {
    return /^(https?:)?\/\//i.test((value || '').trim());
}

function isTrackingPixel(img) {
    const width = (img.getAttribute('width') || '').trim();
    const height = (img.getAttribute('height') || '').trim();
    if (['0', '1', '2'].includes(width) || ['0', '1', '2'].includes(height)) {
        return true;
    }
    const style = (img.getAttribute('style') || '').replace(/\s+/g, '').toLowerCase();
    return style.includes('display:none') ||
        style.includes('visibility:hidden') ||
        style.includes('width:1px') ||
        style.includes('height:1px');
}

function isSuspiciousHost(hostname) {
    const host = (hostname || '').toLowerCase();
    if (!host) return false;

    // IPv4 or bracketed IPv6 address
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
    if (/^\[[0-9a-f:]+\]$/i.test(host) || host.includes(':')) return true;

    // Punycode label
    if (host.split('.').some(label => label.startsWith('xn--'))) return true;

    // Link shorteners (hostname or parent domain)
    const labels = host.replace(/^www\./, '').split('.');
    for (let i = 0; i < labels.length - 1; i++) {
        if (SHORTENER_HOSTS.includes(labels.slice(i).join('.'))) return true;
    }

    return false;
}

function getLinkTextHost(text) {
    const trimmed = (text || '').trim();
    if (!/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(trimmed)) return null;
    try {
        const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`);
        return url.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
        return null;
    }
}

function applyPrivacyShield(html) {
    const loadImages = getLoadImagesSetting();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    let blocked = 0;

    if (!loadImages) {
        // Tracking pixels are removed outright — they are not "blocked" content
        doc.querySelectorAll('img').forEach(img => {
            if (isTrackingPixel(img)) img.remove();
        });

        doc.querySelectorAll('img, picture source').forEach(el => {
            let touched = false;

            const src = el.getAttribute('src');
            if (src && isRemoteURL(src)) {
                el.setAttribute('data-shield-src', src);
                el.removeAttribute('src');
                touched = true;
            }

            const srcset = el.getAttribute('srcset');
            if (srcset && isRemoteURL(srcset)) {
                el.setAttribute('data-shield-srcset', srcset);
                el.removeAttribute('srcset');
                touched = true;
            }

            if (touched) {
                el.classList.add('shield-img');
                el.setAttribute('alt', el.getAttribute('alt') || '');
                blocked++;
            }
        });

        // Remote url(...) inside inline styles and <style> blocks
        const remoteUrlTest = /url\(\s*(['"]?)(?:https?:)?\/\/[^)'"]*\1\s*\)/i;
        const remoteUrlReplace = /url\(\s*(['"]?)(?:https?:)?\/\/[^)'"]*\1\s*\)/gi;
        const counted = new Set();
        const countElement = (el) => {
            if (counted.has(el)) return;
            counted.add(el);
            blocked++;
        };

        doc.querySelectorAll('[style]').forEach(el => {
            const style = el.getAttribute('style') || '';
            if (!remoteUrlTest.test(style)) return;
            el.setAttribute('style', style.replace(remoteUrlReplace, 'none'));
            countElement(el);
        });

        doc.querySelectorAll('style').forEach(el => {
            const css = el.textContent || '';
            if (!remoteUrlTest.test(css)) return;
            el.textContent = css.replace(remoteUrlReplace, 'none');
            countElement(el);
        });

        doc.querySelectorAll('[background]').forEach(el => {
            const background = el.getAttribute('background') || '';
            if (!/(https?:)?\/\//i.test(background)) return;
            el.removeAttribute('background');
            countElement(el);
        });
    }

    // Link safety runs regardless of the remote-image setting
    doc.querySelectorAll('a[href]').forEach(a => {
        const href = (a.getAttribute('href') || '').trim();
        if (!href) return;

        // Defence in depth — sanitizeHTML already strips javascript: handlers
        if (/^(javascript|data):/i.test(href)) {
            a.removeAttribute('href');
            return;
        }

        if (!/^https?:\/\//i.test(href)) return;

        let url;
        try {
            url = new URL(href);
        } catch {
            return;
        }

        const host = url.hostname;
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer nofollow');

        const existingTitle = a.getAttribute('title');
        a.setAttribute('title', existingTitle ? `${existingTitle} — ${host}` : host);

        let suspicious = isSuspiciousHost(host);
        if (!suspicious) {
            const textHost = getLinkTextHost(a.textContent);
            if (textHost) {
                const hrefHost = host.toLowerCase().replace(/^www\./, '');
                if (textHost !== hrefHost) suspicious = true;
            }
        }

        if (suspicious) {
            a.classList.add('link-suspicious');
            a.setAttribute('data-real-host', host);
        }
    });

    return { html: doc.body.innerHTML, blocked };
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
// ══════════════════════════════════════════════
// Avatar Helpers (Consistent HSL color mapping)
// ══════════════════════════════════════════════
const AVATAR_PALETTE = [
    '#1e3a8a', // Blue 900
    '#0f766e', // Teal 700
    '#111827', // Gray 900
    '#312e81', // Indigo 900
    '#581c87', // Purple 900
    '#701a75', // Fuchsia 900
    '#4c1d95', // Violet 900
    '#0369a1', // Sky 700
    '#15803d', // Green 700
    '#b45309', // Amber 700
    '#be123c', // Rose 700
    '#9a3412', // Orange 700
];

function getAvatarColor(sender) {
    if (!sender) return AVATAR_PALETTE[0];
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
        hash = sender.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_PALETTE.length;
    return AVATAR_PALETTE[index];
}

function getAvatarInitial(sender) {
    if (!sender) return '?';
    let clean = sender;
    if (sender.includes('<')) {
        clean = sender.split('<')[0].trim();
    }
    clean = clean.replace(/["']/g, '').trim();
    if (!clean) return '?';
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean[0].toUpperCase();
}

function getMailTimestamp(email) {
    if (!email) return null;

    const raw = Number(email.mail_timestamp);
    if (!isNaN(raw) && raw >= 1e9) return raw;

    if (email.mail_date) {
        const parsed = Date.parse(email.mail_date);
        if (!isNaN(parsed) && parsed / 1000 >= 1e9) return parsed / 1000;
    }

    return null;
}

function relativeTime(timestamp) {
    if (timestamp === null || timestamp === undefined || isNaN(timestamp)) return '—';
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    const isTr = currentLanguage === 'TR';
    if (diff < 60) return isTr ? 'Az önce' : 'Just now';
    if (diff < 3600) return isTr ? `${Math.floor(diff / 60)} dk önce` : `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return isTr ? `${Math.floor(diff / 3600)} sa önce` : `${Math.floor(diff / 3600)}h ago`;
    return new Date(timestamp * 1000).toLocaleDateString(isTr ? 'tr-TR' : 'en-US');
}

function formatFullDate(timestamp) {
    if (timestamp === null || timestamp === undefined || isNaN(timestamp)) return '—';
    const isTr = currentLanguage === 'TR';
    return new Date(timestamp * 1000).toLocaleString(isTr ? 'tr-TR' : 'en-US');
}

// ══════════════════════════════════════════════
// Per-email expiry (Guerrilla keeps a mail for 60 minutes)
// ══════════════════════════════════════════════
function getExpiryMinutes(ts) {
    if (ts === null || ts === undefined || isNaN(ts)) return null;
    const remaining = MAIL_TTL_SECONDS - (Date.now() / 1000 - ts);
    return Math.max(0, Math.ceil(remaining / 60));
}

function getMailExpiry(email) {
    const ts = getMailTimestamp(email);
    if (ts === null) return null;
    return getExpiryMinutes(ts);
}

function getExpiryFraction(minutes) {
    if (minutes === null || isNaN(minutes)) return 0;
    return Math.max(0, Math.min(1, (minutes * 60) / MAIL_TTL_SECONDS));
}

function expiryMeterHTML(minutes, ts) {
    if (minutes === null) return '';
    const title = escapeHTML(t('expires_in').replace('{m}', String(minutes)));
    const isLow = minutes < 10 ? ' is-low' : '';
    const fraction = getExpiryFraction(minutes);
    return `
        <div class="expiry-meter${isLow}" data-ts="${ts}" title="${title}">
            <span class="expiry-fill" style="transform: scaleX(${fraction})"></span>
        </div>
    `;
}

function refreshExpiryMeters() {
    document.querySelectorAll('.expiry-meter[data-ts]').forEach((meter) => {
        const ts = Number(meter.getAttribute('data-ts'));
        if (!isFinite(ts) || ts < 1e9) return;
        const minutes = getExpiryMinutes(ts);
        const fill = meter.querySelector('.expiry-fill');
        if (fill) fill.style.transform = `scaleX(${getExpiryFraction(minutes)})`;
        meter.classList.toggle('is-low', minutes < 10);
        meter.setAttribute('title', t('expires_in').replace('{m}', String(minutes)));
    });
}

// ══════════════════════════════════════════════
// Verification code & link extraction
// ══════════════════════════════════════════════
function isYearLikeCode(value) {
    if (!/^\d{4}$/.test(value)) return false;
    const n = parseInt(value, 10);
    return n >= 1900 && n <= 2099;
}

function firstVerificationCode(text) {
    const patterns = [
        /\b[0-9]{4,8}\b/g,
        /\b(?=[A-Z0-9]*\d)(?=[A-Z0-9]*[A-Z])[A-Z0-9]{5,8}\b/g
    ];
    let best = null;
    let bestIndex = Infinity;

    patterns.forEach((re) => {
        let match;
        while ((match = re.exec(text)) !== null) {
            if (isYearLikeCode(match[0])) continue;
            if (match.index < bestIndex) {
                bestIndex = match.index;
                best = match[0];
            }
            break;
        }
    });

    return best;
}

function extractVerificationCode(text) {
    const source = String(text || '');
    if (!source) return null;

    const keywordRe = /(?<!\p{L})(?:code|otp|pin|verification|passcode|token|kod\p{L}*|doğrulama\p{L}*|onay\p{L}*|şifre\p{L}*)(?!\p{L})/giu;
    let match;
    while ((match = keywordRe.exec(source)) !== null) {
        const after = source.slice(match.index + match[0].length, match.index + match[0].length + 80);
        const found = firstVerificationCode(after);
        if (found) return found;
    }

    // No keyword hit: accept a standalone 6-digit number only
    const standalone = source.match(/\b\d{6}\b/g) || [];
    for (const candidate of standalone) {
        if (!isYearLikeCode(candidate)) return candidate;
    }

    return null;
}

function extractVerificationLink(html) {
    const source = String(html || '');
    if (!source || !/<a\b/i.test(source)) return null;

    try {
        const doc = new DOMParser().parseFromString(source, 'text/html');
        const linkRe = /verify|confirm|activate|validate|doğrula|onayla|magic|login/i;
        const anchors = [...doc.querySelectorAll('a[href]')];
        for (const anchor of anchors) {
            const href = (anchor.getAttribute('href') || '').trim();
            const text = (anchor.textContent || '').trim();
            if (!/^https?:\/\/[^\s"'<>]+$/i.test(href)) continue;
            if (linkRe.test(href) || linkRe.test(text)) return href;
        }
    } catch { /* ignore unparsable HTML */ }

    return null;
}

function htmlToPlainText(html) {
    const source = String(html || '');
    if (!source) return '';
    try {
        const doc = new DOMParser().parseFromString(source, 'text/html');
        return doc.body.textContent || '';
    } catch {
        return source;
    }
}

function getLatestVerificationCode(emails = lastFetchedEmails) {
    const list = Array.isArray(emails) ? [...emails] : [];
    list.sort((a, b) => (getMailTimestamp(b) || 0) - (getMailTimestamp(a) || 0));

    for (const email of list) {
        const text = `${email.mail_subject || ''} ${email.mail_excerpt || ''}`;
        const code = extractVerificationCode(text);
        if (code) return code;
    }

    return null;
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            const copied = document.execCommand('copy');
            ta.remove();
            return copied;
        } catch {
            return false;
        }
    }
}

async function copyVerificationCode(code, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    if (!code) return;

    const copied = await copyToClipboard(String(code));
    if (copied) {
        toast(t('toast_code_copied'), 'success');
    } else {
        toast(t('toast_copy_failed'), 'error');
    }
}

async function copyLatestCode() {
    const code = getLatestVerificationCode();
    if (!code) {
        toast(t('toast_no_code'), 'warning');
        return;
    }

    const copied = await copyToClipboard(code);
    if (copied) {
        toast(t('toast_code_copied'), 'success');
    } else {
        toast(t('toast_copy_failed'), 'error');
    }
}

function otpChipHTML(code) {
    if (!code) return '';
    const safeCode = escapeHTML(String(code));
    const label = escapeHTML(t('btn_copy_code'));
    return `<button class="otp-chip" onclick="copyVerificationCode('${safeCode}', event)" ondblclick="event.stopPropagation()" title="${label}" aria-label="${label}"><span class="otp-chip-code">${safeCode}</span><i class="fa-regular fa-copy" aria-hidden="true"></i></button>`;
}

// ══════════════════════════════════════════════
// Status Management
// ══════════════════════════════════════════════
function updateSystemStatus(status) {
    elements.statusLed.classList.remove('online', 'offline', 'loading');
    elements.statusLed.classList.add(CONFIG.STATUS[status].class);
    elements.statusText.textContent = t('status_' + status.toLowerCase());
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
        const msg = currentLanguage === 'TR' ? `${count} yeni e-posta alındı!` : `${count} new email${count > 1 ? 's' : ''} received!`;
        toast(msg, 'success', CONFIG.TOAST_DURATION_LONG);

        // Confetti explosion
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 }
            });
        }

        // Unseen badge in the tab title + desktop notification only while hidden
        if (document.hidden) {
            unseenCount += count;
            document.title = '(' + unseenCount + ') ' + t('doc_title');

            try {
                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                    const latest = newMails[0];
                    const notification = new Notification('TempMail', {
                        body: `${latest.mail_from || ''} — ${latest.mail_subject || ''}`.trim(),
                        icon: 'images/temp-mail-icon.png',
                        tag: 'tempmail-new'
                    });
                    notification.onclick = () => {
                        window.focus();
                        viewEmail(latest.mail_id);
                        notification.close();
                    };
                }
            } catch { /* Notification may be unavailable */ }
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
async function genEmail(customPrefix = null, forcedDomain = null) {
    try {
        setLoading(true);
        setLoadingStatus();

        if (!sessionId) {
            await getSession();
        }

        const selectedDomain = elements.domainSelect?.value;
        const domain = forcedDomain
            ? forcedDomain
            : (selectedDomain && selectedDomain !== 'random'
                ? selectedDomain
                : CONFIG.DOMAINS[Math.floor(Math.random() * CONFIG.DOMAINS.length)]);

        let finalPrefix = customPrefix ? customPrefix.trim().toLowerCase() : '';
        if (!finalPrefix) {
            finalPrefix = Math.random().toString(36).substring(2, 10);
        }

        const response = await fetchWithTimeout(`${CONFIG.API_BASE}?f=set_email_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `sid_token=${sessionId}&email_user=${finalPrefix}&domain=${domain}`
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        currentEmail = data.email_addr;
        setStored(CONFIG.EMAIL_KEY, currentEmail);
        elements.emailInput.value = currentEmail;

        // A new address means any open reader belongs to the old mailbox
        closeReaderPane();
        pushAddressHistory(currentEmail);

        // Reset known IDs and session timer for new address
        knownMailIds.clear();
        setStored(CONFIG.KNOWN_IDS_KEY, '[]');
        setStored(CONFIG.SESSION_START_KEY, Date.now().toString());
        startSessionTimer();

        await refreshMail();
        if (restoringAddress) {
            toast(t('toast_address_restored'), 'success');
        } else {
            toast(customPrefix ? 'Custom email address generated!' : 'New email address generated!', 'success');
        }
        restoringAddress = false;
        setOnline();
        saveCurrentSession();
        renderMailboxTabs();
    } catch (error) {
        restoringAddress = false;
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

    await copyToClipboard(email);

    // Visual feedback: swap icon to checkmark & confetti burst centered on button
    if (elements.copyBtn && elements.copyIcon) {
        elements.copyBtn.classList.add('copied');
        elements.copyIcon.className = 'fa-solid fa-check';
        toast('Email copied to clipboard!', 'success');

        // Target confetti centered on copyBtn
        if (typeof confetti === 'function') {
            const rect = elements.copyBtn.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;
            confetti({
                particleCount: 40,
                spread: 60,
                origin: { x, y },
                colors: ['#2563EB', '#3B82F6', '#60A5FA'],
                gravity: 1.1,
                ticks: 80,
                scalar: 0.8
            });
        }

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
    lastFetchedEmails = emails || [];
    
    // Save current session so that activeSessions stores the latest cached emails and known ids
    saveCurrentSession();
    
    // Render filter chips
    renderFilterChips(lastFetchedEmails);
    
    elements.emailTable.innerHTML = '';
    const responsiveContainer = document.getElementById('emails-responsive');
    if (responsiveContainer) responsiveContainer.innerHTML = '';
    
    // Filter emails
    let filteredEmails = [...lastFetchedEmails];
    const readIds = getReadIds();
    if (currentFilter === 'starred') {
        filteredEmails = filteredEmails.filter(e => starredMailIds.has(String(e.mail_id)));
    } else if (currentFilter === 'verification') {
        filteredEmails = filteredEmails.filter(e => {
            const tag = detectEmailTags(e.mail_subject, e.mail_from);
            return tag && tag.class === 'verification';
        });
    } else if (currentFilter === 'unread') {
        filteredEmails = filteredEmails.filter(e => !readIds.has(String(e.mail_id)));
    }

    if (!filteredEmails || filteredEmails.length === 0) {
        // Empty state based on current filter type
        let emptyTitle = t('empty_title');
        let emptyDesc = t('empty_desc');
        
        if (currentFilter === 'starred') {
            emptyTitle = currentLanguage === 'TR' ? 'Yıldızlı e-posta yok' : 'No starred emails';
            emptyDesc = currentLanguage === 'TR' ? 'Önemli e-postaları saklamak için yıldızlayın' : 'Star important emails to keep them here';
        } else if (currentFilter === 'verification') {
            emptyTitle = currentLanguage === 'TR' ? 'Doğrulama e-postası yok' : 'No verification emails';
            emptyDesc = currentLanguage === 'TR' ? 'Herhangi bir doğrulama veya onay e-postası bulunamadı' : 'No verification or confirmation emails found';
        } else if (currentFilter === 'unread') {
            emptyTitle = t('empty_unread_title');
            emptyDesc = t('empty_unread_desc');
        }

        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5">
                <div class="empty-state">
                    <div class="empty-state-icon"><i class="fa-solid fa-inbox"></i></div>
                    <h4>${emptyTitle}</h4>
                    <p>${emptyDesc}</p>
                    <div class="empty-state-hint">
                        ${currentLanguage === 'TR' ? 'Yenilemek için <kbd>R</kbd> veya yeni adres için <kbd>N</kbd> tuşuna basın' : 'Press <kbd>R</kbd> to refresh or <kbd>N</kbd> for a new address'}
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
                <h4>${emptyTitle}</h4>
                <p>${emptyDesc}</p>
                <div class="empty-state-hint">
                    ${currentLanguage === 'TR' ? 'Hızlı işlemler için <i class="fa-solid fa-plus" style="font-size:0.625rem"></i> düğmesine dokunun' : 'Tap the <i class="fa-solid fa-plus" style="font-size:0.625rem"></i> button for quick actions'}
                </div>
            `;
            responsiveContainer.appendChild(emptyDiv);
            responsiveContainer.removeAttribute('hidden');
        }
        return;
    }

    filteredEmails.forEach(email => {
        const isNew = !knownMailIds.has(email.mail_id) || knownMailIds.size <= filteredEmails.length;
        const mailTs = getMailTimestamp(email);
        const dateStr = formatFullDate(mailTs);
        const relTime = relativeTime(mailTs);
        const expiryHTML = expiryMeterHTML(getMailExpiry(email), mailTs);
        const verificationCode = extractVerificationCode((email.mail_subject || '') + ' ' + (email.mail_excerpt || ''));
        const safeSubject = escapeHTML(email.mail_subject || t('msg_no_subject'));
        const safeFrom = escapeHTML(email.mail_from || t('msg_unknown_sender'));
        const isUnread = !readIds.has(String(email.mail_id));

        const initial = getAvatarInitial(safeFrom);
        const avatarColor = getAvatarColor(safeFrom);

        const tag = detectEmailTags(email.mail_subject, email.mail_from);
        const isStarred = starredMailIds.has(String(email.mail_id));
        const starClass = isStarred ? 'star-btn starred' : 'star-btn';
        const starIcon = isStarred ? 'fa-solid fa-star' : 'fa-regular fa-star';
        
        let subjectContent = '';
        if (tag) {
            subjectContent += `<span class="email-tag-badge ${tag.class}"><i class="fa-solid ${tag.icon}"></i> ${tag.label}</span> `;
        }
        if (verificationCode) {
            subjectContent += `${otpChipHTML(verificationCode)} `;
        }
        subjectContent += `<span class="subject-text">${safeSubject}</span>`;

        // Table row
        const row = document.createElement('tr');
        row.className = isUnread ? 'row-new is-unread' : 'row-new';
        row.dataset.mailId = String(email.mail_id);
        row.innerHTML = `
            <td>
                <button class="${starClass}" onclick="toggleStarMail('${escapeHTML(String(email.mail_id))}', event)" title="${t('btn_star')}">
                    <i class="${starIcon}"></i>
                </button>
                ${escapeHTML(String(email.mail_id))}
            </td>
            <td title="${safeFrom}" class="sender-cell">
                <div class="sender-avatar" style="background-color: ${avatarColor}">${initial}</div>
                <span class="sender-name">${safeFrom}</span>
            </td>
            <td title="${safeSubject}">${subjectContent}</td>
            <td title="${dateStr}">
                <div class="date-cell">
                    <span>${relTime}</span>
                    ${expiryHTML}
                </div>
            </td>
            <td>
                <div class="email-actions">
                    <button onclick="viewEmail('${escapeHTML(String(email.mail_id))}')" class="icon-button" aria-label="View email" title="${currentLanguage === 'TR' ? 'Göster' : 'View'}">
                        <i class="fa-solid fa-eye" aria-hidden="true"></i>
                    </button>
                    <button onclick="deleteEmail('${escapeHTML(String(email.mail_id))}')" class="icon-button" aria-label="Delete email" title="${currentLanguage === 'TR' ? 'Sil' : 'Delete'}" style="color:var(--error)">
                        <i class="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </td>
        `;
        row.style.cursor = 'pointer';
        row.addEventListener('click', (event) => {
            if (event.target.closest('button, a, .otp-chip')) return;
            viewEmail(email.mail_id);
        });
        elements.emailTable.appendChild(row);

        // Responsive card
        if (responsiveContainer) {
            const card = document.createElement('div');
            card.className = isUnread ? 'email-card is-unread' : 'email-card';
            card.dataset.mailId = String(email.mail_id);
            card.innerHTML = `
                <div class="email-card-header">
                    <span>
                        <button class="${starClass}" onclick="toggleStarMail('${escapeHTML(String(email.mail_id))}', event)" style="margin-right:0.35rem">
                            <i class="${starIcon}"></i>
                        </button>
                        #${escapeHTML(String(email.mail_id))}
                    </span>
                    <span class="email-card-date" title="${dateStr}">
                        <span>${relTime}</span>
                        ${expiryHTML}
                    </span>
                </div>
                <div class="email-card-subject">${subjectContent}</div>
                <div class="email-card-meta">
                    <div class="sender-avatar" style="background-color: ${avatarColor}">${initial}</div>
                    <span>${safeFrom}</span>
                </div>
                <div class="email-card-actions">
                    <button onclick="viewEmail('${escapeHTML(String(email.mail_id))}')" class="primary-button" aria-label="${currentLanguage === 'TR' ? 'Görüntüle' : 'View'}">
                        <i class="fa-solid fa-eye" aria-hidden="true"></i> ${currentLanguage === 'TR' ? 'Görüntüle' : 'View'}
                    </button>
                    <button onclick="deleteEmail('${escapeHTML(String(email.mail_id))}')" class="icon-button" aria-label="${currentLanguage === 'TR' ? 'Sil' : 'Delete'}" style="color:var(--error)">
                        <i class="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            `;
            card.addEventListener('click', (event) => {
                if (event.target.closest('button, a, .otp-chip')) return;
                viewEmail(email.mail_id);
            });
            responsiveContainer.appendChild(card);
            responsiveContainer.removeAttribute('hidden');
        }
    });

    // Instantly re-apply any ongoing search filter
    const searchTerm = elements.emailSearch ? elements.emailSearch.value : '';
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        document.querySelectorAll('#emails tbody tr').forEach(row => {
            if (row.querySelector('.empty-state')) return;
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(term) ? '' : 'none';
        });
        document.querySelectorAll('#emails-responsive .email-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(term) ? '' : 'none';
        });
    }

    restoreRowHighlights();
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
        markAsRead(id);
        updateMailReadState(id);
        renderFilterChips(lastFetchedEmails);

        if (splitReaderMedia.matches) {
            openReaderPane(email, id);
        } else {
            showEmailModal(email);
        }
    } catch (error) {
        console.error('Error viewing email:', error);
        toast('Failed to load email content', 'error');
    } finally {
        setLoading(false);
    }
}

// ══════════════════════════════════════════════
// Shared Email View (modal + split reader)
// ══════════════════════════════════════════════
function buildEmailViewHTML(email, mode) {
    const safeSubject = escapeHTML(email.mail_subject || t('msg_no_subject'));
    const safeFrom = escapeHTML(email.mail_from || t('msg_unknown_sender'));
    const sanitizedBody = sanitizeHTML(email.mail_body || `<p>${escapeHTML(t('msg_no_content'))}</p>`);
    const shielded = applyPrivacyShield(sanitizedBody);
    const safeBody = shielded.html;
    const mailTs = getMailTimestamp(email);
    const dateStr = formatFullDate(mailTs);
    const plainBody = htmlToPlainText(safeBody);
    const verificationCode = extractVerificationCode(`${email.mail_subject || ''} ${plainBody}`);
    const verificationLink = extractVerificationLink(safeBody);
    const idStr = String(email.mail_id);
    const isStarred = starredMailIds.has(idStr);
    const closeLabel = mode === 'pane' ? t('btn_close') : t('close_email_title');
    const starIcon = isStarred ? 'fa-solid fa-star' : 'fa-regular fa-star';

    return `
        <div class="modal-header">
            <h2>${safeSubject}</h2>
            <button class="close-btn" aria-label="${escapeHTML(closeLabel)}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div class="modal-actions">
            ${mode === 'pane' ? `
                <button class="reader-star-btn ${isStarred ? 'starred' : ''}" title="${escapeHTML(t('btn_star'))}" aria-label="${escapeHTML(t('btn_star'))}">
                    <i class="${starIcon}"></i> ${t('btn_star')}
                </button>
            ` : ''}
            <button class="copy-text-btn" title="${escapeHTML(t('copy_text_title'))}">
                <i class="fa-solid fa-copy"></i> ${t('btn_copy_text')}
            </button>
            <button class="eml-download-btn" title="${escapeHTML(t('save_eml_title'))}">
                <i class="fa-solid fa-download"></i> ${t('btn_save_eml')}
            </button>
            <button class="delete-email-btn" title="${escapeHTML(t('delete_email_title'))}" style="color:var(--error)">
                <i class="fa-solid fa-trash"></i> ${t('btn_delete')}
            </button>
            <button class="print-email-btn" onclick="window.print()" title="${escapeHTML(t('print_email_title'))}">
                <i class="fa-solid fa-print"></i> ${t('btn_print')}
            </button>
        </div>
        <div class="email-meta">
            <p><strong>${t('label_from')}</strong> ${safeFrom}</p>
            <p><strong>${t('label_date')}</strong> ${dateStr}</p>
            <p><strong>${t('label_to')}</strong> ${escapeHTML(currentEmail)}</p>
        </div>
        ${(verificationCode || verificationLink) ? `
            <div class="otp-strip">
                ${verificationCode ? `
                    <div class="otp-strip-values">
                        <span class="otp-strip-label">${t('label_verification_code')}</span>
                        <span class="otp-strip-code">${escapeHTML(verificationCode)}</span>
                    </div>
                ` : ''}
                <div class="otp-strip-actions">
                    ${verificationCode ? `
                        <button class="primary-button otp-copy-btn" onclick="copyVerificationCode('${escapeHTML(verificationCode)}')">
                            <i class="fa-regular fa-copy"></i> ${t('btn_copy_code')}
                        </button>
                    ` : ''}
                    ${verificationLink ? `
                        <a class="secondary-button otp-link-btn" href="${escapeHTML(verificationLink)}" target="_blank" rel="noopener noreferrer">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> ${t('btn_open_verify_link')}
                        </a>
                    ` : ''}
                </div>
            </div>
        ` : ''}
        ${shielded.blocked > 0 ? `
            <div class="shield-banner">
                <i class="fa-solid fa-shield-halved"></i>
                <span class="shield-banner-text">${escapeHTML(shielded.blocked === 1 ? t('shield_blocked_one') : t('shield_blocked').replace('{n}', String(shielded.blocked)))}</span>
                <div class="shield-banner-actions">
                    <button class="shield-show-btn">
                        <i class="fa-regular fa-eye"></i> ${t('btn_show_images')}
                    </button>
                    <button class="shield-always-btn">
                        <i class="fa-solid fa-shield-halved"></i> ${t('btn_always_show_images')}
                    </button>
                </div>
            </div>
        ` : ''}
        <div class="email-body">
            ${safeBody}
        </div>
        ${email.mail_attachments?.length ? `
            <div class="attachments">
                <h3><i class="fa-solid fa-paperclip"></i> ${t('label_attachments')} (${email.mail_attachments.length})</h3>
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
    `;
}

function wireEmailViewActions(container, email) {
    if (!container) return;

    const copyBtn = container.querySelector('.copy-text-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const body = container.querySelector('.email-body');
            const text = body ? body.innerText : '';
            const copied = await copyToClipboard(text);
            toast(copied ? t('toast_text_copied') : t('toast_copy_failed'), copied ? 'success' : 'error');
        });
    }

    const emlBtn = container.querySelector('.eml-download-btn');
    if (emlBtn) {
        emlBtn.addEventListener('click', () => {
            downloadEmailAsEML(email);
        });
    }

    const deleteBtn = container.querySelector('.delete-email-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const modal = container.closest('.email-modal');
            await deleteEmail(email.mail_id);
            if (modal) modal.remove();
        });
    }

    const starBtn = container.querySelector('.reader-star-btn');
    if (starBtn) {
        starBtn.addEventListener('click', (event) => {
            toggleStarMail(email.mail_id, event);
            const isStarred = starredMailIds.has(String(email.mail_id));
            starBtn.classList.toggle('starred', isStarred);
            const icon = starBtn.querySelector('i');
            if (icon) icon.className = isStarred ? 'fa-solid fa-star' : 'fa-regular fa-star';
        });
    }

    const restoreShieldedImages = () => {
        container.querySelectorAll('[data-shield-src]').forEach(el => {
            el.setAttribute('src', el.getAttribute('data-shield-src'));
            el.removeAttribute('data-shield-src');
            el.classList.remove('shield-img');
        });
        container.querySelectorAll('[data-shield-srcset]').forEach(el => {
            el.setAttribute('srcset', el.getAttribute('data-shield-srcset'));
            el.removeAttribute('data-shield-srcset');
            el.classList.remove('shield-img');
        });
        container.querySelectorAll('.shield-banner').forEach(banner => banner.remove());
    };

    const shieldShowBtn = container.querySelector('.shield-show-btn');
    if (shieldShowBtn) {
        shieldShowBtn.addEventListener('click', () => restoreShieldedImages());
    }

    const shieldAlwaysBtn = container.querySelector('.shield-always-btn');
    if (shieldAlwaysBtn) {
        shieldAlwaysBtn.addEventListener('click', () => {
            setLoadImagesSetting(true);
            restoreShieldedImages();
        });
    }

    const bodyEl = container.querySelector('.email-body');
    if (bodyEl) {
        bodyEl.addEventListener('click', (event) => {
            const link = event.target.closest('a.link-suspicious');
            if (!link || !bodyEl.contains(link)) return;
            event.preventDefault();
            const href = link.getAttribute('href');
            if (!href) return;
            showLinkWarningModal(href, link.getAttribute('data-real-host') || '');
        });
    }
}

// ══════════════════════════════════════════════
// Split Reader Pane
// ══════════════════════════════════════════════
function markActiveMailRow(id) {
    const idStr = String(id);
    document.querySelectorAll('#emails tbody tr.is-active, #emails-responsive .email-card.is-active')
        .forEach(el => el.classList.remove('is-active'));
    document.querySelectorAll('#emails tbody tr, #emails-responsive .email-card').forEach(el => {
        if (el.dataset.mailId === idStr) el.classList.add('is-active');
    });
}

function restoreRowHighlights() {
    document.querySelectorAll('#emails tbody tr, #emails-responsive .email-card').forEach(el => {
        const id = el.dataset.mailId;
        if (!id) return;
        if (selectedMailId !== null && id === String(selectedMailId)) el.classList.add('is-selected');
        if (activeReaderMailId !== null && id === String(activeReaderMailId)) el.classList.add('is-active');
    });
}

function openReaderPane(email, id) {
    if (!elements.readerPane) return;

    elements.readerPane.innerHTML = buildEmailViewHTML(email, 'pane');
    elements.readerPane.removeAttribute('hidden');
    document.querySelector('.inbox-core')?.classList.add('has-reader');
    activeReaderMailId = String(id);
    markActiveMailRow(id);
    wireEmailViewActions(elements.readerPane, email);

    const closeBtn = elements.readerPane.querySelector('.close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => closeReaderPane());
}

function closeReaderPane() {
    if (!elements.readerPane) return;

    elements.readerPane.innerHTML = '';
    elements.readerPane.setAttribute('hidden', '');
    document.querySelector('.inbox-core')?.classList.remove('has-reader');
    activeReaderMailId = null;
    document.querySelectorAll('#emails tbody tr.is-active, #emails-responsive .email-card.is-active')
        .forEach(el => el.classList.remove('is-active'));
}

// ══════════════════════════════════════════════
// Email Modal
// ══════════════════════════════════════════════
function showEmailModal(email) {
    const modal = document.createElement('div');
    modal.className = 'email-modal';

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    modal.innerHTML = `
        <div class="email-modal-content">
            ${buildEmailViewHTML(email, 'modal')}
        </div>
    `;

    const container = modal.querySelector('.email-modal-content');
    wireEmailViewActions(container, email);
    container.querySelector('.close-btn').addEventListener('click', () => modal.remove());

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

        if (activeReaderMailId !== null && String(activeReaderMailId) === String(id)) {
            closeReaderPane();
        }
        if (selectedMailId !== null && String(selectedMailId) === String(id)) {
            selectedMailId = null;
        }

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

        closeReaderPane();
        selectedMailId = null;

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
        if (!notificationPermissionAsked) {
            notificationPermissionAsked = true;
            requestNotificationPermission();
        }
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
function getSelectableMailItems() {
    const useCards = window.matchMedia('(max-width: 820px)').matches;
    const selector = useCards ? '#emails-responsive .email-card' : '#emails tbody tr[data-mail-id]';
    return [...document.querySelectorAll(selector)].filter(el => el.offsetParent !== null);
}

function moveMailSelection(delta) {
    const items = getSelectableMailItems();
    if (!items.length) return;

    const currentIndex = items.findIndex(el => el.dataset.mailId === String(selectedMailId));
    let nextIndex;
    if (currentIndex === -1) {
        nextIndex = delta > 0 ? 0 : items.length - 1;
    } else {
        nextIndex = Math.min(items.length - 1, Math.max(0, currentIndex + delta));
    }

    document.querySelectorAll('#emails tbody tr.is-selected, #emails-responsive .email-card.is-selected')
        .forEach(el => el.classList.remove('is-selected'));

    const item = items[nextIndex];
    selectedMailId = item.dataset.mailId;
    item.classList.add('is-selected');
    item.scrollIntoView({ block: 'nearest' });
}

function openSelectedMail() {
    if (selectedMailId === null) return;
    viewEmail(selectedMailId);
}

function toggleSelectedMailStar() {
    if (selectedMailId === null) return;
    toggleStarMail(selectedMailId);
}

function deleteSelectedMail() {
    if (selectedMailId === null) return;
    deleteEmail(selectedMailId);
}

function isOverlayOpen() {
    return !!document.querySelector('.email-modal, .shortcuts-overlay, .cmd-palette-modal:not(.hidden)');
}

const shortcuts = [
    { key: 'r', labelKey: 'shortcut_refresh', action: () => refreshMail() },
    { key: 'n', labelKey: 'shortcut_new', action: () => genEmail() },
    { key: 'c', labelKey: 'shortcut_copy', action: () => copyEmail() },
    { key: '/', labelKey: 'shortcut_search', action: () => { elements.emailSearch.focus(); } },
    { key: '?', labelKey: 'shortcut_help', action: () => showShortcuts() },
    { key: 'j', altKeys: ['ArrowDown'], display: 'J / ↓', labelKey: 'shortcut_next', action: () => moveMailSelection(1) },
    { key: 'k', altKeys: ['ArrowUp'], display: 'K / ↑', labelKey: 'shortcut_prev', action: () => moveMailSelection(-1) },
    { key: 'Enter', altKeys: ['o'], display: 'Enter / O', labelKey: 'shortcut_open', action: () => openSelectedMail() },
    { key: 's', display: 'S', labelKey: 'shortcut_star', action: () => toggleSelectedMailStar() },
    { key: 'Delete', altKeys: ['#'], display: 'Del / #', labelKey: 'shortcut_delete', action: () => deleteSelectedMail() },
];

document.addEventListener('keydown', (e) => {
    // Check for Ctrl+K or Cmd+K to open Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        showCommandPalette();
        return;
    }

    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (e.key === 'Escape') e.target.blur();
        return;
    }

    // Don't trigger with modifier keys (except Shift for ? and #)
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    // Let focused buttons and links handle Enter natively
    if (e.key === 'Enter' && e.target.closest && e.target.closest('button, a')) return;

    // Inbox navigation stays out of the way while a modal or palette is open
    const mailNavKeys = ['j', 'k', 'ArrowDown', 'ArrowUp', 'Enter', 'o', 's', 'Delete', '#'];
    if (isOverlayOpen() && mailNavKeys.includes(e.key)) return;

    // Arrow keys only navigate once a mail is selected; otherwise let the page scroll
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && selectedMailId === null) return;

    // These shortcuts need a selected mail, so leave the keypress alone without one
    if (['Enter', 'o', 's', 'Delete', '#'].includes(e.key) && selectedMailId === null) return;

    const shortcut = shortcuts.find(s => s.key === e.key || (s.altKeys && s.altKeys.includes(e.key)));
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
            <h3><i class="fa-solid fa-keyboard"></i> ${t('tooltip_shortcuts')}</h3>
            <div class="shortcut-list">
                ${shortcuts.map(s => `
                    <div class="shortcut-item">
                        <span>${t(s.labelKey)}</span>
                        <kbd>${s.display || (s.key === '?' ? 'Shift + /' : s.key.toUpperCase())}</kbd>
                    </div>
                `).join('')}
                <div class="shortcut-item">
                    <span>${currentLanguage === 'TR' ? 'Komut Paleti' : 'Command Palette'}</span>
                    <kbd>Ctrl + K</kbd>
                </div>
                <div class="shortcut-item">
                    <span>${currentLanguage === 'TR' ? 'Modali kapat / odağı kaldır' : 'Close modal / blur'}</span>
                    <kbd>Esc</kbd>
                </div>
            </div>
            <button class="shortcut-close" onclick="this.closest('.shortcuts-overlay').remove()">
                ${currentLanguage === 'TR' ? 'Kapat' : 'Close'}
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
// Premium Extensions: Custom Alias, QR Code, EML
// ══════════════════════════════════════════════

function showCustomAliasModal() {
    // Remove existing alias modal
    document.querySelector('.alias-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'email-modal alias-modal';
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    const isTr = currentLanguage === 'TR';

    modal.innerHTML = `
        <div class="email-modal-content" style="max-width: 460px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-pen-to-square"></i> ${isTr ? 'Özel Kullanıcı Adı Belirle' : 'Set Custom Username'}</h2>
                <button class="close-btn" aria-label="${isTr ? 'Modali kapat' : 'Close modal'}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="alias-modal-body">
                <p style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                    ${isTr ? 'Geçici e-postanız için özel bir kullanıcı adı (alias) girin.' : 'Enter a custom username (alias) for your temporary email.'}
                </p>
                <div class="alias-input-group">
                    <i class="fa-solid fa-at"></i>
                    <input type="text" id="custom-alias-input" class="alias-input" placeholder="${isTr ? 'örn. ahmet' : 'e.g. johndoe'}" maxlength="30" autofocus>
                </div>
                <div class="alias-domains-info">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>${isTr ? `Kullanıcı adı alfanümerik olmalıdır (3-30 karakter). Alan adı kalacaktır: <strong>${elements.domainSelect?.value || 'guerrillamail.com'}</strong>` : `Username must be alphanumeric (3-30 chars). Domain will remain: <strong>${elements.domainSelect?.value || 'guerrillamail.com'}</strong>`}</span>
                </div>
                <button id="save-alias-btn" class="primary-button" style="margin-top: 1rem; width: 100%;">
                    <i class="fa-solid fa-check"></i> ${isTr ? 'Kullanıcı Adını Uygula' : 'Apply Custom Username'}
                </button>
            </div>
        </div>
    `;

    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());

    const input = modal.querySelector('#custom-alias-input');
    const saveBtn = modal.querySelector('#save-alias-btn');

    const applyAlias = () => {
        const val = input.value.trim().toLowerCase();
        if (!val) {
            toast('Username cannot be empty', 'warning');
            return;
        }
        if (val.length < 3) {
            toast('Username must be at least 3 characters', 'warning');
            return;
        }
        const alphanumeric = /^[a-z0-9]+$/i;
        if (!alphanumeric.test(val)) {
            toast('Username must be alphanumeric (letters and numbers only)', 'warning');
            return;
        }
        genEmail(val);
        modal.remove();
    };

    saveBtn.addEventListener('click', applyAlias);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyAlias();
        }
    });

    document.body.appendChild(modal);

    // Focus input
    setTimeout(() => input.focus(), 100);

    // Close on ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ══════════════════════════════════════════════
// Address History Modal
// ══════════════════════════════════════════════
function showAddressHistory() {
    // Remove existing history modal
    document.querySelector('.history-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'email-modal history-modal';

    let escHandler = null;
    const closeModal = () => {
        modal.remove();
        if (escHandler) document.removeEventListener('keydown', escHandler);
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    modal.innerHTML = `
        <div class="email-modal-content" style="max-width: 460px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-clock-rotate-left"></i> ${t('history_title')}</h2>
                <button class="close-btn" aria-label="${escapeHTML(t('btn_close'))}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="history-modal-body">
                <p class="history-hint">${t('history_hint')}</p>
                <div class="history-list" id="history-list"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const listEl = modal.querySelector('#history-list');

    const renderList = () => {
        const entries = loadAddressHistory();
        if (!entries.length) {
            listEl.innerHTML = `<p class="history-empty">${t('history_empty')}</p>`;
            return;
        }

        listEl.innerHTML = entries.map(item => {
            const isCurrent = item.email === currentEmail;
            const safeEmail = escapeHTML(item.email);
            return `
                <div class="history-item">
                    <div class="history-item-main">
                        <span class="history-address">${safeEmail}</span>
                        <span class="history-time">${relativeTime(item.createdAt / 1000)}</span>
                    </div>
                    <button class="history-use-btn" data-history-email="${safeEmail}" ${isCurrent ? 'disabled' : ''}>
                        ${isCurrent ? t('label_current') : t('btn_use')}
                    </button>
                    <button class="icon-button history-remove-btn" data-history-email="${safeEmail}" aria-label="${escapeHTML(t('btn_remove'))}" title="${escapeHTML(t('btn_remove'))}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        }).join('');

        listEl.querySelectorAll('.history-use-btn:not(:disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                const email = btn.getAttribute('data-history-email');
                closeModal();
                restoreAddress(email);
            });
        });

        listEl.querySelectorAll('.history-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                removeAddressHistory(btn.getAttribute('data-history-email'));
                renderList();
            });
        });
    };

    renderList();
    modal.querySelector('.close-btn').addEventListener('click', closeModal);

    escHandler = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal();
        }
    };
    document.addEventListener('keydown', escHandler);
}

function showQRCodeModal() {
    if (!currentEmail) {
        toast('Generate an email first!', 'warning');
        return;
    }

    // Remove existing qrcode modal
    document.querySelector('.qrcode-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'email-modal qrcode-modal';
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentEmail)}`;
    const isTr = currentLanguage === 'TR';

    modal.innerHTML = `
        <div class="email-modal-content" style="max-width: 420px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-qrcode"></i> ${isTr ? 'E-posta QR Kodu' : 'E-mail QR Code'}</h2>
                <button class="close-btn" aria-label="${isTr ? 'Modali kapat' : 'Close modal'}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="qr-modal-body">
                <img src="${qrUrl}" alt="Email QR Code" class="qr-code-img" id="qr-code-image">
                <p>${isTr ? 'Bu adresi hızlıca kopyalamak veya bu adrese e-posta göndermek için QR kodunu tarayın:' : 'Scan this QR code to quickly copy or send emails to this address:'}</p>
                <span style="font-family:monospace; font-size:0.875rem; word-break:break-all; font-weight:600; color:var(--primary);">${escapeHTML(currentEmail)}</span>
                <button id="download-qr-btn" class="primary-button" style="width: 100%;">
                    <i class="fa-solid fa-download"></i> ${isTr ? 'QR Resmini İndir' : 'Download QR Image'}
                </button>
            </div>
        </div>
    `;

    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());

    const downloadBtn = modal.querySelector('#download-qr-btn');
    downloadBtn.addEventListener('click', async () => {
        try {
            toast('Downloading QR code...', 'info');
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `tempmail-qr-${currentEmail.split('@')[0]}.png`;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(blobUrl);
            a.remove();
            toast('QR Code downloaded successfully!', 'success');
        } catch (err) {
            console.error(err);
            toast('Failed to download QR code. Try right clicking the image and saving.', 'error');
        }
    });

    document.body.appendChild(modal);

    // Close on ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ══════════════════════════════════════════════
// Programmatic Warning Modal
// ══════════════════════════════════════════════
function showWarning() {
    // Remove existing warning modal if exists
    document.querySelector('.warning-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'email-modal warning-modal';
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    const isTr = currentLanguage === 'TR';
    const title = isTr ? 'Sorumluluk Reddi Beyanı' : 'Disclaimer & Terms';
    const closeText = isTr ? 'Kapat' : 'Close';
    const content = isTr ? `
        <div class="warning-modal-body" style="font-size: 0.875rem; line-height: 1.6; color: var(--text-secondary);">
            <p style="margin-bottom: 1rem;">
                <strong>1. Güvenlik ve Gizlilik:</strong> TempMail geçici ve tek kullanımlık bir e-posta hizmetidir. E-postalarınız belirli bir süre sonra otomatik olarak silinecektir. Lütfen bu adresi hassas kişisel veriler, şifre sıfırlama, finansal işlemler veya gizli kalması gereken üyelikler için kullanmayınız.
            </p>
            <p style="margin-bottom: 1rem;">
                <strong>2. Sorumluluk Sınırı:</strong> Bu hizmet "olduğu gibi" sunulmaktadır. Servis sağlayıcının (GuerrillaMail) kesintileri, veri kayıpları veya e-postaların gecikmesinden/ulaşmamasından kaynaklanabilecek doğrudan veya dolaylı hiçbir zarardan bu proje veya geliştirici sorumlu tutulamaz.
            </p>
            <p style="margin-bottom: 1rem;">
                <strong>3. Adil Kullanım:</strong> Bu hizmetin kötüye kullanılması, spam gönderimi veya yasa illegal faaliyetler için kullanılması kesinlikle yasaktır.
            </p>
            <p style="margin-top: 1.5rem; text-align: center; font-weight: 600; color: var(--primary);">
                TempMail'i kullanarak bu koşulları kabul etmiş sayılırsınız.
            </p>
        </div>
    ` : `
        <div class="warning-modal-body" style="font-size: 0.875rem; line-height: 1.6; color: var(--text-secondary);">
            <p style="margin-bottom: 1rem;">
                <strong>1. Security & Privacy:</strong> TempMail is a temporary and disposable email service. Received emails are deleted automatically after a short period. Please do not use this service for sensitive personal data, password resets, financial transactions, or confidential memberships.
            </p>
            <p style="margin-bottom: 1rem;">
                <strong>2. Limitation of Liability:</strong> This service is provided "as is". The project developer is not responsible for any service interruptions, data losses, or failure to deliver emails caused by the upstream API provider (GuerrillaMail).
            </p>
            <p style="margin-bottom: 1rem;">
                <strong>3. Fair Use:</strong> Abusing this service, sending spam, or utilizing it for illegal activities is strictly prohibited.
            </p>
            <p style="margin-top: 1.5rem; text-align: center; font-weight: 600; color: var(--primary);">
                By using TempMail, you agree to these terms.
            </p>
        </div>
    `;

    modal.innerHTML = `
        <div class="email-modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-triangle-exclamation" style="color:var(--warning)"></i> ${title}</h2>
                <button class="close-btn" aria-label="Close modal">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div style="padding: 1.25rem 0 0.5rem 0;">
                ${content}
                <button class="primary-button" id="close-warning-btn" style="margin-top: 1.5rem; width: 100%;">
                    <i class="fa-solid fa-check"></i> ${closeText}
                </button>
            </div>
        </div>
    `;

    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
    modal.querySelector('#close-warning-btn').addEventListener('click', () => modal.remove());

    document.body.appendChild(modal);

    // Close on ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ══════════════════════════════════════════════
// Link Safety Warning Modal
// ══════════════════════════════════════════════
function showLinkWarningModal(href, host) {
    document.querySelector('.link-warning-modal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'email-modal link-warning-modal';

    const escHandler = (event) => {
        if (event.key !== 'Escape') return;
        event.stopPropagation();
        closeModal();
    };
    const closeModal = () => {
        modal.remove();
        document.removeEventListener('keydown', escHandler, true);
    };

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    modal.innerHTML = `
        <div class="email-modal-content link-warning-content" style="max-width: 420px;">
            <div class="modal-header">
                <h2><i class="fa-solid fa-triangle-exclamation" style="color:var(--warning)"></i> ${t('link_warning_title')}</h2>
                <button class="close-btn" aria-label="${escapeHTML(t('btn_close'))}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="link-warning-body">
                <p class="link-warning-desc">${t('link_warning_desc')}</p>
                <div class="link-warning-host">${escapeHTML(host)}</div>
                <div class="link-warning-actions">
                    <button class="secondary-button link-warning-cancel">${t('btn_cancel')}</button>
                    <button class="primary-button link-warning-open">${t('btn_open_anyway')}</button>
                </div>
            </div>
        </div>
    `;

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.querySelector('.link-warning-cancel').addEventListener('click', closeModal);
    modal.querySelector('.link-warning-open').addEventListener('click', () => {
        window.open(href, '_blank', 'noopener,noreferrer');
        closeModal();
    });

    document.body.appendChild(modal);
    document.addEventListener('keydown', escHandler, true);
}

function downloadEmailAsEML(email) {
    if (!email) return;

    const dateStr = new Date(email.mail_timestamp * 1000).toUTCString();
    const subject = email.mail_subject || '(No subject)';
    const from = email.mail_from || 'Unknown';
    const to = currentEmail;

    // Build simple EML text headers + HTML body
    let eml = '';
    eml += `From: ${from}\r\n`;
    eml += `To: ${to}\r\n`;
    eml += `Subject: ${subject}\r\n`;
    eml += `Date: ${dateStr}\r\n`;
    eml += `MIME-Version: 1.0\r\n`;
    eml += `Content-Type: text/html; charset=utf-8\r\n`;
    eml += `X-Unsent: 1\r\n`;
    eml += `\r\n`;
    eml += email.mail_body || '';

    const blob = new Blob([eml], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeSubject = subject.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
    a.download = `${safeSubject}.eml`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();

    toast('EML file downloaded!', 'success');
}

// ══════════════════════════════════════════════
// Request Notification Permission
// ══════════════════════════════════════════════
async function requestNotificationPermission(explicit = false) {
    try {
        if (typeof Notification === 'undefined') return false;
        if (Notification.permission === 'granted') {
            if (explicit) toast(t('toast_notif_enabled'), 'success');
            return true;
        }
        if (Notification.permission === 'denied') {
            if (explicit) toast(t('toast_notif_denied'), 'warning');
            return false;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            if (explicit) toast(t('toast_notif_enabled'), 'success');
            return true;
        }
        if (permission === 'denied') {
            if (explicit) toast(t('toast_notif_denied'), 'warning');
        }
        return false;
    } catch {
        return false;
    }
}

// ══════════════════════════════════════════════
// PWA — Install Prompt & Manifest Shortcut
// ══════════════════════════════════════════════
window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
});

async function installApp() {
    if (!deferredInstallPrompt) return;
    const promptEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    try {
        promptEvent.prompt();
        await promptEvent.userChoice;
    } catch {
        // The browser can reject a prompt that was already shown
    }
}

async function handleManifestShortcut() {
    if (new URLSearchParams(location.search).get('action') !== 'new') return;
    history.replaceState(null, '', location.pathname + location.hash);
    await genEmail();
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

    // 1. Session migration for legacy users
    if (activeSessions.length === 0 && currentEmail && sessionId) {
        activeSessions = [{
            email: currentEmail,
            sessionId: sessionId,
            knownIds: Array.from(knownMailIds),
            sessionStart: getStored(CONFIG.SESSION_START_KEY) || Date.now().toString(),
            cache: getStored(CONFIG.EMAIL_CACHE_KEY) || '[]'
        }];
        activeSessionIndex = 0;
        setStored('temp_mail_sessions_v4', JSON.stringify(activeSessions));
        setStored('temp_mail_current_session_index', '0');
    }

    // 2. Render mailbox tabs immediately
    renderMailboxTabs();

    try {
        // Load the active session data (if one exists)
        if (activeSessions.length > 0 && activeSessionIndex >= 0 && activeSessionIndex < activeSessions.length) {
            const currentSess = activeSessions[activeSessionIndex];
            currentEmail = currentSess.email || '';
            sessionId = currentSess.sessionId || '';
            knownMailIds = new Set(currentSess.knownIds || []);
            setStored(CONFIG.EMAIL_KEY, currentEmail);
            setStored(CONFIG.SESSION_KEY, sessionId);
            setStored(CONFIG.KNOWN_IDS_KEY, JSON.stringify(Array.from(knownMailIds)));
            setStored(CONFIG.SESSION_START_KEY, currentSess.sessionStart || Date.now().toString());
            setStored(CONFIG.EMAIL_CACHE_KEY, currentSess.cache || '[]');
        }

        if (currentEmail && sessionId) {
            if (elements.emailInput) {
                elements.emailInput.value = currentEmail;
            }
            if (elements.domainSelect) {
                const domain = currentEmail.split('@')[1];
                if (domain) {
                    elements.domainSelect.value = domain;
                }
            }
            startSessionTimer();
            await refreshMail();
        } else {
            // Generate an email first, either by getSession then genEmail
            await genEmail();
        }
        setOnline();
        await handleManifestShortcut();
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
    updateUILanguage(currentLanguage);
    initializeApp();

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
});

// Periodic reconnect when offline
setInterval(() => {
    if (elements.statusLed.classList.contains('offline') && !initializing && !sessionId) {
        initializeApp();
    }
}, 20000);

// Per-email expiry meters — refresh in place once a minute
setInterval(refreshExpiryMeters, 60000);

// ══════════════════════════════════════════════
// Visibility API — pause/resume when tab hidden
// ══════════════════════════════════════════════
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        if (unseenCount > 0) {
            unseenCount = 0;
            document.title = t('doc_title');
        }
        if (currentEmail && sessionId) {
            // Refresh when tab becomes visible again
            refreshMail();
        }
    }
});

// Split reader only exists on desktop; close it if the viewport shrinks
splitReaderMedia.addEventListener('change', (event) => {
    if (!event.matches) closeReaderPane();
});

// ══════════════════════════════════════════════
// PWA — Service Worker Registration
// ══════════════════════════════════════════════
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));

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
window.showCustomAliasModal = showCustomAliasModal;
window.showQRCodeModal = showQRCodeModal;
window.showAddressHistory = showAddressHistory;
window.restoreAddress = restoreAddress;
window.downloadEmailAsEML = downloadEmailAsEML;
window.showWarning = showWarning;
window.toggleLanguage = toggleLanguage;
window.copyVerificationCode = copyVerificationCode;
window.copyLatestCode = copyLatestCode;

// V4.0 Interactive Logic Exports
window.switchMailbox = switchMailbox;
window.closeMailbox = closeMailbox;
window.addNewMailbox = addNewMailbox;
window.toggleStarMail = toggleStarMail;
window.setFilter = setFilter;
window.showCommandPalette = showCommandPalette;
