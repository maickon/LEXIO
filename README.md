# LEXIO — English Mastery System

App web PWA para aprender inglês com as palavras mais usadas do idioma.  
Mobile-first · Dark Neon Gamer · Funciona 100% offline após instalação.

---

## 📁 Estrutura de Arquivos

```
lexio/
  ├── app/
  ├────── index.html              # App shell principal
  ├────── manifest.json           # PWA manifest
  ├────── sw.js                   # Service Worker (offline + push)
  ├────── css/
  │       └── style.css           # Estilos (mobile-first)
  │       └── landing.css         # Estilos Lnading page (mobile-first)
  ├────── js/
  │       ├── db.js               # IndexedDB wrapper
  │       ├── landing.js          # JS da Landing page
  │       ├── state.js            # Gerenciamento de estado
  │       ├── ui.js               # Utilitários de UI
  │       ├── audio.js            # TTS / áudio
  │       ├── pages.js            # Renderização de páginas
  │       └── app.js              # Bootstrap / auth
  ├────── data/
  │       ├── config.js           # ⚙️ CONFIGURAÇÕES (edite aqui)
  │       ├── words.js            # 📚 BANCO DE PALAVRAS (edite aqui)
  │       └── habits.js           # 💡 Dicas de hábitos
  ├────── icons/
  │       ├── icon-192.png
  │       └── icon-512.png
  ├────── .github/
  |        └── workflows/
  |            └── deploy.yml     # Deploy automático no GitHub Pages
  ├── index.html                  # Landing page
```

---

## 🚀 Deploy no GitHub Pages

### 1. Crie o repositório
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/SEU-USER/lexio.git
git push -u origin main
```

### 2. Ative o GitHub Pages
- Vá em **Settings → Pages**
- Source: **GitHub Actions**
- O workflow `.github/workflows/deploy.yml` faz o deploy automaticamente a cada push

### 3. Seu app estará em:
```
https://SEU-USER.github.io/lexio/
```

---

## 🔔 Configurar Push Notifications (OneSignal)

### Passo a passo:
1. Crie conta em [onesignal.com](https://onesignal.com)
2. **New App → Web Push**
3. Configure:
   - **Site URL:** `https://SEU-USER.github.io`
   - **Default Icon:** URL do seu `icon-192.png`
4. Copie o **App ID** gerado
5. Abra `data/config.js` e cole:
   ```js
   oneSignalAppId: "SEU-APP-ID-AQUI",
   ```
6. Para enviar lembretes automáticos:
   - No painel OneSignal: **Messages → Automated**
   - Crie mensagens recorrentes (ex: diariamente às 20h)
   - Use os textos de `reminderMessages` em `data/config.js`

---

## 📚 Adicionar Palavras ao Banco

Abra `data/words.js` e siga o padrão:

```js
{
  id: 6,           // número único
  rank: 6,         // posição no ranking de frequência
  en: "say",       // palavra em inglês
  pt: "dizer / falar",
  phonetic: "/seɪ/",
  images: [
    // Use URLs diretas de imagens públicas
    // Unsplash: https://images.unsplash.com/photo-ID?w=300&q=80
    // Pexels:   https://images.pexels.com/photos/ID/...?w=300
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
    "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=300&q=80",
    "https://images.unsplash.com/photo-1499155286265-79a3a8965d5f?w=300&q=80",
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&q=80"
  ],
  phrases: [
    { en: "What did you say?",         pt: "O que você disse?",        key: "say" },
    { en: "Say it again, please.",     pt: "Diga novamente, por favor.", key: "Say" },
    // ... mínimo 8, ideal 12 frases
  ]
}
```

### Dica para encontrar imagens Unsplash:
1. Vá em [unsplash.com](https://unsplash.com)
2. Pesquise a palavra em inglês
3. Clique na foto → botão direito → "Copiar endereço da imagem"
4. Adicione `?w=300&q=80` no final para otimizar o tamanho

---

## ⚙️ Configurações Principais (`data/config.js`)

| Config | Descrição |
|--------|-----------|
| `oneSignalAppId` | ID do app no OneSignal |
| `phrasesPerWord` | Frases sorteadas por palavra (padrão: 8) |
| `masteryThreshold` | Acertos para dominar uma palavra (padrão: 5) |
| `demoMode` | `true` = pula verificação de pagamento |
| `authApiUrl` | URL da sua API de autenticação/pagamento |

---

## 📱 Instalar como App (PWA)

### Android (Chrome):
- Acesse o site → menu ⋮ → **"Adicionar à tela inicial"**

### iOS (Safari):
- Acesse o site → botão compartilhar → **"Adicionar à Tela de Início"**

---

## 🎮 Como funciona o jogo

1. **Aprendizado** → Veja a palavra, ouça, veja as frases, associe às imagens → Marque como aprendida
2. **Testes** → O app reproduz a palavra/frase em áudio → Você digita exatamente o que ouviu
3. **Domínio** → 5 acertos corretos = palavra dominada → vai para "Evolução"
4. **Meta** → Dominar todas as palavras = zerar o jogo

---

## 🧠 Base Científica

- **Lei de Zipf**: as 1.000 palavras mais comuns cobrem ~80% da fala cotidiana
- **Spaced Repetition**: palavras erradas voltam mais rápido; acertadas somem gradualmente
- **Input compreensível (Krashen)**: frases contextualizadas aceleram aquisição
- **Output forçado**: digitar o que ouviu ativa memória ativa (não só passiva)
- **Multi-sensorial**: texto + áudio + imagem = 3x mais retenção
