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
  oneSignalAppId: "SEU-APP-ID-AQUI",

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

  // ── AUTENTICAÇÃO ─────────────────────────────────
  // URL da sua API de pagamento para validar acesso
  // Em produção substitua pela URL real
  authApiUrl: "https://lexio-auth.mksoft-web.workers.dev",

  // Para demo/desenvolvimento, deixe true para pular verificação
  demoMode: false,
  demoEmail: "demo@lexio.app",
  demoPassword: "demo123"
};
