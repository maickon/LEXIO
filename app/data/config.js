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

  // ── CONFIGURAÇÃO DE LICENÇA E RENOVAÇÃO ──────────────
  license: {
    // Link de compra/renovação na Hotmart
    buyUrl: 'https://pay.hotmart.com/M104847735W?checkoutMode=10',

    // Mensagens motivacionais para usuários com licença expirada
    expiredMessages: [
      {
        headline: "Você chegou longe. Não pare agora.",
        body: "Quem estuda com consistência por 1 ano cobre as 1.000 palavras mais usadas do inglês — e isso representa 85% de toda conversa cotidiana. Se você chegou até aqui, já tem uma base real. Renovar agora significa não perder nenhum progresso e continuar de onde parou."
      },
      {
        headline: "Um ano de hábito vale mais do que dez anos de intenção.",
        body: "Você construiu um hábito real de estudo. Isso é mais difícil do que parece — e mais valioso do que qualquer vocabulário isolado. Renovar o LEXIO por mais um ano significa manter vivo o sistema que já está funcionando no seu cérebro."
      },
      {
        headline: "Sua memória não esquece o que você treinou.",
        body: "A neurociência é clara: vocabulário consolidado pela repetição espaçada não some com o tempo. O que você aprendeu está gravado. Renovar agora significa continuar construindo em cima de uma fundação sólida — não recomeçar do zero."
      },
      {
        headline: "85% de fluência está ao seu alcance.",
        body: "As 1.000 palavras mais usadas do inglês cobrem 85% de toda conversa cotidiana. Se você ainda não chegou lá, cada dia que passa sem estudar é um dia a menos para fechar essa conta. Renove e continue de onde parou."
      },
      {
        headline: "O inglês que você tem hoje já vale muito.",
        body: "Cada palavra que você dominou já está ativa na sua memória de longo prazo. Renovar o LEXIO não é recomeçar — é continuar uma jornada que já está produzindo resultados reais na sua vida."
      }
    ],
  },

  // Para demo/desenvolvimento, deixe true para pular verificação
  demoMode: false,
  demoEmail: "demo@lexio.app"
};
