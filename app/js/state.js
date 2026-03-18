/**
 * LEXIO — State Management
 */

const State = (() => {
  let s = {
    loggedIn:    false,
    speed:       1,
    currentWordId: null,
    queue:       [],      // word ids not yet moved to inProgress
    inProgress:  {},      // { wordId: masteryCount }
    lastHitAt:   {},      // { wordId: timestamp (ms) do último acerto válido }
    mastered:    [],      // word ids fully mastered
    totalTests:  0,
    streak:      0,
    lastActive:  null,
  };

  async function load() {
    const saved = await DB.get('state');
    if (saved) Object.assign(s, saved);
    // init queue if first run
    if (!s.queue.length && !s.mastered.length) {
      s.queue = WORDS_DB.map(w => w.id);
      s.streak = 1;
      s.lastActive = new Date().toDateString();
    }
    // streak logic
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (s.lastActive && s.lastActive !== today && s.lastActive !== yesterday) {
      s.streak = 1;
    }
    s.lastActive = today;
    await save();
  }

  async function save() {
    await DB.set('state', { ...s });
  }

  function get()            { return s; }
  function setSpeed(v)      { s.speed = v; save(); }
  function setLogin(v)      { s.loggedIn = v; }

  function markInProgress(wordId) {
    s.queue = s.queue.filter(id => id !== wordId);
    if (!(wordId in s.inProgress)) s.inProgress[wordId] = 0;
    s.currentWordId = null;
    save();
  }

  function addTestResult(wordId, correct) {
    s.totalTests++;

    if (correct) {
      const currentHits = s.inProgress[wordId] || 0;
      const now         = Date.now();
      const lastHit     = s.lastHitAt[wordId] || 0;
      const intervalMs  = (LEXIO_CONFIG.masteryIntervals[currentHits] || 0) * 3600000;
      const elapsed     = now - lastHit;
      const intervalOk  = elapsed >= intervalMs;

      if (intervalOk) {
        // Acerto válido — avança o contador
        s.inProgress[wordId] = currentHits + 1;
        s.lastHitAt[wordId]  = now;

        if (s.inProgress[wordId] >= LEXIO_CONFIG.masteryThreshold) {
          delete s.inProgress[wordId];
          delete s.lastHitAt[wordId];
          s.mastered.push(wordId);
        }
      } else {
        // Acerto cedo demais — não avança, apenas registra o tempo
        // para não punir o usuário, só ignora silenciosamente
        const hoursLeft = Math.ceil((intervalMs - elapsed) / 3600000);
        s._lastSkipReason = hoursLeft; // opcional, para o toast
      }
    }

    save();
    return s.inProgress[wordId] ?? LEXIO_CONFIG.masteryThreshold;
  }

  function inProgressIds()  { return Object.keys(s.inProgress).map(Number); }
  function masteredIds()     { return s.mastered; }
  function queueIds()        { return s.queue; }
  function progress()        { return Math.round((s.mastered.length / WORDS_DB.length) * 100); }
  function isAllMastered()   { return s.mastered.length >= WORDS_DB.length; }

  return { load, save, get, setSpeed, setLogin, markInProgress,
           addTestResult, inProgressIds, masteredIds, queueIds,
           progress, isAllMastered };
})();
