/**
 * LEXIO — CONFIGURAÇÕES GERAIS
 * =====================================================
 * Edite aqui as configurações principais do app.
 * =====================================================
 */

const LEXIO_CONFIG = {

  // ── IDENTIDADE ──────────────────────────────────
  appName:    "LEXIO",
  appTagline: "ENGLISH MASTERY SYSTEM",
  appVersion: "1.0.0",

  // ── ONESIGNAL (Push Notifications) ──────────────
  // 1. Crie uma conta em https://onesignal.com
  // 2. Crie um novo App → Web Push
  // 3. Cole aqui o App ID gerado
  oneSignalAppId: "b4c0f417-55a5-43ea-a87f-ee4e93d14ac6",

  // ── LEMBRETES (horários de push notification) ───
  // Configurados via OneSignal Dashboard → Automated Messages
  reminderMessages: [
    "⚡ Hora de treinar! Seu streak está te esperando no LEXIO.",
    "🎯 5 minutos de inglês hoje fazem diferença. Vamos lá?",
    "🔥 Não quebre sua sequência! Abra o LEXIO agora.",
    "💡 Nova palavra te esperando. Abre o app!",
    "⚡ Seu cérebro aprende mais quando você é consistente. Hoje é o dia!"
  ],

  // ── GAME ────────────────────────────────────────
  // Quantas frases sortear por palavra na tela de aprendizado
  phrasesPerWord: 8,

  // Quantos acertos no teste para considerar palavra "dominada"
  masteryThreshold: 5,

  // Intervalo mínimo em horas entre cada acerto válido
  // Índice = acerto que está PRESTES a acontecer (0-based)
  // Acerto 1 (idx 0): sem intervalo
  // Acerto 2 (idx 1): 2h
  // Acerto 3 (idx 2): 24h
  // Acerto 4 (idx 3): 72h  (3 dias)
  // Acerto 5 (idx 4): 168h (7 dias)
  masteryIntervals: [0, 2, 24, 72, 168],
  
  // ── AUTENTICAÇÃO ─────────────────────────────────
  // URL da sua API de pagamento para validar acesso
  // Em produção substitua pela URL real
  authApiUrl: "https://lexio-auth.mksoft-web.workers.dev",

  // Para demo/desenvolvimento, deixe true para pular verificação
  demoMode: false,
  demoEmail: "demo@lexio.app"
};
