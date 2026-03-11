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

  async function speakSequence(texts, delayMs = 700) {
    for (const t of texts) {
      await new Promise(res => {
        const utter = new SpeechSynthesisUtterance(t);
        utter.lang  = 'en-US';
        utter.rate  = State.get().speed;
        utter.onend = () => setTimeout(res, delayMs);
        window.speechSynthesis.speak(utter);
      });
    }
  }

  return { speak, speakSequence };
})();
