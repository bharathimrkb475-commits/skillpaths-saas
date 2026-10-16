/* =========================================================
   theme.js
   ---------------------------------------------------------
   Handles Light Mode / Dark Mode across every page.
   Theme choice is saved in localStorage.settings.theme
   and applied by setting a data-theme attribute on <html>.
   ========================================================= */

// Apply the saved theme as soon as the page loads (before paint).
(function applySavedTheme() {
  const settings = dbGet(DB_KEYS.SETTINGS, { theme: "light", notifications: true });
  document.documentElement.setAttribute("data-theme", settings.theme || "light");
})();

// Switch between light and dark mode. Call this from a button's onclick.
function toggleTheme() {
  const settings = dbGet(DB_KEYS.SETTINGS, { theme: "light", notifications: true });
  settings.theme = settings.theme === "dark" ? "light" : "dark";
  dbSet(DB_KEYS.SETTINGS, settings);
  document.documentElement.setAttribute("data-theme", settings.theme);
  updateThemeIcon();
}

// Update the little sun/moon icon on the theme button, if present.
function updateThemeIcon() {
  const btn = document.getElementById("themeToggleBtn");
  if (!btn) return;
  const settings = dbGet(DB_KEYS.SETTINGS, { theme: "light" });
  btn.textContent = settings.theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode";
}

// Run once the DOM is ready so the button label is correct on load.
document.addEventListener("DOMContentLoaded", updateThemeIcon);
