/**
 * LEXIO — App Bootstrap & Auth
 */

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
  btn.disabled = true;

  if (LEXIO_CONFIG.demoMode && email === LEXIO_CONFIG.demoEmail) {
    await _enterApp();
    return;
  }

  // Production: call payment API
  try {
    const res = await fetch(LEXIO_CONFIG.authApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.access) {
      localStorage.setItem('lexio_session', JSON.stringify({
        email: email,
        ts: Date.now()
      }));
      await _enterApp();
    } else {
      UI.toast('Acesso negado. Verifique seu cadastro.', 'error');
      btn.textContent = 'ACESSAR SISTEMA';
      btn.disabled = false;
    }
  } catch {
    UI.toast('Erro de conexão. Tente novamente.', 'error');
    btn.textContent = 'ACESSAR SISTEMA';
    btn.disabled = false;
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
});

function doLogout() {
  localStorage.removeItem('lexio_session'); // ← adicione esta linha
  State.setLogin(false);
  window.speechSynthesis?.cancel();
  window.location.href = '../index.html';
}