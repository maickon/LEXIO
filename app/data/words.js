/**
 * LEXIO — BANCO DE DADOS DE PALAVRAS
 * =====================================================
 * Como preencher:
 *  - id:       número único (não repita)
 *  - rank:     posição no ranking de palavras mais usadas
 *  - en:       a palavra em inglês
 *  - pt:       tradução principal em português
 *  - phonetic: pronúncia fonética simplificada
 *  - images:   array de até 4 URLs diretas de imagens (JPG/PNG/WEBP)
 *              Dica: use Unsplash, Pexels ou qualquer URL pública direta
 *              Ex: "https://images.unsplash.com/photo-ID?w=300&q=80"
 *  - phrases:  array de objetos { en, pt, key }
 *              - en:  frase em inglês
 *              - pt:  tradução da frase
 *              - key: a palavra-chave EXATAMENTE como aparece na frase (para destacar)
 *              Coloque entre 8 e 12 frases por palavra.
 * =====================================================
 */

const WORDS_DB = [
  {
    id: 1,
    rank: 1,
    en: "the",
    pt: "o / a (artigo definido)",
    phonetic: "/ðə/",
    images: [
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80"
    ],
    phrases: [
      { en: "The sun is shining today.",        pt: "O sol está brilhando hoje.",             key: "The" },
      { en: "I love the beach.",                pt: "Eu amo a praia.",                        key: "the" },
      { en: "She is the best in the class.",    pt: "Ela é a melhor da turma.",               key: "the" },
      { en: "The movie was amazing.",           pt: "O filme foi incrível.",                  key: "The" },
      { en: "Open the door, please.",           pt: "Abra a porta, por favor.",               key: "the" },
      { en: "The sky is so blue today.",        pt: "O céu está tão azul hoje.",              key: "The" },
      { en: "He left the office early.",        pt: "Ele saiu do escritório cedo.",           key: "the" },
      { en: "The food here is delicious.",      pt: "A comida aqui é deliciosa.",             key: "The" },
      { en: "I read the book in one day.",      pt: "Li o livro em um dia.",                  key: "the" },
      { en: "Can you pass the salt?",           pt: "Você pode passar o sal?",                key: "the" },
      { en: "The music is too loud.",           pt: "A música está alta demais.",             key: "The" },
      { en: "She crossed the street quickly.",  pt: "Ela atravessou a rua rapidamente.",      key: "the" }
    ]
  },
  {
    id: 2,
    rank: 2,
    en: "be",
    pt: "ser / estar",
    phonetic: "/biː/",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&q=80",
      "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=300&q=80",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=300&q=80",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=300&q=80"
    ],
    phrases: [
      { en: "I want to be a doctor.",           pt: "Quero ser médico.",                      key: "be" },
      { en: "She will be here soon.",           pt: "Ela estará aqui em breve.",              key: "be" },
      { en: "It can be done easily.",           pt: "Pode ser feito facilmente.",             key: "be" },
      { en: "Don't be afraid.",                 pt: "Não tenha medo.",                        key: "be" },
      { en: "You need to be patient.",          pt: "Você precisa ter paciência.",            key: "be" },
      { en: "I used to be very shy.",           pt: "Eu costumava ser muito tímido.",         key: "be" },
      { en: "She seems to be happy.",           pt: "Ela parece estar feliz.",                key: "be" },
      { en: "That must be the answer.",         pt: "Essa deve ser a resposta.",              key: "be" },
      { en: "I'll be back in a minute.",        pt: "Voltarei em um minuto.",                 key: "be" },
      { en: "How can this be real?",            pt: "Como isso pode ser real?",               key: "be" },
      { en: "We want to be ready.",             pt: "Queremos estar prontos.",                key: "be" },
      { en: "To be honest, I'm not sure.",      pt: "Para ser honesto, não tenho certeza.",   key: "be" }
    ]
  },
  {
    id: 3,
    rank: 3,
    en: "to",
    pt: "para / a (preposição / infinitivo)",
    phonetic: "/tuː/",
    images: [
      "https://images.unsplash.com/photo-1490650404312-a2175773bbf7?w=300&q=80",
      "https://images.unsplash.com/photo-1519121785383-3229633bb75b?w=300&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=80",
      "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=300&q=80"
    ],
    phrases: [
      { en: "I'm going to the store.",          pt: "Estou indo para a loja.",                key: "to" },
      { en: "Nice to meet you.",                pt: "Prazer em conhecê-lo.",                  key: "to" },
      { en: "I want to learn English.",         pt: "Quero aprender inglês.",                 key: "to" },
      { en: "We need to talk.",                 pt: "Precisamos conversar.",                  key: "to" },
      { en: "I'm trying to sleep.",             pt: "Estou tentando dormir.",                 key: "to" },
      { en: "Welcome to the team.",             pt: "Bem-vindo à equipe.",                    key: "to" },
      { en: "It's easy to understand.",         pt: "É fácil de entender.",                   key: "to" },
      { en: "I forgot to call her.",            pt: "Esqueci de ligar para ela.",             key: "to" },
      { en: "This belongs to me.",              pt: "Isso pertence a mim.",                   key: "to" },
      { en: "Talk to me, please.",              pt: "Fale comigo, por favor.",                key: "to" },
      { en: "She went to school early.",        pt: "Ela foi para a escola cedo.",            key: "to" },
      { en: "He listened to music all night.",  pt: "Ele ouviu música a noite toda.",         key: "to" }
    ]
  },
  {
    id: 4,
    rank: 4,
    en: "have",
    pt: "ter / possuir",
    phonetic: "/hæv/",
    images: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&q=80",
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&q=80",
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=300&q=80"
    ],
    phrases: [
      { en: "I have a question.",               pt: "Tenho uma pergunta.",                    key: "have" },
      { en: "Do you have the time?",            pt: "Você tem as horas?",                     key: "have" },
      { en: "Have a great day!",                pt: "Tenha um ótimo dia!",                    key: "Have" },
      { en: "She doesn't have money.",          pt: "Ela não tem dinheiro.",                  key: "have" },
      { en: "I have to go now.",                pt: "Tenho que ir agora.",                    key: "have" },
      { en: "Have you ever been to London?",    pt: "Você já esteve em Londres?",             key: "Have" },
      { en: "I have a meeting soon.",           pt: "Tenho uma reunião em breve.",            key: "have" },
      { en: "Can I have some water?",           pt: "Posso pegar um pouco d'água?",           key: "have" },
      { en: "I have no idea.",                  pt: "Não faço ideia.",                        key: "have" },
      { en: "Have fun on your trip!",           pt: "Se divirta na sua viagem!",              key: "Have" },
      { en: "They have two children.",          pt: "Eles têm dois filhos.",                  key: "have" },
      { en: "I have a feeling about this.",     pt: "Tenho um pressentimento sobre isso.",    key: "have" }
    ]
  },
  {
    id: 5,
    rank: 5,
    en: "good",
    pt: "bom / boa",
    phonetic: "/ɡʊd/",
    images: [
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=300&q=80",
      "https://images.unsplash.com/photo-1552581234-26160f608093?w=300&q=80",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&q=80",
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&q=80"
    ],
    phrases: [
      { en: "Good morning!",                    pt: "Bom dia!",                               key: "Good" },
      { en: "That's a good point.",             pt: "Esse é um bom ponto.",                   key: "good" },
      { en: "She's really good at cooking.",    pt: "Ela é muito boa em cozinhar.",           key: "good" },
      { en: "Good luck on your test!",          pt: "Boa sorte na sua prova!",                key: "Good" },
      { en: "It feels so good.",                pt: "Parece tão bom.",                        key: "good" },
      { en: "Have a good weekend!",             pt: "Tenha um bom fim de semana!",            key: "good" },
      { en: "That's not good enough.",          pt: "Isso não é bom o suficiente.",           key: "good" },
      { en: "Good job! Keep it up.",            pt: "Bom trabalho! Continue assim.",          key: "Good" },
      { en: "The food smells good.",            pt: "A comida cheira bem.",                   key: "good" },
      { en: "I'm in a good mood today.",        pt: "Estou de bom humor hoje.",               key: "good" },
      { en: "He's a good friend.",              pt: "Ele é um bom amigo.",                    key: "good" },
      { en: "Everything looks good.",           pt: "Tudo parece bom.",                       key: "good" }
    ]
  },

  // ──────────────────────────────────────────────────
  // ADICIONE MAIS PALAVRAS ABAIXO SEGUINDO O PADRÃO
  // ──────────────────────────────────────────────────
  // {
  //   id: 6,
  //   rank: 6,
  //   en: "say",
  //   pt: "dizer / falar",
  //   phonetic: "/seɪ/",
  //   images: [
  //     "https://images.unsplash.com/photo-XXXXXX?w=300&q=80",
  //     "https://images.unsplash.com/photo-XXXXXX?w=300&q=80",
  //     "https://images.unsplash.com/photo-XXXXXX?w=300&q=80",
  //     "https://images.unsplash.com/photo-XXXXXX?w=300&q=80"
  //   ],
  //   phrases: [
  //     { en: "What did you say?",    pt: "O que você disse?",    key: "say" },
  //     ...
  //   ]
  // },
];
