# 🚀 Comandos para Deploy no Railway

## 📋 **Sequência de Comandos:**

### 1. **Preparar o Repositório:**
```bash
# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos (exceto .env - já protegido)
git add .

# Commit inicial
git commit -m "Ralph Coins Bot - Deploy Railway"
```

### 2. **Criar Repositório no GitHub:**
1. Acesse [github.com](https://github.com)
2. Clique em "New repository"
3. Nome: `ralph-coins-bot`
4. **NÃO** marque "Add .gitignore" (já temos)
5. **NÃO** marque "Add README" (já temos)
6. Clique "Create repository"

### 3. **Conectar e Enviar:**
```bash
# Conectar repositório local ao GitHub
git remote add origin https://github.com/SEU_USUARIO/ralph-coins-bot.git

# Renomear branch para main
git branch -M main

# Enviar para GitHub
git push -u origin main
```

### 4. **Deploy no Railway:**
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha "ralph-coins-bot"
6. Clique "Deploy Now"

### 5. **Configurar Variáveis de Ambiente no Railway:**
**No painel do Railway:**
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

### 6. **Configurar Comando de Inicialização:**
**No painel do Railway:**
1. Clique em "Settings"
2. Na seção "Deploy"
3. Em "Start Command" coloque:
```bash
npm run ralph-coins-start
```

### 7. **Deploy Final:**
1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. Clique em "View Logs"
4. Procure por: "✅ Agendador Ralph Coins iniciado com sucesso!"

---

## 🔐 **Verificação de Segurança:**

```bash
# Verificar se .env está sendo ignorado
git status

# Se .env aparecer, remover do Git
git rm --cached .env
git commit -m "Remove .env from tracking"
```

---

## 📊 **Monitoramento:**

- **Logs:** Painel do Railway → "View Logs"
- **Tweets:** @Crypto_realtime no Twitter
- **Horários:** 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h, 23h

---

## 🎯 **Resultado:**

✅ Bot rodando 24/7 no Railway  
✅ 9 posts automáticos por dia  
✅ Notícias reais via Brave Search  
✅ Links diretos para matérias  
✅ Chaves protegidas e seguras  

**🚀 Seu Ralph Coins Bot estará funcionando perfeitamente!**
