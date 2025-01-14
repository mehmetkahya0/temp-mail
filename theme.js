// Theme handling
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Function to toggle theme
function toggleTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// Event listener for theme toggle
themeToggle.addEventListener('change', toggleTheme);

// Check for saved theme preference or system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
    themeToggle.checked = true;
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    themeToggle.checked = false;
    document.documentElement.setAttribute('data-theme', 'light');
}

// Listen for system theme changes
prefersDarkScheme.addListener((e) => {
    if (!localStorage.getItem('theme')) {
        themeToggle.checked = e.matches;
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
}); 