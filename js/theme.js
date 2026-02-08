// ─────────────────────────────────────────────
// TempMail v3.5 — Theme Controller
// Author: Mehmet Kahya
// Last Updated: 10 February 2026
// ─────────────────────────────────────────────

const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Apply theme with smooth transition
function applyTheme(theme, animate = false) {
    if (animate) {
        document.documentElement.style.transition = 'background 0.35s ease, color 0.35s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 400);
    }

    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.checked = theme === 'dark';

    // Update theme-color meta tag
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.content = theme === 'dark' ? '#0F172A' : '#2563EB';
    }
}

// Toggle theme
function toggleTheme(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    applyTheme(theme, true);
    localStorage.setItem('theme', theme);
}

// Event listener
themeToggle.addEventListener('change', toggleTheme);

// Initialize from saved preference or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
}

// Listen for system theme changes (only if no saved preference)
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light', true);
    }
});
