/**
 * LEXIO — Books Page Renderer
 * Combustível Mental
 */

const Books = (() => {

  function render() {
    _renderFilters();
    _renderGrid('all');
  }

  function _renderFilters() {
    const container = document.getElementById('fuel-filters');
    if (!container) return;

    const categories = [
      { id: 'all', label: '⚡ Todos' },
      ...[ ...new Set(BOOKS_DB.map(b => b.category)) ]
        .map(cat => {
          const book = BOOKS_DB.find(b => b.category === cat);
          return { id: cat, label: book.categoryLabel };
        })
    ];

    container.innerHTML = categories.map(cat => `
      <button
        onclick="Books.filterBy('${cat.id}')"
        data-filter="${cat.id}"
        style="
          font-family:var(--font-mono);
          font-size:0.65rem;
          padding:6px 12px;
          border-radius:20px;
          border:1px solid var(--border2);
          background:${cat.id === 'all' ? 'var(--cyan)' : 'transparent'};
          color:${cat.id === 'all' ? 'var(--bg)' : 'var(--muted2)'};
          cursor:pointer;
          transition:all 0.2s;
          letter-spacing:0.05em;
        "
        onmouseover="if(this.dataset.filter !== document.querySelector('[data-filter].active-filter')?.dataset.filter) { this.style.borderColor='var(--cyan)'; this.style.color='var(--cyan)'; }"
        onmouseout="if(!this.classList.contains('active-filter')) { this.style.borderColor='var(--border2)'; this.style.color='var(--muted2)'; }"
      >${cat.label}</button>
    `).join('');

    container.querySelector('[data-filter="all"]').classList.add('active-filter');
  }

  function filterBy(category) {
    // Atualiza botões
    document.querySelectorAll('#fuel-filters button').forEach(btn => {
      const isActive = btn.dataset.filter === category;
      btn.classList.toggle('active-filter', isActive);
      btn.style.background   = isActive ? 'var(--cyan)' : 'transparent';
      btn.style.color        = isActive ? 'var(--bg)'   : 'var(--muted2)';
      btn.style.borderColor  = isActive ? 'var(--cyan)' : 'var(--border2)';
    });

    _renderGrid(category);
  }

  function _renderGrid(category) {
    const grid = document.getElementById('fuel-grid');
    if (!grid) return;

    const books = category === 'all'
      ? BOOKS_DB
      : BOOKS_DB.filter(b => b.category === category);

    grid.innerHTML = '';                        // ← limpa
    books.forEach(b => grid.appendChild(_bookCard(b)));  // ← appendChild

    grid.querySelectorAll('.book-card').forEach((el, i) => {
      el.style.opacity   = '0';
      el.style.transform = 'translateY(12px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      }, i * 60);
    });
  }

  function _bookCard(b) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.cssText = `
      background:var(--panel);
      border:1px solid var(--border);
      border-radius:14px;
      overflow:hidden;
      display:flex;
      flex-direction:column;
    `;

    // Linha colorida
    const topBar = document.createElement('div');
    topBar.style.cssText = `height:2px;background:${_catColor(b.category)};width:100%`;
    card.appendChild(topBar);

    // Corpo superior (capa + info)
    const body = document.createElement('div');
    body.style.cssText = 'display:flex;gap:16px;padding:18px 18px 0';

    // Capa
    const coverLink = document.createElement('a');
    coverLink.href   = b.amazon;
    coverLink.target = '_blank';
    coverLink.rel    = 'noopener';
    coverLink.style.flexShrink = '0';

    const img = document.createElement('img');
    img.src     = b.img;
    img.alt     = b.title_pt;
    img.loading = 'lazy';
    img.style.cssText = `
      width:80px;height:110px;object-fit:cover;border-radius:6px;
      display:block;box-shadow:0 4px 16px rgba(0,0,0,0.4);transition:transform 0.2s;
    `;
    img.addEventListener('mouseover', () => img.style.transform = 'scale(1.04)');
    img.addEventListener('mouseout',  () => img.style.transform = 'scale(1)');
    img.addEventListener('error',     () => { img.src = ''; img.style.background = 'var(--panel2)'; });
    coverLink.appendChild(img);
    body.appendChild(coverLink);

    // Info textual
    const info = document.createElement('div');
    info.style.cssText = 'flex:1;min-width:0';
    info.innerHTML = `
      <div style="font-family:var(--font-mono);font-size:0.58rem;color:${_catColor(b.category)};letter-spacing:0.15em;margin-bottom:5px;text-transform:uppercase">${b.categoryLabel} · ${b.year}</div>
      <div style="font-family:var(--font-display);font-size:0.95rem;font-weight:700;color:var(--white);line-height:1.3;margin-bottom:3px">${b.title_pt}</div>
      <div style="font-size:0.75rem;color:var(--muted2);margin-bottom:10px;font-style:italic">${b.title_en} · ${b.author}</div>
      <div style="font-size:0.82rem;color:rgba(236,238,255,0.65);line-height:1.6">${b.description}</div>
    `;
    body.appendChild(info);
    card.appendChild(body);

    // Por que ler
    const why = document.createElement('div');
    why.style.cssText = `
      margin:14px 18px;padding:10px 14px;
      background:rgba(255,255,255,0.03);
      border-left:3px solid ${_catColor(b.category)};
      border-radius:0 6px 6px 0;
      font-size:0.8rem;color:rgba(236,238,255,0.75);line-height:1.6;
    `;
    why.innerHTML = `
      <span style="font-family:var(--font-mono);font-size:0.58rem;color:${_catColor(b.category)};letter-spacing:0.12em;display:block;margin-bottom:4px">// POR QUE LER</span>
      ${b.why}
    `;
    card.appendChild(why);

    // Botão Amazon
    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'padding:0 18px 18px';

    const btn = document.createElement('a');
    btn.href    = b.amazon;
    btn.target  = '_blank';
    btn.rel     = 'noopener';
    btn.style.cssText = `
      display:flex;align-items:center;justify-content:center;gap:8px;
      width:100%;padding:11px 0;
      background:linear-gradient(135deg,#ff9900,#ffb347);
      color:#111;font-family:var(--font-mono);font-size:0.72rem;
      font-weight:700;letter-spacing:0.1em;border-radius:8px;
      text-decoration:none;transition:all 0.2s;box-sizing:border-box;
    `;
    btn.addEventListener('mouseover', () => { btn.style.transform = 'translateY(-1px)'; btn.style.boxShadow = '0 4px 16px rgba(255,153,0,0.35)'; });
    btn.addEventListener('mouseout',  () => { btn.style.transform = 'none'; btn.style.boxShadow = 'none'; });
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 12a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8m-8-6v6l4 2-1 1.73L11 12V6h1z"/>
      </svg>
      VER NA AMAZON
    `;
    btnWrap.appendChild(btn);
    card.appendChild(btnWrap);

    return card;
  }

  function _catColor(cat) {
    const colors = {
      habitos:     'var(--cyan)',
      aprendizado: 'var(--magenta)',
      mentalidade: 'var(--yellow)',
      cerebro:     'var(--green)',
      performance: 'var(--orange, #ff6b35)',
      idiomas:     'var(--white)'
    };
    return colors[cat] || 'var(--cyan)';
  }

  function _safeUrl(url) {
    return url.replace(/&amp;/g, '&');
  }

  return { render, filterBy };

})();