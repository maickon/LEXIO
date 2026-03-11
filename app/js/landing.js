// ── PARTICLES ─────────────────────────────────
(function() {
  const c = document.getElementById('particles');
  const palette = ['#00f5ff','#ff00aa','#00ff88'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'p';
    const sz = 1 + Math.random() * 2;
    p.style.cssText = `
      width:${sz}px;height:${sz}px;
      left:${Math.random()*100}%;
      background:${palette[i%3]};
      animation-duration:${12+Math.random()*20}s;
      animation-delay:${Math.random()*15}s;
      box-shadow:0 0 ${sz*3}px currentColor;
    `;
    c.appendChild(p);
  }
})();

// ── SCROLL REVEAL ─────────────────────────────
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

// ── ZIPF CHART ────────────────────────────────
(function() {
  // Coverage data approximating Zipf curve
  const data = [50, 60, 65, 69, 72, 74, 76, 78, 80, 81, 82, 83, 84, 85, 85.5, 86, 87, 88, 89, 90, 91, 92, 92.5, 93, 93.5, 94, 94.5, 95, 95.3, 95.6];
  const container = document.getElementById('zipf-bars');
  if (!container) return;
  const max = Math.max(...data);
  data.forEach((v, i) => {
    const bar = document.createElement('div');
    bar.className = 'zipf-bar';
    const pct = (v / max) * 100;
    bar.style.height = pct + '%';
    // highlight the 1000-word zone (around index 14)
    if (i === 14) {
      bar.style.background = 'linear-gradient(180deg,var(--magenta),rgba(255,0,170,0.3))';
      bar.style.boxShadow = '0 0 8px var(--magenta)';
      bar.title = `1.000 palavras = ${v}% de cobertura`;
    } else {
      bar.title = `${Math.round((i+1)/data.length*3000)} palavras = ${v}%`;
    }
    container.appendChild(bar);
  });
})();

// ── FAQ ───────────────────────────────────────
function toggleFaq(el) {
  const item = el.parentElement;
  const ans  = item.querySelector('.faq-a');
  const isOpen = item.classList.contains('open');
  // close all
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.faq-a').classList.remove('open');
  });
  if (!isOpen) {
    item.classList.add('open');
    ans.classList.add('open');
  }
}