// ─────────────────────────────────────────────
// TempMail v5.0 — Theme Controller
// Author: Mehmet Kahya
// Last Updated: 27 October 2026
// ─────────────────────────────────────────────

const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Apply theme (colour transitions are handled in CSS)
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.checked = theme === 'dark';

    // Update theme-color meta tag
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.content = theme === 'dark' ? '#07080A' : '#F1F0EA';
    }
}

// Toggle theme
function toggleTheme(e) {
    const theme = e.target.checked ? 'dark' : 'light';
    applyTheme(theme);
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
        applyTheme(e.matches ? 'dark' : 'light');
    }
});
