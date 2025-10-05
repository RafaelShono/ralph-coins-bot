#!/bin/bash

echo "🚀 Deploy Ralph Coins Bot para Railway"
echo "======================================"

# Verificar se .env existe
if [ -f ".env" ]; then
    echo "⚠️  ATENÇÃO: Arquivo .env encontrado!"
    echo "✅ Verificando se está no .gitignore..."
    
    if git check-ignore .env > /dev/null 2>&1; then
        echo "✅ .env está sendo ignorado pelo Git - SEGURO!"
    else
        echo "❌ ERRO: .env NÃO está sendo ignorado!"
        echo "🔧 Adicionando .env ao .gitignore..."
        echo ".env" >> .gitignore
        git add .gitignore
        git commit -m "Add .env to .gitignore"
    fi
else
    echo "ℹ️  Arquivo .env não encontrado (normal para deploy)"
fi

# Verificar status do Git
echo ""
echo "📋 Status do Git:"
git status --porcelain

# Adicionar arquivos (exceto .env)
echo ""
echo "📦 Adicionando arquivos ao Git..."
git add .

# Commit
echo ""
echo "💾 Fazendo commit..."
git commit -m "Deploy Ralph Coins Bot para Railway - $(date)"

# Push para GitHub
echo ""
echo "🚀 Enviando para GitHub..."
git push origin main

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse railway.app"
echo "2. Conecte sua conta GitHub"
echo "3. Selecione o repositório ralph-coins-bot"
echo "4. Configure as variáveis de ambiente"
echo "5. Defina o comando: npm run ralph-coins-start"
echo "6. Deploy!"
echo ""
echo "🔐 LEMBRE-SE: Configure as variáveis de ambiente no Railway!"
echo "   - TWITTER_BEARER_TOKEN"
echo "   - TWITTER_API_KEY"
echo "   - TWITTER_API_SECRET"
echo "   - TWITTER_ACCESS_TOKEN"
echo "   - TWITTER_ACCESS_TOKEN_SECRET"
echo "   - BRAVE_API_KEY (opcional)"
echo "   - OPENAI_API_KEY (opcional)"
