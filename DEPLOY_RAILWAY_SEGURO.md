# 🚀 Deploy Seguro no Railway - Ralph Coins Bot

## 🔐 **PROTEÇÃO DAS CHAVES - IMPORTANTE!**

### ⚠️ **NUNCA commite as chaves no GitHub!**

---

## 📋 **Passo a Passo Seguro:**

### 1. **Preparar o Repositório GitHub**

```bash
# 1. Inicializar Git (se ainda não foi feito)
git init

# 2. Adicionar arquivos (EXCETO .env)
git add .
git add -f .gitignore  # Forçar adicionar .gitignore

# 3. Commit inicial
git commit -m "Ralph Coins Bot - Deploy Railway"

# 4. Criar repositório no GitHub
# - Acesse github.com
# - Clique em "New repository"
# - Nome: ralph-coins-bot
# - NÃO marque "Add .gitignore" (já temos)
# - NÃO marque "Add README" (já temos)

# 5. Conectar repositório local
git remote add origin https://github.com/SEU_USUARIO/ralph-coins-bot.git
git branch -M main
git push -u origin main
```

### 2. **Configurar .gitignore (CRÍTICO!)**

Criar/verificar arquivo `.gitignore`:
```gitignore
# Environment variables (CRÍTICO!)
.env
.env.local
.env.production

# Logs
logs/
*.log

# Node modules
node_modules/

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/

# Temporary files
*.tmp
*.temp
```

### 3. **Deploy no Railway**

```bash
# 1. Acesse railway.app
# 2. Faça login com GitHub
# 3. Clique em "New Project"
# 4. Selecione "Deploy from GitHub repo"
# 5. Escolha "ralph-coins-bot"
# 6. Clique em "Deploy Now"
```

### 4. **Configurar Variáveis de Ambiente no Railway**

**NO PAINEL DO RAILWAY:**
1. Clique no seu projeto
2. Clique na aba "Variables"
3. Adicione cada variável:

```env
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAALVr4gEAAAAAhTiPcN7DHdPzotG9iZWI6QuluGY%3DioQuKIDFPLpDb6FU4r9TM44nxHcbKEqavcU5t0PyBMStRvibiL

TWITTER_API_KEY=qlby7ckhfpNacZKFcpGc9DyYE

TWITTER_API_SECRET=fNCfjTShiAfMggT9GR1SMk16FM5O5rgrglzWbj46tNuLxT7ECH

TWITTER_ACCESS_TOKEN=1974605294601646080-gqxWforFOi8PGE853a7xY7M6wIGIGO

TWITTER_ACCESS_TOKEN_SECRET=Rgphm2wFUMbq7HijqTqAbFok8EXLpmWkBgaxk2GvSkC58

BRAVE_API_KEY=sua_chave_brave_aqui

OPENAI_API_KEY=sua_chave_openai_aqui

LOG_LEVEL=info
```

### 5. **Configurar Comando de Inicialização**

**NO PAINEL DO RAILWAY:**
1. Clique em "Settings"
2. Na seção "Deploy"
3. Em "Start Command" coloque:
```bash
npm run ralph-coins-start
```

### 6. **Deploy e Monitoramento**

```bash
# 1. No Railway, clique em "Deploy"
# 2. Aguarde o build (2-3 minutos)
# 3. Clique em "View Logs" para acompanhar
# 4. Verifique se aparece: "✅ Agendador Ralph Coins iniciado com sucesso!"
```

---

## 🔍 **Verificação de Segurança:**

### ✅ **Checklist de Segurança:**
- [ ] `.env` está no `.gitignore`
- [ ] `.env` NÃO foi commitado
- [ ] Variáveis estão configuradas no Railway
- [ ] Repositório GitHub não contém chaves
- [ ] Logs mostram inicialização correta

### 🚨 **Se algo der errado:**
```bash
# Verificar se .env está sendo ignorado
git status

# Se .env aparecer, remover do Git
git rm --cached .env
git commit -m "Remove .env from tracking"

# Forçar push
git push --force-with-lease
```

---

## 📊 **Monitoramento:**

### **Logs do Railway:**
- Acesse o painel do Railway
- Clique em "View Logs"
- Procure por:
  - "✅ Ralph Coins Bot inicializado com sucesso!"
  - "📅 Posts agendados: 8h, 10h, 12h..."
  - "⏰ Executando post agendado..."

### **Verificar Tweets:**
- Acesse @Crypto_realtime no Twitter
- Verifique se os tweets estão sendo postados
- Horários: 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h, 23h

---

## 🛠️ **Comandos Úteis:**

```bash
# Verificar status local
npm run ralph-coins-status

# Testar post local
npm run ralph-coins-now

# Ver logs do Railway
# (via painel web do Railway)
```

---

## 🎯 **Resultado Final:**

**Após o deploy bem-sucedido:**
- ✅ Bot rodando 24/7 no Railway
- ✅ 9 posts automáticos por dia
- ✅ Notícias reais via Brave Search
- ✅ Links diretos para matérias
- ✅ Chaves protegidas e seguras
- ✅ Logs em tempo real

---

## 🚨 **IMPORTANTE - SEGURANÇA:**

1. **NUNCA** commite o arquivo `.env`
2. **SEMPRE** use variáveis de ambiente no Railway
3. **VERIFIQUE** se as chaves não estão no GitHub
4. **MONITORE** os logs regularmente
5. **MANTENHA** as chaves seguras

---

**🚀 Seu Ralph Coins Bot estará seguro e funcionando perfeitamente no Railway!**
