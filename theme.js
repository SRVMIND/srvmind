// Shared theme toggle — persists across pages via localStorage
(function () {
  const KEY = 'servmind-theme';
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  // Apply ASAP to avoid flash
  try {
    const saved = localStorage.getItem(KEY) || 'dark';
    apply(saved);
  } catch (e) {}

  function wire() {
    const btns = document.querySelectorAll('.theme-toggle');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = cur === 'dark' ? 'light' : 'dark';
        apply(next);
        try { localStorage.setItem(KEY, next); } catch (e) {}
      });
    });
  }

  // Sync across tabs/pages
  window.addEventListener('storage', (e) => {
    if (e.key === KEY && e.newValue) apply(e.newValue);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
