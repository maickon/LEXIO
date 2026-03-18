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

  // ── ENGAGEMENT INDICATOR ─────────────────────────
  const _engagement = {
    hot:     { icon: '🔥', label: 'VOCÊ ESTÁ EM CHAMAS',     color: '#ff6b00', bg: 'rgba(255,107,0,0.08)',  border: 'rgba(255,107,0,0.25)' },
    warm:    { icon: '⚡', label: 'RITMO FORTE',              color: '#ffdd00', bg: 'rgba(255,221,0,0.06)',  border: 'rgba(255,221,0,0.2)'  },
    active:  { icon: '✅', label: 'ESTUDANDO HOJE',           color: '#00ff88', bg: 'rgba(0,255,136,0.06)', border: 'rgba(0,255,136,0.2)'  },
    cooling: { icon: '🌤️', label: 'ESFRIANDO — VOLTE AMANHÃ', color: '#00f5ff', bg: 'rgba(0,245,255,0.05)', border: 'rgba(0,245,255,0.15)' },
    cold:    { icon: '❄️', label: 'FRIO — RETOME O HÁBITO',   color: '#a78bfa', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.2)' },
    frozen:  { icon: '💀', label: 'INATIVO — RECOMECE AGORA', color: '#ff00aa', bg: 'rgba(255,0,170,0.06)', border: 'rgba(255,0,170,0.2)'  },
  };

  function _engagementSubtext(level, s) {
    const days = State.daysSinceLastActive();
    switch (level) {
      case 'hot':
        return `${s.streak} dias seguidos · ${s.totalSessions} sessões no total`;
      case 'warm':
        return `${s.streak} dias consecutivos · continue assim`;
      case 'active':
        return `Streak atual: ${s.streak} dia${s.streak !== 1 ? 's' : ''} · ${s.totalSessions} sessões no total`;
      case 'cooling':
        return `Último acesso ontem · streak em risco`;
      case 'cold':
        return `${days} dias sem estudar · streak zerado`;
      case 'frozen':
        return `${days} dias de inatividade · cada dia conta`;
      default:
        return '';
    }
  }

  function renderEngagement(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const s     = State.get();
    const level = State.engagementLevel();
    const cfg   = _engagement[level];
    const sub   = _engagementSubtext(level, s);

    container.innerHTML = '';

    const card = document.createElement('div');
    card.style.cssText = `
      display:flex;align-items:center;gap:14px;
      background:${cfg.bg};
      border:1px solid ${cfg.border};
      border-radius:12px;
      padding:14px 16px;
    `;

    // Ícone
    const icon = document.createElement('div');
    icon.style.cssText = 'font-size:1.6rem;flex-shrink:0;line-height:1';
    icon.textContent = cfg.icon;
    card.appendChild(icon);

    // Textos
    const texts = document.createElement('div');
    texts.style.cssText = 'flex:1;min-width:0';

    const label = document.createElement('div');
    label.style.cssText = `
      font-family:var(--font-display);font-size:0.72rem;font-weight:700;
      color:${cfg.color};letter-spacing:0.1em;margin-bottom:3px;
    `;
    label.textContent = cfg.label;

    const subtext = document.createElement('div');
    subtext.style.cssText = 'font-size:0.78rem;color:rgba(236,238,255,0.5);';
    subtext.textContent = sub;

    texts.appendChild(label);
    texts.appendChild(subtext);
    card.appendChild(texts);

    // Mini stats lado direito
    const stats = document.createElement('div');
    stats.style.cssText = `
      display:flex;flex-direction:column;align-items:flex-end;
      gap:4px;flex-shrink:0;
    `;

    const statStreak = document.createElement('div');
    statStreak.style.cssText = `
      font-family:var(--font-mono);font-size:0.65rem;
      color:${cfg.color};white-space:nowrap;
    `;
    statStreak.textContent = `🔥 ${s.streak}d streak`;

    const statSessions = document.createElement('div');
    statSessions.style.cssText = `
      font-family:var(--font-mono);font-size:0.62rem;
      color:rgba(236,238,255,0.3);white-space:nowrap;
    `;
    statSessions.textContent = `${s.totalSessions || 1} sessões`;

    stats.appendChild(statStreak);
    stats.appendChild(statSessions);
    card.appendChild(stats);

    container.appendChild(card);
  }

  // ── SIDEBAR STATS ────────────────────────────────
  function updateSidebar() {
    const s = State.get();
    const el = (id) => document.getElementById(id);
    if (el('sb-streak'))       el('sb-streak').textContent       = s.streak + 'd';
    if (el('sb-mastered'))     el('sb-mastered').textContent     = s.mastered.length;
    if (el('sb-total'))        el('sb-total').textContent        = WORDS_DB.length;
    if (el('topbar-streak'))   el('topbar-streak').textContent   = s.streak;
    if (el('topbar-mastered')) el('topbar-mastered').textContent = s.mastered.length;

    // Atualiza indicador de engajamento se estiver visível
    if (document.getElementById('engagement-indicator')) {
      renderEngagement('engagement-indicator');
    }
  }

  // ── MODAL DE LICENÇA EXPIRADA ─────────────────────
  function showExpiredModal(email, purchasedAt, expiresAt) {
    const old = document.getElementById('expired-modal');
    if (old) old.remove();

    const msgs = LEXIO_CONFIG.license.expiredMessages;
    const msg  = msgs[Math.floor(Math.random() * msgs.length)];

    const fmt = iso => new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    const modal = document.createElement('div');
    modal.id = 'expired-modal';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      display:flex;align-items:center;justify-content:center;
      padding:20px;background:rgba(0,0,0,0.75);
      backdrop-filter:blur(6px);animation:fadeIn 0.25s ease;
    `;

    const card = document.createElement('div');
    card.style.cssText = `
      background:var(--panel);border:1px solid var(--border);
      border-radius:16px;max-width:420px;width:100%;
      position:relative;overflow:hidden;
    `;

    const topBar = document.createElement('div');
    topBar.style.cssText = 'height:3px;background:linear-gradient(90deg,var(--magenta),var(--yellow))';
    card.appendChild(topBar);

    const btnClose = document.createElement('button');
    btnClose.textContent = '✕';
    btnClose.style.cssText = `
      position:absolute;top:14px;right:14px;
      background:transparent;border:none;
      color:var(--muted2);cursor:pointer;
      font-size:1.1rem;line-height:1;padding:4px;
    `;
    btnClose.addEventListener('click', () => modal.remove());
    card.appendChild(btnClose);

    const body = document.createElement('div');
    body.style.cssText = 'padding:28px 24px 24px';

    const titulo = document.createElement('div');
    titulo.innerHTML = `
      <div style="font-size:2rem;margin-bottom:10px">⏳</div>
      <div style="
        font-family:var(--font-display);font-size:1.1rem;font-weight:900;
        color:var(--yellow);margin-bottom:6px;line-height:1.3;
      ">SUA LICENÇA EXPIROU</div>
    `;
    body.appendChild(titulo);

    const infoDatas = document.createElement('div');
    infoDatas.style.cssText = `
      background:rgba(255,255,255,0.03);border:1px solid var(--border);
      border-radius:10px;padding:14px 16px;margin:16px 0;
      display:flex;flex-direction:column;gap:8px;
    `;
    infoDatas.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:var(--font-mono);font-size:0.62rem;color:var(--muted2);letter-spacing:0.1em">INÍCIO</span>
        <span style="font-size:0.85rem;color:var(--white)">${fmt(purchasedAt)}</span>
      </div>
      <div style="height:1px;background:var(--border)"></div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:var(--font-mono);font-size:0.62rem;color:var(--muted2);letter-spacing:0.1em">EXPIROU EM</span>
        <span style="font-size:0.85rem;color:var(--magenta)">${fmt(expiresAt)}</span>
      </div>
      <div style="height:1px;background:var(--border)"></div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:var(--font-mono);font-size:0.62rem;color:var(--muted2);letter-spacing:0.1em">EMAIL</span>
        <span style="font-size:0.82rem;color:var(--muted2)">${email}</span>
      </div>
    `;
    body.appendChild(infoDatas);

    const motivacao = document.createElement('div');
    motivacao.style.cssText = `
      border-left:3px solid var(--yellow);padding:12px 14px;
      margin-bottom:20px;background:rgba(255,221,0,0.04);
      border-radius:0 8px 8px 0;
    `;
    motivacao.innerHTML = `
      <div style="
        font-family:var(--font-display);font-size:0.82rem;font-weight:700;
        color:var(--yellow);margin-bottom:6px;
      ">${msg.headline}</div>
      <div style="font-size:0.82rem;color:rgba(236,238,255,0.7);line-height:1.6">
        ${msg.body}
      </div>
    `;
    body.appendChild(motivacao);

    const btnRenovar = document.createElement('a');
    btnRenovar.href   = LEXIO_CONFIG.license.buyUrl;
    btnRenovar.target = '_blank';
    btnRenovar.rel    = 'noopener';
    btnRenovar.style.cssText = `
      display:flex;align-items:center;justify-content:center;gap:8px;
      width:100%;padding:13px;box-sizing:border-box;
      background:linear-gradient(135deg,var(--magenta),var(--yellow));
      color:#111;font-family:var(--font-mono);font-size:0.78rem;
      font-weight:700;letter-spacing:0.1em;border-radius:10px;
      text-decoration:none;transition:all 0.2s;
    `;
    btnRenovar.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
      </svg>
      RENOVAR ACESSO — 1 ANO
    `;
    btnRenovar.addEventListener('mouseover', () => {
      btnRenovar.style.opacity   = '0.9';
      btnRenovar.style.transform = 'translateY(-1px)';
    });
    btnRenovar.addEventListener('mouseout', () => {
      btnRenovar.style.opacity   = '1';
      btnRenovar.style.transform = 'none';
    });
    body.appendChild(btnRenovar);

    const rodape = document.createElement('div');
    rodape.style.cssText = `
      text-align:center;margin-top:12px;
      font-size:0.7rem;color:var(--muted2);line-height:1.5;
    `;
    rodape.innerHTML = `
      Após a renovação, volte aqui e faça login normalmente.<br>
      Seu progresso está salvo e será mantido.
    `;
    body.appendChild(rodape);

    card.appendChild(body);
    modal.appendChild(card);
    document.body.appendChild(modal);

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove();
    });
  }

  return {
    toast, confetti, spawnParticles,
    showScreen, showPage,
    updateSpeedUI, updateSidebar,
    renderEngagement,
    showExpiredModal
  };
})();