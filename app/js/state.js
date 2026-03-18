/**
 * LEXIO — State Management
 */

const State = (() => {
  let s = {
    loggedIn:      false,
    speed:         1,
    currentWordId: null,
    queue:         [],   // word ids not yet moved to inProgress
    inProgress:    {},   // { wordId: masteryCount }
    lastHitAt:     {},   // { wordId: timestamp (ms) do último acerto válido }
    mastered:      [],   // word ids fully mastered
    totalTests:    0,
    streak:        0,    // dias consecutivos de acesso
    totalSessions: 0,    // total de vezes que abriu o app
    lastActive:    null, // toDateString() do último acesso
    prevActive:    null, // toDateString() do penúltimo acesso (para calcular dias sem usar)
  };

  async function load() {
    const saved = await DB.get('state');
    if (saved) Object.assign(s, saved);

    // Primeiro acesso — inicializa fila
    if (!s.queue.length && !s.mastered.length) {
      s.queue        = WORDS_DB.map(w => w.id);
      s.streak       = 1;
      s.totalSessions = 1;
      s.lastActive   = new Date().toDateString();
      s.prevActive   = null;
      await save();
      return;
    }

    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    // Só processa uma vez por dia
    if (s.lastActive === today) {
      await save();
      return;
    }

    // Guarda o dia anterior antes de atualizar
    s.prevActive = s.lastActive;

    // Incrementa total de sessões
    s.totalSessions = (s.totalSessions || 0) + 1;

    // Streak
    if (s.lastActive === yesterday) {
      s.streak += 1;       // dia consecutivo — incrementa
    } else {
      s.streak = 1;        // quebrou a sequência — reseta
    }

    s.lastActive = today;
    await save();
  }

  async function save() {
    await DB.set('state', { ...s });
  }

  // Retorna quantos dias se passaram desde o último acesso
  // 0 = acessou hoje, 1 = acessou ontem, 2+ = dias sem usar
  function daysSinceLastActive() {
    if (!s.lastActive) return 0;
    const today      = new Date().setHours(0, 0, 0, 0);
    const lastActive = new Date(s.lastActive).setHours(0, 0, 0, 0);
    return Math.floor((today - lastActive) / 86400000);
  }

  // Retorna o nível de engajamento do usuário
  // Usado pelo UI para montar o indicador quente/frio
  function engagementLevel() {
    const days = daysSinceLastActive();
    const streak = s.streak || 0;

    if (days === 0 && streak >= 7)  return 'hot';      // 🔥 7+ dias seguidos
    if (days === 0 && streak >= 3)  return 'warm';     // estudando bem
    if (days === 0 && streak >= 1)  return 'active';   // acessou hoje
    if (days === 1)                 return 'cooling';  // ontem foi o último
    if (days <= 3)                  return 'cold';     // alguns dias sem usar
    return 'frozen';                                   // 4+ dias sumido
  }

  function get()           { return s; }
  function setSpeed(v)     { s.speed = v; save(); }
  function setLogin(v)     { s.loggedIn = v; }

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
        s.inProgress[wordId] = currentHits + 1;
        s.lastHitAt[wordId]  = now;

        if (s.inProgress[wordId] >= LEXIO_CONFIG.masteryThreshold) {
          delete s.inProgress[wordId];
          delete s.lastHitAt[wordId];
          s.mastered.push(wordId);
        }
      } else {
        const hoursLeft = Math.ceil((intervalMs - elapsed) / 3600000);
        s._lastSkipReason = hoursLeft;
      }
    }

    save();
    return s.inProgress[wordId] ?? LEXIO_CONFIG.masteryThreshold;
  }

  function inProgressIds() { return Object.keys(s.inProgress).map(Number); }
  function masteredIds()    { return s.mastered; }
  function queueIds()       { return s.queue; }
  function progress()       { return Math.round((s.mastered.length / WORDS_DB.length) * 100); }
  function isAllMastered()  { return s.mastered.length >= WORDS_DB.length; }

  return {
    load, save, get, setSpeed, setLogin,
    markInProgress, addTestResult,
    inProgressIds, masteredIds, queueIds,
    progress, isAllMastered,
    daysSinceLastActive, engagementLevel
  };
})();