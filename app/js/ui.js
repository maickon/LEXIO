/**
 * LEXIO — UI Utilities
 */

const UI = (() => {

  // ── TOAST ────────────────────────────────────────
  let toastTimer = null;
  function toast(msg, type = 'cyan') {
    const el = document.getElementById('toast');
    const colors = { cyan:'var(--cyan)', green:'var(--green)', warn:'var(--yellow)', error:'var(--orange)' };
    el.style.color       = colors[type] || colors.cyan;
    el.style.borderColor = (colors[type] || colors.cyan).replace('var(','').replace(')','');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  }

  // ── CONFETTI ─────────────────────────────────────
  function confetti(count = 30) {
    const palette = ['#00f5ff','#ff00aa','#00ff88','#ffdd00','#ff6b00'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left:${Math.random()*100}vw;
        top:${Math.random()*20 - 10}vh;
        background:${palette[Math.floor(Math.random()*palette.length)]};
        animation-delay:${Math.random()*0.5}s;
        border-radius:${Math.random()>0.5?'50%':'2px'};
        width:${4+Math.random()*6}px;
        height:${4+Math.random()*6}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }
  }

  // ── PARTICLES ────────────────────────────────────
  function spawnParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const palette = ['#00f5ff','#ff00aa','#00ff88'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const sz = 1 + Math.random() * 2.5;
      p.style.cssText = `
        width:${sz}px; height:${sz}px;
        left:${Math.random()*100}%;
        background:${palette[i % palette.length]};
        animation-duration:${10+Math.random()*18}s;
        animation-delay:${Math.random()*12}s;
        box-shadow:0 0 ${sz*3}px currentColor;
      `;
      container.appendChild(p);
    }
  }

  // ── SCREEN ROUTING ───────────────────────────────
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  // ── PAGE ROUTING (within main) ───────────────────
  function showPage(name) {
    document.querySelectorAll('[data-page]').forEach(p => {
      p.style.display = 'none';
    });
    const pg = document.querySelector(`[data-page="${name}"]`);
    if (pg) {
      pg.style.display = 'block';
      // reset scroll
      pg.scrollTop = 0;
      const pageContent = document.querySelector('.page-content');
      if (pageContent) pageContent.scrollTop = 0;
    }

    document.querySelectorAll('[data-nav]').forEach(b => {
      b.classList.toggle('active', b.dataset.nav === name);
    });

    if (name === 'evolution') Pages.evolution();
    if (name === 'learn')     Pages.learn();
    if (name === 'test')      Pages.test();
    if (name === 'fuel')      Pages.fuel();
  }

  // ── SPEED UI ─────────────────────────────────────
  function updateSpeedUI(v) {
    document.querySelectorAll('.speed-opt').forEach(el => {
      el.classList.toggle('active', parseFloat(el.dataset.speed) === v);
    });
  }

  // ── SIDEBAR STATS ────────────────────────────────
  function updateSidebar() {
    const s = State.get();
    const el = (id) => document.getElementById(id);
    if (el('sb-streak'))  el('sb-streak').textContent  = s.streak + 'd';
    if (el('sb-mastered')) el('sb-mastered').textContent = s.mastered.length;
    if (el('sb-total'))   el('sb-total').textContent   = WORDS_DB.length;
    if (el('topbar-streak'))  el('topbar-streak').textContent  = s.streak;
    if (el('topbar-mastered')) el('topbar-mastered').textContent = s.mastered.length;
  }

  
  return { toast, confetti, spawnParticles, showScreen, showPage, updateSpeedUI, updateSidebar };
})();
