/**
 * LEXIO — Page Renderers
 */

const Pages = (() => {

  // ══════════════════════════════════════════════
  // EVOLUTION
  // ══════════════════════════════════════════════
  function evolution() {
    const s        = State.get();
    const mastered = s.mastered.length;
    const total    = WORDS_DB.length;
    const pct      = Math.round((mastered / total) * 100);
    const inProg   = Object.keys(s.inProgress).length;

    Helper._set('evo-big-num',    mastered);
    Helper._set('evo-in-prog',    inProg);
    Helper._set('evo-remaining',  s.queue.length);
    Helper._set('evo-streak',     s.streak + ' 🔥');
    Helper._set('evo-mastered',   mastered);
    Helper._set('evo-inprog2',    inProg);
    Helper._set('evo-tests',      s.totalTests);
    Helper._set('evo-pct',        pct + '%');

    // ring
    const ring = document.getElementById('ring-fill');
    if (ring) {
      const c = 2 * Math.PI * 45; // r=45
      ring.style.strokeDasharray  = c;
      ring.style.strokeDashoffset = c - (pct / 100) * c;
    }

    // word map
    const map = document.getElementById('word-map');
    if (map) {
      map.innerHTML = WORDS_DB.map(w => {
        let cls = 'word-chip';
        if (s.mastered.includes(w.id))       cls += ' mastered';
        else if (w.id in s.inProgress)        cls += ' in-progress';
        return `<div class="${cls}" title="${w.pt}">${w.en}</div>`;
      }).join('');
    }

    UI.updateSidebar();
  }

  // ══════════════════════════════════════════════
  // LEARN
  // ══════════════════════════════════════════════

  function learn() {
    const container = document.getElementById('learn-content');
    const available = WORDS_DB.filter(w => State.queueIds().includes(w.id));

    if (available.length === 0) {
      container.innerHTML = Helper._emptyState(
        'LEXIO',
        'TODAS AS PALAVRAS ESTUDADAS!',
        'Vá para Testes para dominar o vocabulário e alcançar 100%.'
      ) + `<div style="padding:0 16px 16px"><button class="btn btn-magenta btn-full" onclick="UI.showPage('test')">→ IR PARA TESTES</button></div>`;
      return;
    }

    // pick word
    const s = State.get();
    let word;
    if (s.currentWordId && State.queueIds().includes(s.currentWordId)) {
      word = WORDS_DB.find(w => w.id === s.currentWordId);
    }
    if (!word) {
      word = available[Math.floor(Math.random() * available.length)];
      State.get().currentWordId = word.id;
    }

    // pick 8 random phrases
    const phrases = [...word.phrases].sort(() => Math.random() - 0.5)
                                     .slice(0, LEXIO_CONFIG.phrasesPerWord);

    // random habit tip
    const habit = HABIT_TIPS[Math.floor(Math.random() * HABIT_TIPS.length)];

    // Monta estrutura sem as imagens primeiro
    container.innerHTML = `
      <div class="learn-wrap">
        ${_wordHero(word)}
        <div id="img-grid-placeholder"></div>
        ${_phraseSection(word, phrases)}
        ${_habitBox(habit)}
      </div>
      <div class="learn-actions">
        <button class="btn btn-green" onclick="Pages.markLearned(${word.id})">✓ APRENDI!</button>
        <button class="btn btn-ghost" onclick="Pages.nextWord()">→ PRÓXIMA</button>
      </div>
    `;

    // Injeta as imagens de forma assíncrona
    _imgGrid(word).then(gridEl => {
      const placeholder = document.getElementById('img-grid-placeholder');
      if (placeholder) placeholder.replaceWith(gridEl);
    });

    // stagger phrase animations
    document.querySelectorAll('.phrase-card').forEach((el, i) => {
      el.style.animationDelay = `${0.05 * i}s`;
    });
  }

  function _wordHero(w) {
    const escaped = w.en.replace(/'/g, "\\'");
    const allPhrases = JSON.stringify(w.phrases.map(p => p.en)).replace(/"/g, '&quot;');
    const phonetic = `
    <span class="phonetic-badge">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.7"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9m0 2a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 7-7 7 7 0 0 0-7-7m1 3v3.586l2.707 2.707-1.414 1.414L11 13.414V8h2z"/><path d="M9 7c0-.552.448-1 1-1s1 .448 1 1v1H9V7z" style="display:none"/></svg>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.7;margin-right:3px"><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>
      como pronunciar: /${w.phonetic_br}/
    </span>`;

    return `
      <div class="word-hero">
        <div class="word-rank">// #${w.rank} DAS PALAVRAS MAIS USADAS EM INGLÊS</div>
        <div class="word-main-row">
          <div class="word-text">${w.en}</div>
          <div class="word-phonetic">${w.phonetic} ${phonetic}</div>
        </div>
        <div class="word-pt">${w.pt}</div>
        <div class="word-audio-row">
          <button class="play-btn" id="play-word-btn" onclick="Audio.speak('${escaped}', this)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            OUVIR PALAVRA
          </button>
          <button class="play-btn play-btn-mag" onclick="Pages._playAll(${allPhrases})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
            OUVIR FRASES
          </button>
        </div>
      </div>`;
  }

  const _imgCache = {};
  async function _imgGrid(w) {
    const container = document.createElement('div');
    container.className = 'img-grid';

    if (_imgCache[w.id]) {
      container.innerHTML = _imgCache[w.id];
      return container;
    }
    
    // Placeholder enquanto carrega
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement('div');
      slot.className = 'img-slot';
      slot.innerHTML = `<div style="width:100%;height:100%;background:var(--panel2);
                        display:flex;align-items:center;justify-content:center;
                        font-family:var(--font-mono);font-size:0.6rem;color:var(--muted)">
                        LOADING...</div>`;
      container.appendChild(slot);
    }

    try {
      const query = encodeURIComponent(w.image_keywords || w.en);
      const res   = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=4&orientation=square`,
        { headers: { Authorization: _() } }
      );
      const data  = await res.json();
      const photos = data.photos || [];

      container.innerHTML = photos.map(photo => `
        <div class="img-slot">
          <img src="${photo.src.medium}" alt="${w.en}" loading="lazy"
              onerror="this.parentElement.style.display='none'">
          <div class="img-slot-overlay"></div>
        </div>`).join('');

      // Se veio menos de 4 fotos, preenche o resto com slots vazios
      for (let i = photos.length; i < 4; i++) {
        container.innerHTML += `<div class="img-slot" style="background:var(--panel2)"></div>`;
      }

    } catch(e) {
      container.innerHTML = `<div class="img-slot" style="grid-column:span 2;
        display:flex;align-items:center;justify-content:center;
        font-family:var(--font-mono);font-size:0.6rem;color:var(--muted)">
        IMAGENS INDISPONÍVEIS</div>`;
    }

    _imgCache[w.id] = container.innerHTML;
    
    return container;
  }

  function _phraseSection(w, phrases) {
    const items = phrases.map(p => {
      const esc = p.en.replace(/'/g, "\\'");
      const highlighted = w.key
      ? p.en.replace(
          new RegExp('\\b(' + Helper._escapeRegex(w.key) + ')\\b', 'i'),
          '<span class="key">$1</span>'
        )
      : p.en;
      return `
        <div class="phrase-card">
          <button class="play-btn" style="padding:8px 12px;flex-shrink:0" onclick="Audio.speak('${esc}',this)">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <div class="phrase-body">
            <div class="phrase-en">${highlighted}</div>
            ${p.phonetic_pt ? `<div class="phrase-phonetic">
              <span class="phonetic-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.7"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9m0 2a7 7 0 0 0-7 7 7 7 0 0 0 7 7 7 7 0 0 0 7-7 7 7 0 0 0-7-7m1 3v3.586l2.707 2.707-1.414 1.414L11 13.414V8h2z"/><path d="M9 7c0-.552.448-1 1-1s1 .448 1 1v1H9V7z" style="display:none"/></svg>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.7;margin-right:3px"><path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/></svg>
                como pronunciar
              </span>
              ${p.phonetic_pt}
            </div>` : ''}
            <div class="phrase-pt">
              <span class="translation-badge">🇧🇷</span>
              ${p.pt}
            </div>
          </div>
        </div>`;
    }).join('');

    return `
      <div class="section-head">FRASES MAIS USADAS COM "${w.en.toUpperCase()}"</div>
      <div class="phrases-wrap">${items}</div>`;
  }

  function _habitBox(h) {
    return `
      <div class="habit-box">
        <div class="habit-header">
          <span class="habit-icon">${h.icon}</span>
          <span class="habit-title">${h.title.toUpperCase()}</span>
        </div>
        <div class="habit-text">${h.text}</div>
      </div>`;
  }

  async function _playAll(phrases) {
    await Audio.speakSequence(phrases, 800);
  }

  function markLearned(wordId) {
    State.markInProgress(wordId);
    UI.toast('⬡ Palavra adicionada ao banco de testes!', 'cyan');
    playSuccess();
    UI.confetti(15);
    UI.updateSidebar();
    setTimeout(() => learn(), 350);
  }

  function nextWord() {
    const available = WORDS_DB.filter(w => State.queueIds().includes(w.id));
    const current   = State.get().currentWordId;
    const others    = available.filter(w => w.id !== current);
    if (!others.length) return;
    State.get().currentWordId = others[Math.floor(Math.random() * others.length)].id;
    learn();
  }

  // ══════════════════════════════════════════════
  // TEST
  // ══════════════════════════════════════════════
  let _testAnswer = '';
  let _testWordId = null;
  let _testAttempted = false;

  function test() {
    const container = document.getElementById('test-content');
    const ids = State.inProgressIds();

    if (ids.length === 0) {
      container.innerHTML = Helper._emptyState(
        '◎',
        'NADA PARA TESTAR',
        'Marque palavras como aprendidas na seção de Aprendizado primeiro.'
      ) + `<div style="padding:0 16px 16px"><button class="btn btn-cyan btn-full" onclick="UI.showPage('learn')">→ IR PARA APRENDIZADO</button></div>`;
      return;
    }

    _testAttempted = false;
    _testWordId = ids[Math.floor(Math.random() * ids.length)];
    const word  = WORDS_DB.find(w => w.id === _testWordId);
    const mastery = State.get().inProgress[_testWordId] || 0;

    // 50/50: word or phrase
    const usePhrase = word.phrases.length > 0 && Math.random() > 0.5;
    let testEN, hintPT;
    if (usePhrase) {
      const p = word.phrases[Math.floor(Math.random() * word.phrases.length)];
      testEN = p.en; hintPT = p.pt;
    } else {
      testEN = word.en; hintPT = word.pt;
    }
    _testAnswer = testEN;

    const dots = Array(LEXIO_CONFIG.masteryThreshold).fill(0).map((_,i) =>
      `<div class="dot ${i < mastery ? 'filled' : ''}"></div>`).join('');

    container.innerHTML = `
      <div class="test-wrap">
        <div class="mastery-card">
          <div class="mastery-top">
            <div class="mastery-word">${word.en.toUpperCase()}</div>
            <div class="mastery-count">${mastery}/${LEXIO_CONFIG.masteryThreshold}</div>
          </div>
          <div class="mastery-dots">${dots}</div>
        </div>

        <div class="test-card">
          <div class="test-prompt-label">// OUÇA E ESCREVA EXATAMENTE O QUE OUVIU</div>
          <div class="test-audio-area">
            <button class="test-audio-btn" id="test-play-btn" onclick="Pages._playTest()">
              <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div class="test-hint">
              <strong>${usePhrase ? 'FRASE' : 'PALAVRA'}</strong>
              ${hintPT}
            </div>
          </div>
          <div class="test-input-wrap">
            <input type="text" class="test-input" id="test-input"
              placeholder="${usePhrase ? 'Digite a frase...' : 'Digite a palavra...'}"
              autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
              onkeydown="if(event.key==='Enter')Pages.checkTest()">
          </div>
          <div class="test-feedback" id="test-fb"></div>
          <div class="test-actions">
            <button class="btn btn-magenta" onclick="Pages.checkTest()">◎ VERIFICAR</button>
            <button class="btn btn-ghost" onclick="Pages.test()">→ PULAR</button>
          </div>
        </div>
      </div>`;

    document.getElementById('test-input').dataset.answer = testEN;
    setTimeout(() => Pages._playTest(), 500);

    // auto-focus input after audio starts
    setTimeout(() => {
      const inp = document.getElementById('test-input');
      if (inp) inp.focus();
    }, 1500);
  }

  function _playTest() {
    const btn = document.getElementById('test-play-btn');
    Audio.speak(_testAnswer, btn);
  }

  function checkTest() {
    if (_testAttempted) return;
    const input   = document.getElementById('test-input');
    const typed   = input.value.trim();
    const fb      = document.getElementById('test-fb');
    const norm    = s => s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g,' ').trim();
    const correct = norm(typed) === norm(_testAnswer);

    _testAttempted = true;

    if (correct) {
      input.classList.add('correct');

      const newCount   = State.addTestResult(_testWordId, true);
      const isMastered = State.masteredIds().includes(_testWordId);
      const hoursLeft  = State.get()._lastSkipReason || null;

      UI.confetti(12);

      if (isMastered) {
        const w = WORDS_DB.find(w => w.id === _testWordId);
        fb.className  = 'test-feedback ok';
        fb.textContent = '✓ CORRETO! Palavra dominada!';
        UI.toast(`🏆 "${w.en}" DOMINADA! Parabéns!`, 'green');
        UI.confetti(40);
      } else if (hoursLeft) {
        fb.className  = 'test-feedback ok';
        fb.textContent = `✓ CORRETO! Volte em ${hoursLeft}h para consolidar.`;
        UI.toast(`✓ Correto! Revise em ${hoursLeft}h para fixar na memória.`, 'cyan');
        State.get()._lastSkipReason = null;
      } else {
        fb.className  = 'test-feedback ok';
        fb.textContent = '✓ CORRETO! +1 ponto de domínio';
        UI.toast('✓ Correto! Continue assim.', 'cyan');
      }

      UI.updateSidebar();
      playFeedback('success', ({ msg, pt }) => {
        Helper._showSystemMessage(fb, msg, pt);
      }).then(() => {
        setTimeout(() => {
          if (isMastered && State.isAllMastered()) {
            _showWin();
          } else {
            test();
          }
        }, 2500);
      });

    } else {
      input.classList.add('wrong');
      fb.className = 'test-feedback fail';
      fb.innerHTML = `✗ Resposta correta: <strong style="color:var(--white)">${_testAnswer}</strong>`;
      State.addTestResult(_testWordId, false);
      UI.updateSidebar();
      playFeedback('error', ({ msg, pt }) => {
        Helper._showSystemMessage(fb, msg, pt);
      });
    }
  }

  function _showWin() {
    const container = document.getElementById('test-content');
    container.innerHTML = `
      <div class="empty-state" style="min-height:60vh">
        <div class="empty-icon" style="font-size:3rem;color:var(--yellow)">🏆</div>
        <div class="empty-title" style="font-size:1.2rem">VOCÊ ZEROU!</div>
        <div class="empty-sub">Você dominou todas as ${WORDS_DB.length} palavras. Vocabulário mínimo viável conquistado!</div>
      </div>`;
    UI.confetti(60);
  }

  function fuel() {
    Books.render();
  }

  return {
    evolution, learn, test, fuel,   // ← adicione fuel aqui
    markLearned, nextWord, checkTest,
    _playTest, _playAll,
  };
})();
