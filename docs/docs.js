// Docs runtime: render markdown from inline scripts, build TOC, scroll-spy
(function () {
  function loadMarked(cb) {
    if (window.marked) return cb();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function render() {
    const src = document.getElementById('md-source');
    const out = document.getElementById('md-out');
    if (!src || !out) return;
    out.innerHTML = window.marked.parse(src.textContent.trim());
    // Slugify h2/h3 ids
    out.querySelectorAll('h2, h3').forEach(h => {
      if (!h.id) h.id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    });
    buildTOC();
  }

  function buildTOC() {
    const toc = document.getElementById('docs-toc-list');
    if (!toc) return;
    const out = document.getElementById('md-out');
    const headings = out.querySelectorAll('h2, h3');
    toc.innerHTML = '';
    headings.forEach(h => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = h.tagName === 'H3' ? 'h3' : '';
      li.appendChild(a);
      toc.appendChild(li);
    });
    // Scroll-spy
    const links = toc.querySelectorAll('a');
    const map = new Map();
    headings.forEach((h, i) => map.set(h, links[i]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const a = map.get(e.target);
        if (!a) return;
        if (e.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-160px 0px -70% 0px' });
    headings.forEach(h => obs.observe(h));
  }

  function init() {
    loadMarked(render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
