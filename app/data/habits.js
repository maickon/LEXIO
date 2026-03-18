/**
 * LEXIO — DICAS DE HÁBITOS
 * =====================================================
 * Adicione ou edite as dicas que aparecem na tela
 * de aprendizado para motivar o estudo offline.
 * =====================================================
 */

const HABIT_TIPS = [
  {
    icon: "📌",
    title: "Post-it Strategy",
    text: "Escreva esta palavra e suas 3 frases favoritas num post-it. Cole no espelho do banheiro — você vai ver toda manhã sem esforço nenhum. Exposição passiva repetida é uma das formas mais subestimadas de fixação vocabular."
  },
  {
    icon: "📱",
    title: "Wallpaper Hack",
    text: "Mude o wallpaper de bloqueio do celular para uma foto anotada com a palavra. Você desbloqueia o celular umas 80 vezes por dia — isso é repetição completamente grátis sem tirar nenhum minuto da sua rotina."
  },
  {
    icon: "🌙",
    title: "Revisão Noturna",
    text: "Antes de dormir, repita as frases em voz alta 3 vezes. Estudos de neurociência do sono (Walker, 2017) mostram que o hipocampo reativa memórias recentes durante o sono REM — você literalmente acorda sabendo mais do que foi dormir."
  },
  {
    icon: "✍️",
    title: "Escrita à Mão",
    text: "Escreva a palavra e as frases à mão no papel. A memória motora é codificada em uma região diferente do cérebro — o cerebelo. Escrever ativa três sistemas simultaneamente: visual, fonológico e motor. É três vezes mais poderoso do que só ler."
  },
  {
    icon: "🗣️",
    title: "Use no Chat",
    text: "Mande uma mensagem para alguém usando essa palavra em inglês ainda hoje. Usar no mundo real força o cérebro a ativar o vocabulário produtivo — a diferença entre entender quando lê e conseguir falar quando precisa."
  },
  {
    icon: "⏰",
    title: "Âncora de Hábito",
    text: "James Clear, em Hábitos Atômicos, explica que novos hábitos grudam quando anexados a comportamentos já existentes. Escolha um ritual diário seu — café, escova de dentes, almoço — e use essa palavra numa frase mental toda vez. Em 21 dias vira automático."
  },
  {
    icon: "🖊️",
    title: "Caderno de Campo",
    text: "Tenha um caderno pequeno só para inglês. Anote as palavras com uma frase que você mesmo inventou — sobre sua vida, seu trabalho, sua rotina. O cérebro retém muito melhor o que é pessoal e emocionalmente relevante. Isso se chama Efeito de Autorreferência na psicologia cognitiva."
  },
  {
    icon: "🔁",
    title: "Revisão Relâmpago",
    text: "A janela de 24 horas após aprender algo novo é o momento mais eficiente para revisar. Uma revisão rápida nesse ponto pode dobrar a retenção de longo prazo. Quando abrir o LEXIO amanhã, os primeiros 5 minutos são os mais valiosos do dia."
  },
  {
    icon: "👄",
    title: "Como Usar a Pronúncia Aportuguesada",
    text: "A linha em roxo embaixo de cada frase em inglês não é a tradução — é o som do inglês escrito em português. Leia ela em voz alta como se fosse português mesmo. Seu cérebro vai produzir automaticamente uma pronúncia muito próxima do inglês real. É uma ponte fonética, não uma regra — use ela até o som entrar no ouvido."
  },
  {
    icon: "🔊",
    title: "Ouça Primeiro, Leia Depois",
    text: "Antes de ler a frase em inglês, clique em ouvir e tente escrever o que escutou. Depois confira. Esse exercício ativa a percepção fonética — a habilidade que separa quem entende nativos de quem só lê bem. É diferente de saber vocabulário, e precisa ser treinada separadamente."
  },
  {
    icon: "🧠",
    title: "Seu Cérebro Aprende Dormindo",
    text: "A consolidação da memória não acontece enquanto você estuda — acontece enquanto você dorme. Cada noite de sono após uma sessão de estudo é uma sessão de fixação gratuita. Dormir mal na noite após aprender algo novo pode apagar até 40% do que foi absorvido, segundo estudos de Matthew Walker (Why We Sleep, 2017)."
  },
  {
    icon: "🎯",
    title: "Identidade Antes de Meta",
    text: "James Clear ensina que hábitos duradouros nascem de identidade, não de força de vontade. Em vez de pensar 'quero aprender inglês', pense 'sou alguém que estuda inglês todo dia'. Essa virada muda o que você faz quando está cansado, sem motivação ou com preguiça — que é exatamente quando o hábito é testado."
  },
  {
    icon: "🗺️",
    title: "Mapa Mental Sonoro",
    text: "Quando aprender uma palavra nova, feche os olhos e crie uma cena mental com ela. Visualize o objeto, a ação, o lugar. Quanto mais vívida a imagem, mais forte a memória. A Teoria do Duplo Código de Paivio (1971) confirma: palavras com imagem mental associada são retidas com o dobro da eficiência."
  },
  {
    icon: "📺",
    title: "Legenda como Treino",
    text: "Assista qualquer série com legenda em inglês — não em português. O cérebro faz uma associação direta entre o som e a forma escrita da palavra, sem passar pela tradução. Você vai começar a reconhecer as palavras que aprendeu no LEXIO aparecendo nas cenas. Cada reconhecimento é um reforço gratuito."
  },
  {
    icon: "🎵",
    title: "Músicas são Repetição Espaçada Disfarçada",
    text: "Escolha uma música em inglês que você gosta e pesquise a letra. Identifique as palavras que você já aprendeu no LEXIO. Ouvir a mesma música dezenas de vezes sem perceber é repetição espaçada natural — o mesmo princípio científico que o sistema usa, só que embalado em algo que você faz por prazer."
  },
  {
    icon: "⚡",
    title: "O Efeito dos 2 Minutos",
    text: "James Clear descreve o Efeito dos 2 Minutos: se uma tarefa leva menos de 2 minutos, faça agora. Toda palavra nova pode ser revisada em 2 minutos. A barreira para começar é o maior inimigo do hábito — quando a ação é mínima, a consistência vira consequência natural."
  },
  {
    icon: "👂",
    title: "Treine o Ouvido, Não Só a Vista",
    text: "O maior problema de quem aprende inglês lendo é o seguinte: o cérebro cria uma representação visual da palavra, não sonora. Aí quando ouve um nativo falar, não reconhece. Por isso o LEXIO é baseado em áudio — cada teste auditivo está treinando o circuito neural certo, o que reconhece sons, não letras."
  },
  {
    icon: "🔤",
    title: "Decodificando a Pronúncia Aportuguesada",
    text: "'dh' é o som do 'th' de 'the' — língua levemente entre os dentes, como se fosse um 'd' suave. 'rr' é o r americano retroflex — sem vibrar, como engolir o r. 'â' é o som de 'but' — um 'a' central e curto. Esses três sons são os que mais travam brasileiros. A linha em roxo foi criada exatamente para você treinar eles sem precisar saber fonética."
  },
  {
    icon: "📊",
    title: "Pequeno Todo Dia Bate Grande Às Vezes",
    text: "Pesquisas de aquisição de vocabulário em L2 mostram consistentemente que 10 minutos diários produzem retenção superior a 70 minutos uma vez por semana — mesmo com o mesmo total de horas. O motivo é o sono entre as sessões. Cada noite é uma consolidação. Mais sessões = mais consolidações = mais retenção."
  },
  {
    icon: "🌍",
    title: "Fale Errado. Fale Mesmo Assim.",
    text: "O maior bloqueio de brasileiros aprendendo inglês não é vocabulário — é o medo de errar. A ciência do aprendizado motor (Schmidt & Lee, 2011) mostra que errar e corrigir é o mecanismo exato pelo qual o cérebro aprende. Falar errado e ser corrigido grava mais do que falar certo em silêncio. Use a palavra. Erre. Corrija. Repita."
  },
  {
    icon: "🏷️",
    title: "Etiquete Sua Casa",
    text: "Imprima ou escreva etiquetas em inglês e cole nos objetos da sua casa — geladeira, porta, janela, espelho, cadeira. Toda vez que seus olhos pousarem no objeto, o cérebro faz a associação automaticamente. Sem esforço. Sem tempo extra. É o ambiente trabalhando pelo seu aprendizado enquanto você vive sua vida normal."
  },
  {
    icon: "🧩",
    title: "Contexto Antes de Tradução",
    text: "Quando encontrar uma palavra desconhecida em inglês, tente adivinhar o significado pelo contexto da frase antes de olhar a tradução. Esse exercício ativa o processamento profundo — o nível cognitivo em que a memória de longo prazo é formada. Craik & Lockhart (1972) chamaram isso de Níveis de Processamento: quanto mais você pensa na palavra, mais forte ela grava."
  },
  {
    icon: "🎤",
    title: "Sussurre as Frases",
    text: "Quando estiver lendo as frases no LEXIO, sussurre elas em voz baixa em vez de só ler com os olhos. A articulação dos sons ativa o córtex motor da fala — uma região que não é ativada pela leitura silenciosa. Você está literalmente treinando a boca a formar os sons do inglês, não só o cérebro a reconhecê-los."
  },
  {
    icon: "📅",
    title: "O Sistema Bate a Motivação",
    text: "Motivação é instável — aparece quando você está animado e some quando está cansado. James Clear deixa claro: campeões não dependem de motivação, dependem de sistemas. O LEXIO é o sistema. Sua única tarefa é abrir o app. O sistema faz o resto — decide o que revisar, quando revisar e como testar. Você só precisa aparecer."
  },
  {
    icon: "📖",
    title: "Tim Ferriss — The 4-Hour Chef",
    text: "Tim Ferriss estudou 12 idiomas e identificou que toda língua tem um 'código mínimo viável': as estruturas e palavras de maior frequência que desbloqueiam 80% da comunicação. Ele chama isso de DiSSS — Deconstruction, Selection, Sequencing, Stakes. O LEXIO já fez o DiSSS pelo inglês por você. Sua única tarefa é aparecer todo dia."
  },
  {
    icon: "🧘",
    title: "Cal Newport — Deep Work",
    text: "Cal Newport prova que sessões curtas de foco total superam horas de estudo distraído. 10 minutos no LEXIO com o celular no silêncio e a atenção inteira vale mais do que 1 hora estudando com notificações chegando. Profundidade bate duração. Sempre."
  },
  {
    icon: "🚀",
    title: "Carol Dweck — Mindset",
    text: "A pesquisadora de Stanford Carol Dweck descobriu que pessoas com Mindset de Crescimento — que acreditam que habilidades são desenvolvidas, não inatas — aprendem idiomas significativamente mais rápido. 'Não sei inglês' é Mindset Fixo. 'Ainda não sei inglês' é Mindset de Crescimento. Uma palavra muda tudo."
  },
  {
    icon: "⚙️",
    title: "BJ Fogg — Tiny Habits",
    text: "O pesquisador de Stanford BJ Fogg passou décadas estudando formação de hábitos e chegou a uma conclusão contraintuitiva: o tamanho do hábito importa mais do que a motivação. Um hábito minúsculo feito todo dia cria uma identidade. Abrir o LEXIO por 2 minutos toda manhã é mais poderoso do que estudar 2 horas no fim de semana."
  },
  {
    icon: "🎯",
    title: "Anders Ericsson — Peak",
    text: "Anders Ericsson, o cientista por trás do conceito das 10.000 horas, deixou claro que o que importa não é o tempo — é a prática deliberada. Prática deliberada significa focar no que ainda não domina, não no que já sabe. O sistema de testes do LEXIO faz exatamente isso: te testa nas palavras que você ainda não dominou, não nas que você já acertou."
  },
  {
    icon: "💡",
    title: "Daniel Kahneman — Thinking Fast and Slow",
    text: "O Nobel Daniel Kahneman descobriu que o cérebro tem dois sistemas: o Sistema 1, rápido e automático, e o Sistema 2, lento e consciente. Fluência em idiomas é quando as palavras migram para o Sistema 1 — você fala sem pensar. Repetição espaçada é o mecanismo exato que faz essa migração acontecer. Cada acerto no LEXIO é um passo nessa direção."
  },
  {
    icon: "🌱",
    title: "Robert Cialdini — Influence",
    text: "Cialdini identificou o princípio do Comprometimento e Consistência: quando nos comprometemos com algo pequeno, o cérebro cria uma identidade em torno disso e busca ser consistente. Abrir o LEXIO hoje — mesmo por 5 minutos — cria um comprometimento interno. O cérebro vai querer abrir amanhã para ser consistente com quem ele decidiu que você é."
  },
  {
    icon: "🔥",
    title: "Angela Duckworth — Grit",
    text: "Angela Duckworth estudou por anos o que diferencia pessoas que alcançam domínio das que desistem. A resposta não foi talento — foi Grit: paixão combinada com perseverança de longo prazo. Ela descobriu que as pessoas mais bem-sucedidas não são as mais talentosas, são as que voltam no dia seguinte depois de errar. Abrir o LEXIO após um dia ruim é Grit em ação."
  },
  {
    icon: "🧬",
    title: "Andrew Huberman — Neuroplasticidade",
    text: "O neurocientista de Stanford Andrew Huberman explica que o cérebro adulto só entra em modo de neuroplasticidade — onde novas conexões neurais são formadas — quando há foco, novidade e um leve desconforto. Os testes auditivos do LEXIO ativam exatamente esse estado. O desconforto de não saber a resposta é o sinal de que seu cérebro está mudando."
  },
  {
    icon: "📚",
    title: "Malcolm Gladwell — Outliers",
    text: "Gladwell popularizou a ideia de que contexto e repetição acumulada criam maestria. O que ele não disse explicitamente — mas Ericsson sim — é que repetição espaçada é mais eficiente que repetição massiva. 10 minutos por dia por 1 ano supera 60 horas concentradas em um mês. O LEXIO foi desenhado para o tempo longo. Confie no processo."
  },
  {
    icon: "🪞",
    title: "Brené Brown — A Coragem de Ser Imperfeito",
    text: "Brené Brown pesquisou vulnerabilidade por décadas e descobriu que a vergonha de errar é o maior bloqueador de aprendizado em adultos. Adultos param de aprender idiomas não por falta de capacidade — por medo de soar ridículo. Errar no teste do LEXIO, sozinho, sem audiência, é o treino seguro que prepara você para arriscar no mundo real."
  },
  {
    icon: "⏳",
    title: "Nassim Taleb — Antifrágil",
    text: "Taleb descreve sistemas que ficam mais fortes com o estresse — ao contrário de frágeis, que quebram. O cérebro humano é antifrágil para aprendizado: cada erro, cada esforço de recuperar uma palavra que você quase esqueceu, torna a memória mais resistente. Errar no teste não é falha — é o estresse que fortalece o sistema."
  }
];