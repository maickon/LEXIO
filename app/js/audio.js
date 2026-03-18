/**
 * LEXIO — Audio / TTS
 */

const Audio = (() => {
  let activeBtn = null;

  function speak(text, btnEl) {
    if (!('speechSynthesis' in window)) {
      UI.toast('Seu navegador não suporta áudio', 'warn');
      return;
    }
    window.speechSynthesis.cancel();
    if (activeBtn) activeBtn.classList.remove('playing');

    const utter       = new SpeechSynthesisUtterance(text);
    utter.lang        = 'en-US';
    utter.rate        = State.get().speed;
    utter.pitch       = 1;

    if (btnEl) {
      activeBtn = btnEl;
      btnEl.classList.add('playing');
      utter.onend = () => { btnEl.classList.remove('playing'); activeBtn = null; };
    }
    window.speechSynthesis.speak(utter);
  }

  async function speakSequence(texts, delayMs = 700, onEachStart = null) {
    for (let i = 0; i < texts.length; i++) {
      if (onEachStart) onEachStart(i);
      await new Promise(res => {
        const utter = new SpeechSynthesisUtterance(texts[i]);
        utter.lang  = 'en-US';
        utter.rate  = State.get().speed;
        utter.onend = () => setTimeout(res, delayMs);
        window.speechSynthesis.speak(utter);
      });
    }
  }

  return { speak, speakSequence };
})();


// ── Arrays de mensagens de feedback ──────────────
const SUCCESS_MESSAGES = [
  { en: "Perfect! Keep it up!",                          pt: "Perfeito! Continue assim!" },
  { en: "Excellent! You're doing great!",                pt: "Excelente! Você está indo muito bem!" },
  { en: "Well done! One step closer to fluency!",        pt: "Muito bem! Um passo mais perto da fluência!" },
  { en: "Awesome! Your English is improving!",           pt: "Incrível! Seu inglês está melhorando!" },
  { en: "Correct! You're on fire today!",                pt: "Correto! Você está em chamas hoje!" },
  { en: "Great job! That one's locked in your memory now!", pt: "Ótimo trabalho! Essa já está gravada na sua memória!" }
];

const ERROR_MESSAGES = [
  { en: "Don't give up! Try again, you can do it!",              pt: "Não desista! Tente de novo, você consegue!" },
  { en: "Almost there! Listen carefully and try once more.",     pt: "Quase lá! Ouça com atenção e tente mais uma vez." },
  { en: "Keep going! Every mistake is a step forward.",          pt: "Continue! Cada erro é um passo à frente." },
  { en: "No worries! Repetition is how we learn.",               pt: "Sem problema! A repetição é como aprendemos." },
  { en: "You'll get it! Listen again and give it another shot.", pt: "Você vai conseguir! Ouça de novo e tente." },
  { en: "Stay strong! Even natives had to practice.",            pt: "Seja forte! Até nativos precisaram praticar." }
];

// ── Beep via Web Audio API ────────────────────────
function playBeep(type) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);       // Lá5 — tom alto/feliz
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);       // tom baixo/grave
      osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch(e) {
    // Web Audio não disponível — ignora silenciosamente
  }
}

// ── Feedback completo: beep + mensagem falada ─────
function playFeedback(type, onReady) {
  const messages = type === 'success' ? SUCCESS_MESSAGES : ERROR_MESSAGES;
  const item     = messages[Math.floor(Math.random() * messages.length)];
  const msg      = item.en;
  const pt       = item.pt;

  playBeep(type);

  // Chama onReady imediatamente após o beep — balão aparece na tela
  if (onReady) onReady({ msg, pt });

  return new Promise(resolve => {
    setTimeout(() => {
      if (!('speechSynthesis' in window)) { resolve(); return; }
      window.speechSynthesis.cancel();

      const utter   = new SpeechSynthesisUtterance(msg);
      utter.lang    = 'en-US';
      utter.rate    = 1;
      utter.onend   = () => resolve();
      utter.onerror = () => resolve();

      window.speechSynthesis.speak(utter);
    }, 500);
  });
}

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Três notas ascendentes: Dó → Mi → Sol (acorde de vitória)
    const notes = [
      { freq: 523.25, start: 0.00, dur: 0.12 },   // C5
      { freq: 659.25, start: 0.10, dur: 0.12 },   // E5
      { freq: 783.99, start: 0.20, dur: 0.22 },   // G5
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc   = ctx.createOscillator();
      const gain  = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      // Ataque rápido, decay suave
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    });

  } catch (e) {
    // Silencia sem quebrar nada se o browser bloquear
  }
}