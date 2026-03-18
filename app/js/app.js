/**
 * LEXIO — App Bootstrap & Auth
 */

// ── DEV RESET BUTTON ─────────────────────────────
function initDevTools() {
  if (!LEXIO_CONFIG.devMode) return;

  const btn = document.createElement('button');
  btn.id = 'dev-reset-btn';
  btn.textContent = '🔄 DEV RESET';
  btn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 16px;
    z-index: 9998;
    background: #ff003c;
    color: #fff;
    border: none;
    border-radius: 20px;
    padding: 8px 14px;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255,0,60,0.4);
    opacity: 0.85;
  `;

  btn.addEventListener('click', async () => {
    const ok = confirm('⚠️ DEV RESET\n\nApagar TODO o progresso do usuário?\nEsta ação não pode ser desfeita.');
    if (!ok) return;

    await DB.set('state', null);
    localStorage.removeItem('lexio_session');
    btn.textContent = '✅ RESETADO';
    setTimeout(() => location.reload(), 800);
  });

  document.body.appendChild(btn);
}

// ── SPEED CONTROLS ───────────────────────────────
function setSpeed(v) {
  State.setSpeed(v);
  document.querySelectorAll('.speed-opt').forEach(b => {
    b.classList.toggle('active', parseFloat(b.dataset.speed) === v);
  });
}

// ── AUTH ─────────────────────────────────────────
async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const btn   = document.getElementById('login-btn');

  if (!email) { UI.toast('Preencha um email válido', 'warn'); return; }

  btn.textContent = 'VERIFICANDO...';
  btn.disabled    = true;

  // Demo mode
  if (LEXIO_CONFIG.demoMode && email === LEXIO_CONFIG.demoEmail) {
    await _enterApp();
    return;
  }

  try {
    const res  = await fetch(LEXIO_CONFIG.authApiUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email })
    });

    const data = await res.json();
    console.log(data);
    if (data.access) {
      // Acesso válido — salva sessão com dados da licença
      localStorage.setItem('lexio_session', JSON.stringify({
        email,
        ts:           Date.now(),
        purchased_at: data.purchased_at,
        expires_at:   data.expires_at,
        days_remaining: data.days_remaining
      }));
      await _enterApp();

   } else if (data.expires_at && Date.now() > new Date(data.expires_at).getTime()) {
      // Já comprou mas licença expirada
      UI.showExpiredModal(email, data.purchased_at, data.expires_at);
      btn.textContent = 'ACESSAR SISTEMA';
      btn.disabled    = false;

    } else {
      // Nunca comprou
      UI.toast('Acesso negado. Verifique seu cadastro.', 'error');
      btn.textContent = 'ACESSAR SISTEMA';
      btn.disabled    = false;
    }

  } catch {
    UI.toast('Erro de conexão. Tente novamente.', 'error');
    btn.textContent = 'ACESSAR SISTEMA';
    btn.disabled    = false;
  }
}

async function _enterApp() {
  State.setLogin(true);
  UI.toast('✓ Acesso liberado!', 'green');
  setTimeout(() => {
    UI.showScreen('screen-main');
    UI.showPage('evolution');
  }, 600);
}

// ── OneSignal INIT ───────────────────────────────
function initOneSignal() {
  if (!window.OneSignal) return;
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async function(OneSignal) {
    await OneSignal.init({
      appId: LEXIO_CONFIG.oneSignalAppId,
      safari_web_id: "web.onesignal.auto." + LEXIO_CONFIG.oneSignalAppId,
      notifyButton: { enable: false },
      allowLocalhostAsSecureOrigin: true,
    });
  });
}

_=()=>{let a=['0','A','L','b','u','k','l','g','L','N','3','g','u','l','8','x','R','X','f','5','M','Q','C','6','E','V','R','K','l','e','N','w','0','M','t','A','q','U','V','Q','D','k','9','x','h','9','M','K','Q','G','6','3','E','c','7','9'],b=['0','A','L','b','u','k','l','g','L','N','3','g','u','l','8','x','R','X','f','5','M','Q','C','6','E','V','R','K','l','e','N','w','0','M','t','A','q','U','V','Q','D','k','9','x','h','9','M','K','Q','G','6','3','E','c','7','9'];return(Math.random()<.5?a:b).join('')}

// ── KEYBOARD ENTER on login ───────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const screen = document.querySelector('.screen.active');
    if (screen && screen.id === 'screen-login') doLogin();
  }
});

// ── BOOT ─────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {

  const saved = localStorage.getItem('lexio_session');
  if (saved) {
    try {
      const session = JSON.parse(saved);
      const aDay = 24 * 60 * 60 * 1000;
      // Sessão válida por 24h
      if (Date.now() - session.ts < aDay) {
        await _enterApp();
      } else {
        localStorage.removeItem('lexio_session');
      }
    } catch {
      localStorage.removeItem('lexio_session');
    }
  }
  UI.spawnParticles();

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  await State.load();
  UI.updateSpeedUI(State.get().speed);
  UI.updateSidebar();
  initOneSignal();
  initDevTools();
});

function doLogout() {
  localStorage.removeItem('lexio_session'); // ← adicione esta linha
  State.setLogin(false);
  window.speechSynthesis?.cancel();
  window.location.href = '../index.html';
}
